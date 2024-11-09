  import surreal from "./surreal";
import { init_viewer } from "./ui";
const { dirname } = window.__TAURI__.path;

import { invoke } from "@tauri-apps/api/core";
import { exists, BaseDirectory, readFile} from '@tauri-apps/plugin-fs';

import { new_elem, new_frag, remove_children } from "./util";
const {on} =surreal


function open_book(url) {
  remove_children("root")
  let root = document.getElementById("root")
 //  root.innerHTML = `<select id="toc"></select>
	// <div id="viewer" class="scrolled"></div>`
  let frag = new_frag()
  let view_frame = new_elem("div")
  view_frame.classList.add("scrolled")
 var s= new_elem("select")
  init_viewer(url, view_frame, s)
  frag.appendChild(s)
  frag.appendChild(view_frame)
  root.appendChild(frag)
  
}
  function find_and_shadow() {
    
    const elements = document.querySelectorAll('bg-grey-500');
    
    for (elem of elements) {
    elem.className.replace('bg-grey-500', 'bg-white');
  }
  }
   function add_gallery(books) {
    console.log("test")
    let gallery = document.getElementById("gallery2");

    //     gallery.inner_html += `
    // <div>
    // Number: 1
    // </div>`;
    // const container = document.getElementById("container");
    const fragment2 = document.createDocumentFragment();

    // Add multiple list items to the fragment
    for (var b of books) {
      
      const listItem = document.createElement("div");
      // listItem.textContent = `Item ${i}`;
      listItem.classList.add(
        
     "h-64" ,"w-64", "bg-white","rounded-lg",  "hover:shadow-lg" ,"border-none"
      );
      const inner_element= document.createElement("div");
      inner_element.classList.add(
        
     "h-32" ,"w-32", "bg-blue-500","whitespace-pre-wrap", "rounded-lg", "mx-auto", "mt-8" ,"border-none"
      );
      listItem.id= b.id
      
      // inner_element.addEventListener('click', function() {
        // Code to execute when the button is clicked
        // find_and_shadow();
        
     //   listItem.className.replace('bg-white', 'bg-red-500');

      //  console.log(`Button clicked on book_${i}`);
      //  });
      inner_element.textContent = `Book\nName: ${b.name}\nId: ${b.id}`;
      on(inner_element, "click", () => { open_book(b.url)
        
      })

      listItem.appendChild(inner_element);
     
      fragment2.appendChild(listItem);
    }
    // const listItem = document.createElement("div");
    // listItem.textContent = "1";
    // fragment2.appendChild(listItem);
    gallery.appendChild(fragment2);
  }

  
  
  

  //test_h();
  
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }
  
  // usage example:
 // var a = ['a', 1, 'a', 2, '1'];
//  var unique = a.filter(onlyUnique)
  
function get_books(num) {
  let books = [];
  // let raw = ""
  //   Promise.resolve(async () => {
  //  raw = await invoke("books", {name: "all"}) 
      
  //   }
  // )
  // 
  let raw =" "
  Promise.resolve(()=>{
    
    raw = await readFile("./src-tauri/book_store.json")
  })
    
    let b_data = JSON.parse(raw)
    for (let b of b_data) {
      
      books.push(b);
    
    }
     return books
    
    
  }
export { add_gallery, get_books };
