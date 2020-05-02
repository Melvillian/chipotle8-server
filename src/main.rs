use chipotle8::{AsKeyboard, DisplayChange, Emulator, Key};
use futures::{FutureExt, StreamExt};
use serde::{Serialize, Deserialize};
use std::collections::HashMap;
use std::sync::{
    atomic::{AtomicUsize, Ordering},
    Arc,
};
use tokio::sync::{mpsc, Mutex};
use warp::ws::{Message, WebSocket};
use warp::{Filter, Rejection, Reply, Stream};

/// the static HTML to serve
static INDEX_HTML_PATH: &str = "frontend/index.html";
static WORKER_JS_PATH: &str = "frontend/dist/worker.js";

/// Our state of currently connected users.
///
/// - Key is their id
/// - Value is a sender of `warp::ws::Message`
type Users = Arc<
    Mutex<
        HashMap<
            PlayerID,
            (
                GameChannel,
                Game,
            ),
        >,
    >,
>;
/// The unique ID of the player, used for messaging
type PlayerID = usize;
/// The Emulator's game state shared between 2 players
type Game = Arc<Mutex<Emulator>>;
/// A channel used to send messages between players via the server
type GameChannel = Arc<Mutex<mpsc::UnboundedSender<Result<Message, warp::Error>>>>;

/// Our global unique user id counter.
static NEXT_USER_ID: AtomicUsize = AtomicUsize::new(1);

#[tokio::main]
async fn main() {
    pretty_env_logger::init();
    let routes = setup_routes();

    warp::serve(routes).run(([127, 0, 0, 1], 3000)).await;
}

/// Build the routing service for serving the html and API endpoints
fn setup_routes() -> impl Filter<Extract = impl Reply, Error = Rejection> + Clone {
    let users = Arc::new(Mutex::new(HashMap::new()));
    let users = warp::any().map(move || users.clone());
    // GET / -> index html
    let index = warp::get()
        .and(warp::path::end())
        .and(warp::fs::file(INDEX_HTML_PATH));

    // expose all of the files in frontend/dist/

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
            ws.on_upgrade(move |socket| create_new_game(socket, users))
        });

    index.or(worker).or(chat).or(bundle)
}

async fn create_new_game(ws: WebSocket, users: Users) {
    let (ws_tx, ws_rx) = ws.split();

    // Use an unbounded channel to handle buffering and flushing of messages
    // to the websocket...
    let (server_tx, server_rx) = mpsc::unbounded_channel();
    tokio::task::spawn(server_rx.forward(ws_tx).map(|result| {
        if let Err(e) = result {
            eprintln!("websocket send error: {}", e);
        }
    }));

    // Create a new user and all the game state for the user's new game
    let my_id: PlayerID = NEXT_USER_ID.fetch_add(1, Ordering::Relaxed);
    let emulator: Game = Arc::new(Mutex::new(Emulator::with_game_file("games/PONG").unwrap()));
    let shared_tx: GameChannel = Arc::new(Mutex::new(server_tx));

    users
        .lock()
        .await
        .insert(my_id, (shared_tx.clone(), emulator.clone()));

    // start the game in a separate thread
    setup_game(emulator, shared_tx).await;

    // handle keyboard and other events from the players' clients
    setup_ws_msg_rcv(ws_rx, my_id, &users).await;
}

/// Run the emulator in another thread. We'll use the GameChannel to
/// send events to/from the emulator from/to the users
async fn setup_game(emulator: Game, shared_tx: GameChannel) {
    // spawn a separate thread which runs the emulator indefinitely
    // TODO: break out of the loop and clean things up if all users
    // disconnect
    tokio::spawn(async move {
        loop {
            let mut emulator = emulator.lock().await;

            // execute the current operation and draw the display if it changed
            if let Some(op) = emulator.cycle() {
                if op.is_display_op() {
                    std::thread::sleep(std::time::Duration::from_millis(3));

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
}

/// Setup the handler for messages sent by the client to the server via websocket
async fn setup_ws_msg_rcv(mut ws_rx: impl Stream<Item=Result<Message, warp::Error>> + std::marker::Unpin, my_id: PlayerID, users: &Users) {
    while let Some(result) = ws_rx.next().await {
        let msg = match result {
            Ok(msg) => msg,
            Err(e) => {
                eprintln!("websocket error: {}", e);
                break;
            }
        };

        handle_ws_message(&my_id, msg, &users).await
    }
}

/// Parse a websocket message from the client which either updates the
/// Emulator or sends a message to users in the game.
async fn handle_ws_message(my_id: &PlayerID, msg: Message, users: &Users) {
    match msg.to_str()
    .map_err(|_| format!("bad msg: {:?}", msg))
    .and_then(|s| {
        serde_json::from_str::<KeyChangeMessage>(s)
        .map_err(|_| format!("bad JSON parsing: {:?}", msg))
    }) {
        Ok(key_msg) => {
            let (_, _game) = users
            .lock()
            .await
            .get(my_id).unwrap();

            println!("{:?}", key_msg);
            // TODO add a keyboard object for each player and store it in the
            // users map so we can keep track of each player's keyboard state
        },
        Err(e) => eprintln!("{}", e),
    }
}

#[derive(Debug, Serialize)]
struct DisplayChangeMessage {
    changes: Vec<DisplayChange>,
    r#type: &'static str,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct KeyChangeMessage {
    is_up: bool,
    key: String,
}

impl AsKeyboard for KeyChangeMessage {
    fn keys_down(&self) -> Vec<Key> {
        (match self.key.as_ref() {
            "1" => Some(Key::Key1),
            "2" => Some(Key::Key2),
            "3" => Some(Key::Key3),
            "4" => Some(Key::C),
            "q" => Some(Key::Key4),
            "w" => Some(Key::Key5),
            "e" => Some(Key::Key6),
            "r" => Some(Key::D),
            "a" => Some(Key::Key7),
            "s" => Some(Key::Key8),
            "d" => Some(Key::Key9),
            "f" => Some(Key::E),
            "z" => Some(Key::A),
            "x" => Some(Key::Key0),
            "c" => Some(Key::B),
            "v" => Some(Key::F),
            _ => None,
        }).map_or_else(
            || vec![],
            |key| vec![key],
        )
    }
}