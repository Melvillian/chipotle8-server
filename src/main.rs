use chipotle8::{DisplayChange, Emulator};
use futures::{FutureExt, StreamExt};
use serde::Serialize;
use serde_json::Result as JsonResult;
use std::collections::HashMap;
use std::sync::{
    atomic::{AtomicUsize, Ordering},
    Arc,
};
use std::thread;
use tokio::sync::{mpsc, Mutex};
use warp::ws::{Message, WebSocket};
use warp::Filter;

/// the static HTML to serve
static INDEX_HTML_PATH: &str = "index.html";
static WORKER_JS_PATH: &str = "frontend/dist/worker.js";

/// Our state of currently connected users.
///
/// - Key is their id
/// - Value is a sender of `warp::ws::Message`
type Users = Arc<
    Mutex<
        HashMap<
            usize,
            (
                Arc<Mutex<mpsc::UnboundedSender<Result<Message, warp::Error>>>>,
                Arc<Mutex<Emulator>>,
            ),
        >,
    >,
>;

#[derive(Debug, Serialize)]
struct DisplayChangeMessage {
    changes: Vec<DisplayChange>,
    r#type: &'static str,
}

/// Our global unique user id counter.
static NEXT_USER_ID: AtomicUsize = AtomicUsize::new(1);

#[tokio::main]
async fn main() {
    pretty_env_logger::init();

    let users = Arc::new(Mutex::new(HashMap::new()));
    let users = warp::any().map(move || users.clone());

    // GET / -> index html
    let index = warp::get()
        .and(warp::path::end())
        .and(warp::fs::file(INDEX_HTML_PATH));

    // expose all of the files in dist/
    let bundle = warp::path("frontend")
        .and(warp::path("dist"))
        .and(warp::fs::dir("frontend/dist"));

    // expose the worker code path
    let worker = warp::path("worker.js")
        .and(warp::path::end())
        .and(warp::fs::file(WORKER_JS_PATH));

    // GET /chat -> websocket upgrade
    let chat = warp::path("echo")
        // The `ws()` filter will prepare the Websocket handshake.
        .and(warp::ws())
        .and(users)
        .map(|ws: warp::ws::Ws, users| {
            // This will call our function if the handshake succeeds.
            ws.on_upgrade(move |socket| user_connected(socket, users))
        });

    let routes = index.or(worker).or(chat).or(bundle);

    warp::serve(routes).run(([127, 0, 0, 1], 3000)).await;
}

async fn user_connected(ws: WebSocket, users: Users) {
    // Use a counter to assign a new unique ID for this user.
    let my_id = NEXT_USER_ID.fetch_add(1, Ordering::Relaxed);

    println!("new user: {}", my_id);

    let (emulator_ws_tx, mut emulator_ws_rx) = ws.split();

    // Use an unbounded channel to handle buffering and flushing of messages
    // to the websocket...
    let (tx, rx) = mpsc::unbounded_channel();
    tokio::task::spawn(rx.forward(emulator_ws_tx).map(|result| {
        if let Err(e) = result {
            eprintln!("websocket send error: {}", e);
        }
    }));

    // Save the sender in our list of connected users.
    let emulator = Arc::new(Mutex::new(Emulator::with_game_file("games/PONG").unwrap()));
    let shared_tx = Arc::new(Mutex::new(tx));
    users
        .lock()
        .await
        .insert(my_id, (shared_tx.clone(), emulator.clone()));

    // spawn a separate thread which runs the emulator indefinitely
    // TODO: break out of the loop and clean things up if all users
    // disconnect
    tokio::spawn(async move {
        loop {
            thread::sleep(std::time::Duration::from_millis(
                chipotle8::CYCLE_INTERVAL_MS,
            ));

            let mut emulator = emulator.lock().await;

            // execute the current operation and draw the display if it changed
            if let Some(op) = emulator.cycle() {
                if op.is_display_op() {
                    let changes = emulator.flush_changes();

                    let display_change_message = serde_json::to_string(&DisplayChangeMessage {
                        r#type: "displaychange",
                        changes,
                    })
                    .unwrap();

                    if let Err(_disconnected) = shared_tx
                        .clone()
                        .lock()
                        .await
                        .send(Ok(Message::text(display_change_message)))
                    {
                        // The tx is disconnected, our `user_disconnected` code
                        // should be happening in another task, nothing more to
                        // do here.
                    }
                }
            }
        }
    });

    // Every time the user sends a message, broadcast it to
    // all other users...
    while let Some(result) = emulator_ws_rx.next().await {
        let msg = match result {
            Ok(msg) => msg,
            Err(e) => {
                eprintln!("websocket error: {}", e);
                break;
            }
        };

        user_message(my_id, msg, &users).await;
    }
}

async fn user_message(my_id: usize, msg: Message, users: &Users) {
    // TODO: implement key event handling
}

// TODO: implement game room creation and adding a user to the room
