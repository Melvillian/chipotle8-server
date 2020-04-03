use chipotle8::Interpreter;
use futures::{FutureExt, StreamExt};
use warp::Filter;

/// the static HTML to serve
static INDEX_HTML_PATH: &str = "public/index.html";

#[tokio::main]
async fn main() {
    pretty_env_logger::init();

    // GET / -> index html
    let index = warp::get()
        .and(warp::path::end())
        .and(warp::fs::file(INDEX_HTML_PATH));

    // let bundle = warp::get()
    //     .and(warp::path!("public" / "app.js"))
    //     .and(warp::path::end())
    //     .and(warp::fs::file("/public/app.js"));
    let bundle = warp::path("public").and(warp::fs::dir("public"));

    // GET /chat -> websocket upgrade
    let chat = warp::path("echo")
        // The `ws()` filter will prepare the Websocket handshake.
        .and(warp::ws())
        .map(|ws: warp::ws::Ws| {
            // And then our closure will be called when it completes...
            ws.on_upgrade(|websocket| {
                // Just echo all messages back...
                let (tx, rx) = websocket.split();

                let interpreter = Interpreter::with_game_file("data/PONG");

                rx.forward(tx).map(|result| {
                    if let Err(e) = result {
                        eprintln!("websocket error: {:?}", e);
                    }
                })
            })
        });

    let routes = index.or(chat).or(bundle);

    warp::serve(routes).run(([127, 0, 0, 1], 3000)).await;
}
