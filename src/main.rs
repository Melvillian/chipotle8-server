use chipotle8::Interpreter;
use futures::{FutureExt, StreamExt};
use warp::Filter;
use warp::ws::{Message, WebSocket};
use std::thread;
use std::sync::{
    atomic::{AtomicUsize, Ordering},
    Arc,
};
use std::collections::HashMap;
use tokio::sync::{Mutex, mpsc};

/// the static HTML to serve
static INDEX_HTML_PATH: &str = "dist/index.html";

/// Our state of currently connected users.
///
/// - Key is their id
/// - Value is a sender of `warp::ws::Message`
type Users = Arc<Mutex<HashMap<usize, (Arc<Mutex<mpsc::UnboundedSender<Result<Message, warp::Error>>>>, Arc<Mutex<Interpreter>>)>>>;

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
    let bundle = warp::path("dist").and(warp::fs::dir("dist"));

    // GET /chat -> websocket upgrade
    let chat = warp::path("echo")
        // The `ws()` filter will prepare the Websocket handshake.
        .and(warp::ws())
        .and(users)
        .map(|ws: warp::ws::Ws, users| {
            // This will call our function if the handshake succeeds.
            ws.on_upgrade(move |socket| user_connected(socket, users))
        });
            
    let routes = index.or(chat).or(bundle);

    warp::serve(routes).run(([127, 0, 0, 1], 3000)).await;
}

async fn user_connected(ws: WebSocket, users: Users) {
    // Use a counter to assign a new unique ID for this user.
    let my_id = NEXT_USER_ID.fetch_add(1, Ordering::Relaxed);

    println!("new user: {}", my_id);

    let (interpreter_ws_tx, mut interpreter_ws_rx) = ws.split();  

    // Use an unbounded channel to handle buffering and flushing of messages
    // to the websocket...
    let (tx, rx) = mpsc::unbounded_channel();
    tokio::task::spawn(rx.forward(interpreter_ws_tx).map(|result| {
        if let Err(e) = result {
            eprintln!("websocket send error: {}", e);
        }
    }));

    // Save the sender in our list of connected users.
    let interpreter = Arc::new(Mutex::new(Interpreter::with_game_file("data/PONG").unwrap()));
    let shared_tx = Arc::new(Mutex::new(tx));
    users.lock().await.insert(my_id, (shared_tx, interpreter.clone()));

    // spawn a separate thread which runs the interpreter indefinitely
    // TODO: break out of the loop and clean things up if all users
    // disconnect
    tokio::spawn(async move {
        loop {
            thread::sleep(std::time::Duration::from_millis(
                chipotle8::TIMER_CYCLE_INTERVAL,
            ));

            let mut interpreter = interpreter.lock().await;
    
            // execute the current operation and draw the display if it changed
            if let Some(op) = interpreter.cycle() {
                if op.is_display_op() {
                    let changes = interpreter.flush_changes();
                    
                    let shared_tx = shared_tx.clone().lock().await;
                    for change in changes {
                        shared_tx.send(Ok(Message::text("hello".to_string())));
                    }
                }
            }
        }
    });

    // Every time the user sends a message, broadcast it to
    // all other users...
    while let Some(result) = interpreter_ws_rx.next().await {
        let msg = match result {
            Ok(msg) => msg,
            Err(e) => {
                eprintln!("websocket error: {}", e);
                break;
            }
        };
        //user_message(my_id, msg, &users).await;
    }
}