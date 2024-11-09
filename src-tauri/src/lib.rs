use std::collections::HashMap;
use std::io::Read;
mod cover;
use std::io::Write;
use std::str::FromStr;
mod book_table;
mod store;
mod types;
mod util;
use tauri::Listener;
use tauri::Manager;

use crate::types::*; // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn books(_name: &str) -> String {
    // let mut b = HashMap::new();
    let mut s = String::new();

    // let book: HashMap<String,crate::cover::BookMeta> = serde_json::from_str(&buf).unwrap();
    if let Ok(mut b1) = crate::cover::BOOKS.lock() {
        s = serde_json::to_string(&b1.clone()).unwrap();
    }
    s
    // let books = crate::types::Books { books: b };

    //boot  serde_json::to_string(&books).unwrap()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    if std::path::Path::new("book_store.json").exists() {
        let mut file = std::fs::File::open("book_store.json").unwrap();

        let mut buf = String::new();
        file.read_to_string(&mut buf).unwrap();
        let book: HashMap<String, crate::cover::BookMeta> = serde_json::from_str(&buf).unwrap();
        if let Ok(mut b) = crate::cover::BOOKS.lock() {
            *b = book;
        }
    }
    tauri::Builder::default()
        .plugin(tauri_plugin_upload::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .setup(|app| {
            // listen to the `event-name` (emitted on any window)
            let id = app.listen("1", |event| {
                let e: crate::types::FilePayload = serde_json::from_str(event.payload()).unwrap();
                crate::book_table::unpack(
                    std::path::Path::new(e.file.as_str()),
                    "/home/jonas/code/rust/ebook_v/tmp/",
                );
                {
                    if let Ok(books) = crate::cover::BOOKS.lock() {
                        let b = books.clone();
                        let json = serde_json::to_string(&b).unwrap();

                        let mut file = std::fs::File::create("book_store.json").unwrap();
                        file.write_all(json.as_bytes()).unwrap();
                    }
                }
                // if  !std::path::Path::new("/home/jonas/code/rust/ebook_v/src-tauri/test.txt").exists() {
                // let mut file = std::fs::File::create_new("/home/jonas/code/rust/ebook_v/src-tauri/test.txt").unwrap();
                // file.write_all(e.file.as_bytes()).unwrap();
                // } else {
                //     let mut file = std::fs::File::open("/home/jonas/code/rust/ebook_v/src-tauri/test.txt").unwrap();
                //     let mut buf = String::new();
                //     file.read_to_string(&mut buf).unwrap();
                //     buf.push_str(&e.file);
                //     buf.push_str("\n");
                //     file.write_all(buf.as_bytes());
                // }
            });

            // unlisten to the event using the `id` returned on the `listen_global` function
            // a `once_global` API is also exposed on the `App` struct
            // app.unlisten(id);

            // emit the `event-name` event to all webview windows on the frontend
            Ok(())
        })
        // .plugin(tauri_plugin_localhost::Builder::new(todo!()).build())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, books])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
