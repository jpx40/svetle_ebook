import { emit } from "@tauri-apps/api/event";

import { open } from "@tauri-apps/plugin-dialog";
import surreal from "./surreal";
import { new_elem } from "./util";

const { on } = surreal;

// export function add_event_listeners() {
//   let e = new CustomEvent("added_book", {
//     detail: {
//       file: file
//     }
//   });
// }
export async function file_picker(e, ev = null) {
  let button = new_elem("button");
  button.classList.add(
    "bg-blue-500",
    "text-white",
    "font-bold",
    "py-2",
    "px-4",
    "rounded"
  );
  button.textContent = "add book";
  let b = on(button, "click", async () => {
    var file = await open({
      multiple: false,
      directory: false
    });

    console.log(file);
    emit("1", {
      file: file
    });
  });

  e.appendChild(b);
}
