import { invoke } from "@tauri-apps/api/core";
import { add_gallery, get_books } from "./book_gallery";
import { afterload, elem } from "./util";
import { file_picker } from "./file_picker";
const { dirname } = window.__TAURI__.path;
async function init() {
  var books = await invoke("books", { name: "" });
  let books2 = JSON.parse(books);
  let root = elem("#root");
  await file_picker(root);

  add_gallery(get_books(10));
}

// function test_x() {

//  let e = on(el(new_elem("div"))
//    .class_add("bg-blue-500")
//    .classAdd(["w-full","h-full"]),"mousedown", () => {
//    console.log("test " + Math.round(Math.random()) )
//  })
//  e.textContent = "test"
//   elem("#root").append(e)
// }

// async function greet() {
//   // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
//   greetMsgEl.textContent = await invoke("greet", { name: greetInputEl.value });
// }

//   window.addEventListener("DOMContentLoaded", async() => {
//     greetInputEl = document.querySelector("#greet-input");
//     greetMsgEl = document.querySelector("#greet-msg");
//     home_elem = document.querySelector("#home");
//     document.querySelector("#greet-form").addEventListener("submit", (e) => {
//       e.preventDefault();
//       greet();

//     });
//     await set_homdir()
// test_x()

//   });

afterload(async () => {
  await init();
});

//setTimeout(() => remove_children(elem("#root")), 10000);
