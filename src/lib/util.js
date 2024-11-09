//https://youmightnotneedjquery.com
let greetInputEl;
let greetMsgEl;
import  surreal  from "./surreal"

const { me, el, on } = surreal;
 import { exists, BaseDirectory } from '@tauri-apps/plugin-fs';

let home_elem;

export function elem_by_id(id) {
  return document.getElementById(id)
}
async function set_homdir() {
  
  let homedir = "f"
  
    
    
  homedir = await dirname("/home/test")
  
  home_elem.textContent = homedir
}
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export function remove_children(target) {
  
  if (typeof target === "string") {
      var e =      elem_by_id(target)
     while (e.hasChildNodes()) {
         e.removeChild(e.firstChild);
     }
   
} else {
  while (target.hasChildNodes()) {
    target.removeChild(target.firstChild);
  }
}
}
export function elem(s) {
  return document.querySelector(s);
}

/** @param {string} s
 * @returns {HTMLHtmlElement} **/
function new_elem(s="div") {
  return document.createElement(s)
}
export function new_frag() {
  return document.createDocumentFragment()
}

/** @param {HTMLHtmlElement} elem
* @param {Node} child
 * @returns {void} **/
function append_child(elem ,child) {
  elem.appendChild(child)
}
/** @param {HTMLHtmlElement} elem
* @param {(Node|string[])} child
 * @returns {void} **/
function append(elem ,child) {
  elem.append(child)
}
/** @param {Function} func
    @returns {void} **/
function afterload(func) {
    window.addEventListener("DOMContentLoaded", func)
  
}

function next(el, selector) {
  const nextEl = el.nextElementSibling;
  if (!selector || (nextEl && nextEl.matches(selector))) {
    return nextEl;
  }
  return null;
}
function offset(el) {
  box = el.getBoundingClientRect();
  docElem = document.documentElement;
  return {
    top: box.top + window.pageYOffset - docElem.clientTop,
    left: box.left + window.pageXOffset - docElem.clientLeft
  };
  function outerHeight(el) {
    const style = getComputedStyle(el);
  
    return (
      el.getBoundingClientRect().height +
      parseFloat(style.marginTop) +
      parseFloat(style.marginBottom)
    );
  }
  function outerWidth(el) {
    const style = getComputedStyle(el);
  
    return (
      el.getBoundingClientRect().width +
      parseFloat(style.marginLeft) +
      parseFloat(style.marginRight)
    );
  }
  function parents(el, selector) {
    const parents = [];
    while ((el = el.parentNode) && el !== document) {
      if (!selector || el.matches(selector)) parents.push(el);
    }
    return parents;
  }
  function position(el) {
    const { top, left } = el.getBoundingClientRect();
    const { marginTop, marginLeft } = getComputedStyle(el);
    return {
      top: top - parseInt(marginTop, 10),
      left: left - parseInt(marginLeft, 10)
    };
  }
  function offset(el) {
    box = el.getBoundingClientRect();
    docElem = document.documentElement;
    return {
      top: box.top + window.pageYOffset - docElem.clientTop,
      left: box.left + window.pageXOffset - docElem.clientLeft
    };
  }
  function isHidden(el) {
    return !(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  }
  function innerWidth(el, value) {
    if (value === undefined) {
      return el.clientWidth;
    } else {
      el.style.width = value;
    }
  }
  function innerHeight(el, value) {
    if (value === undefined) {
      return el.clientHeight;
    } else {
      el.style.height = value;
    }
  }
  function generateElements(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.children;
  }
  function toggle(el) {
    if (el.style.display == 'none') {
      el.style.display = '';
    } else {
      el.style.display = 'none';
    }
  }
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }
}
export {
  new_elem, 
  //elem,
  append,
  append_child,
 // sleep,
  afterload,
  //remove_children,
  //elem_by_id
  // new_frag,
}