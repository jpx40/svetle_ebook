(() => {
  // node_modules/@tauri-apps/api/core.js
  var _Channel_onmessage;
  var _Channel_nextMessageId;
  var _Channel_pendingMessages;
  var _Resource_rid;
  _Channel_onmessage = /* @__PURE__ */ new WeakMap(), _Channel_nextMessageId = /* @__PURE__ */ new WeakMap(), _Channel_pendingMessages = /* @__PURE__ */ new WeakMap();
  async function invoke(cmd, args = {}, options) {
    return window.__TAURI_INTERNALS__.invoke(cmd, args, options);
  }
  _Resource_rid = /* @__PURE__ */ new WeakMap();

  // src/book_gallery.js
  function add_gallery(books) {
    console.log("test");
    let gallery = document.getElementById("gallery2");
    const fragment2 = document.createDocumentFragment();
    for (var b of books) {
      const listItem = document.createElement("div");
      listItem.classList.add(
        "h-64",
        "w-64",
        "bg-white",
        "rounded-lg",
        "hover:shadow-lg",
        "border-none"
      );
      const inner_element = document.createElement("div");
      inner_element.classList.add(
        "h-32",
        "w-32",
        "bg-blue-500",
        "whitespace-pre-wrap",
        "rounded-lg",
        "mx-auto",
        "mt-8",
        "border-none"
      );
      listItem.id = b.id;
      inner_element.addEventListener("click", function() {
        listItem.className.replace("bg-white", "bg-red-500");
        console.log(`Button clicked on book_${i}`);
      });
      inner_element.textContent = `Book
Name: ${b.name}
Id: ${b.id}`;
      listItem.appendChild(inner_element);
      fragment2.appendChild(listItem);
    }
    gallery.appendChild(fragment2);
  }
  function generate_book_data(num) {
    let books = [];
    for (let i2 = 1; i2 < num; i2++) {
      books.push({
        name: `Book_${i2}`,
        id: `book_${i2}`
      });
    }
    return books;
  }

  // src/surreal.js
  var surreal = function() {
    let $ = {
      // Convenience for internals.
      $: this,
      // Convenience for internals.
      plugins: [],
      // Table of contents and convenient call chaining sugar. For a familiar "jQuery like" syntax. 🙂
      // Check before adding new: https://youmightnotneedjquery.com/
      sugar(e) {
        if (!$.isNode(e) && !$.isNodeList(e)) {
          console.warn(`Surreal: Not a supported element / node / node list "${e}"`);
          return e;
        }
        if ($.isNodeList(e)) e.forEach((_) => {
          $.sugar(_);
        });
        if (e.hasOwnProperty("hasSurreal")) return e;
        e.run = (f) => {
          return $.run(e, f);
        };
        e.remove = () => {
          return $.remove(e);
        };
        e.classAdd = (name) => {
          return $.classAdd(e, name);
        };
        e.class_add = e.add_class = e.addClass = e.classAdd;
        e.classRemove = (name) => {
          return $.classRemove(e, name);
        };
        e.class_remove = e.remove_class = e.removeClass = e.classRemove;
        e.classToggle = (name, force) => {
          return $.classToggle(e, name, force);
        };
        e.class_toggle = e.toggle_class = e.toggleClass = e.classToggle;
        e.styles = (value) => {
          return $.styles(e, value);
        };
        e.on = (name, f) => {
          return $.on(e, name, f);
        };
        e.off = (name, f) => {
          return $.off(e, name, f);
        };
        e.offAll = (name) => {
          return $.offAll(e, name);
        };
        e.off_all = e.offAll;
        e.disable = () => {
          return $.disable(e);
        };
        e.enable = () => {
          return $.enable(e);
        };
        e.send = (name, detail) => {
          return $.send(e, name, detail);
        };
        e.trigger = e.send;
        e.halt = (ev, keepBubbling, keepDefault) => {
          return $.halt(ev, keepBubbling, keepDefault);
        };
        e.attribute = (name, value) => {
          return $.attribute(e, name, value);
        };
        e.attr = e.attribute;
        $.plugins.forEach(function(func) {
          func(e);
        });
        e.hasSurreal = 1;
        return e;
      },
      // me() will return a single element or null. Selector not needed if used with inline <script>
      // If you select many elements, me() will return the first.
      // Example
      //	<div>
      //		Hello World!
      //		<script>me().style.color = 'red'<\/script>
      //	</div>
      me(selector = null, start = document, warning = true) {
        if (selector == null) return $.sugar(start.currentScript.parentElement);
        if (selector instanceof Event) return selector.currentTarget ? $.me(selector.currentTarget) : (console.warn(`Surreal: Event currentTarget is null. Please save your element because async will lose it`), null);
        if (selector === "-" || selector === "prev" || selector === "previous") return $.sugar(start.currentScript.previousElementSibling);
        if ($.isSelector(selector, start, warning)) return $.sugar(start.querySelector(selector));
        if ($.isNodeList(selector)) return $.me(selector[0]);
        if ($.isNode(selector)) return $.sugar(selector);
        return null;
      },
      el(selector = null, start = document, warning = true) {
        return me(selector, start, warning);
      },
      elem(selector = null, start = document, warning = true) {
        return me(selector, start, warning);
      },
      // any() is me() but will return an array of elements or empty [] if nothing is found.
      // You may optionally use forEach/map/filter/reduce.
      // Example: any('button')
      any(selector, start = document, warning = true) {
        if (selector == null) return $.sugar([start.currentScript.parentElement]);
        if (selector instanceof Event) return selector.currentTarget ? $.any(selector.currentTarget) : (console.warn(`Surreal: Event currentTarget is null. Please save your element because async will lose it`), null);
        if (selector === "-" || selector === "prev" || selector === "previous") return $.sugar([start.currentScript.previousElementSibling]);
        if ($.isSelector(selector, start, warning)) return $.sugar(Array.from(start.querySelectorAll(selector)));
        if ($.isNode(selector)) return $.sugar([selector]);
        if ($.isNodeList(selector)) return $.sugar(Array.from(selector));
        return $.sugar([]);
      },
      // Run any function on element(s)
      run(e, f) {
        if (typeof f !== "function") {
          console.warn(`Surreal: run(f) f must be a function`);
          return e;
        }
        if ($.isNodeList(e)) e.forEach((_) => {
          $.run(_, f);
        });
        if ($.isNode(e)) {
          f(e);
        }
        return e;
      },
      // Remove element(s)
      remove(e) {
        if ($.isNodeList(e)) e.forEach((_) => {
          $.remove(_);
        });
        if ($.isNode(e)) e.parentNode.removeChild(e);
        return;
      },
      // Add class to element(s).
      classAdd(e, name) {
        if (name.constructor.name === "Array") {
          if ($.isNode(e)) {
            for (var c of name) {
              e.classList.add(c);
            }
            return e;
          }
          return e;
        }
        if (typeof name !== "string") return e;
        if (name.charAt(0) === ".") name = name.substring(1);
        if ($.isNodeList(e)) e.forEach((_) => {
          $.classAdd(_, name);
        });
        if ($.isNode(e)) e.classList.add(name);
        return e;
      },
      // Remove class from element(s).
      classRemove(e, name) {
        if (typeof name !== "string") return e;
        if (name.charAt(0) === ".") name = name.substring(1);
        if ($.isNodeList(e)) e.forEach((_) => {
          $.classRemove(_, name);
        });
        if ($.isNode(e)) e.classList.remove(name);
        return e;
      },
      // Toggle class in element(s).
      classToggle(e, name, force) {
        if (typeof name !== "string") return e;
        if (name.charAt(0) === ".") name = name.substring(1);
        if ($.isNodeList(e)) e.forEach((_) => {
          $.classToggle(_, name, force);
        });
        if ($.isNode(e)) e.classList.toggle(name, force);
        return e;
      },
      // Add inline style to element(s).
      // Can use string or object formats.
      // 	String format: "font-family: 'sans-serif'"
      // 	Object format; { fontFamily: 'sans-serif', backgroundColor: '#000' }
      styles(e, value) {
        if (typeof value === "string") {
          if ($.isNodeList(e)) e.forEach((_) => {
            $.styles(_, value);
          });
          if ($.isNode(e)) {
            $.attribute(e, "style", ($.attribute(e, "style") == null ? "" : $.attribute(e, "style") + "; ") + value);
          }
          return e;
        }
        if (typeof value === "object") {
          if ($.isNodeList(e)) e.forEach((_) => {
            $.styles(_, value);
          });
          if ($.isNode(e)) {
            Object.assign(e.style, value);
          }
          return e;
        }
        return e;
      },
      // Add event listener to element(s).
      // Match a sender: if (!event.target.matches(".selector")) return;
      //	📚️ https://developer.mozilla.org/en-US/docs/Web/API/Event
      //	✂️ Vanilla: document.querySelector(".thing").addEventListener("click", (e) => { alert("clicked") }
      on(e, name, f) {
        if ($.isNodeList(e)) e.forEach((_) => {
          $.on(_, name, f);
        });
        if ($.isNode(e)) e.addEventListener(name, f);
        return e;
      },
      off(e, name, f) {
        if ($.isNodeList(e)) e.forEach((_) => {
          $.off(_, name, f);
        });
        if ($.isNode(e)) e.removeEventListener(name, f);
        return e;
      },
      offAll(e) {
        if ($.isNodeList(e)) e.forEach((_) => {
          $.offAll(_);
        });
        if ($.isNode(e)) e.parentNode.replaceChild(e.cloneNode(true), e);
        return e;
      },
      // Easy alternative to off(). Disables click, key, submit events.
      disable(e) {
        if ($.isNodeList(e)) e.forEach((_) => {
          $.disable(_);
        });
        if ($.isNode(e)) e.disabled = true;
        return e;
      },
      // For reversing disable()
      enable(e) {
        if ($.isNodeList(e)) e.forEach((_) => {
          $.enable(_);
        });
        if ($.isNode(e)) e.disabled = false;
        return e;
      },
      // Send / trigger event.
      // ✂️ Vanilla: Events Dispatch: document.querySelector(".thing").dispatchEvent(new Event('click'))
      send(e, name, detail = null) {
        if ($.isNodeList(e)) e.forEach((_) => {
          $.send(_, name, detail);
        });
        if ($.isNode(e)) {
          const event = new CustomEvent(name, { detail, bubbles: true });
          e.dispatchEvent(event);
        }
        return e;
      },
      // Halt event. Default: Stops normal event actions and event propagation.
      halt(ev, keepBubbling = false, keepDefault = false) {
        if (ev instanceof Event) {
          if (!keepDefault) ev.preventDefault();
          if (!keepBubbling) ev.stopPropagation();
        }
        return ev;
      },
      // Add or remove attributes from element(s)
      attribute(e, name, value = void 0) {
        if (typeof name === "string" && value === void 0) {
          if ($.isNodeList(e)) return [];
          if ($.isNode(e)) return e.getAttribute(name);
          return null;
        }
        if (typeof name === "string" && value === null) {
          if ($.isNodeList(e)) e.forEach((_) => {
            $.attribute(_, name, value);
          });
          if ($.isNode(e)) e.removeAttribute(name);
          return e;
        }
        if (typeof name === "string") {
          if ($.isNodeList(e)) e.forEach((_) => {
            $.attribute(_, name, value);
          });
          if ($.isNode(e)) e.setAttribute(name, value);
          return e;
        }
        if (typeof name === "object") {
          if ($.isNodeList(e)) e.forEach((_) => {
            Object.entries(name).forEach(([key, val]) => {
              $.attribute(_, key, val);
            });
          });
          if ($.isNode(e)) Object.entries(name).forEach(([key, val]) => {
            $.attribute(e, key, val);
          });
          return e;
        }
        return e;
      },
      // Puts Surreal functions except for "restricted" in global scope.
      globalsAdd() {
        console.log(`Surreal: Adding convenience globals to window.`);
        let restricted = ["$", "sugar"];
        for (const [key, value] of Object.entries(this)) {
          if (!restricted.includes(key)) window[key] != "undefined" ? window[key] = value : console.warn(`Surreal: "${key}()" already exists on window. Skipping to prevent overwrite.`);
          window.document.key = value;
        }
      },
      // ⚙️ Used internally. Is this an element / node?
      isNode(e) {
        return e instanceof HTMLElement || e instanceof SVGElement || e instanceof Document ? true : false;
      },
      // ⚙️ Used internally by DOM functions. Is this a list of elements / nodes?
      isNodeList(e) {
        return e instanceof NodeList || Array.isArray(e) ? true : false;
      },
      // ⚙️ Used internally by DOM functions. Warning when selector is invalid. Likely missing a "#" or "."
      isSelector(selector = "", start = document, warning = true) {
        if (typeof selector !== "string") return false;
        if (start.querySelector(selector) == null) {
          if (warning) console.log(`Surreal: "${selector}" not found, ignoring.`);
          return false;
        }
        return true;
      }
    };
    $.globalsAdd();
    console.log("Surreal: Loaded.");
    return $;
  }();
  function pluginEffects(e) {
    function fadeOut(e2, f = void 0, ms = 1e3, remove = true) {
      let thing = e2;
      if (surreal.isNodeList(e2)) e2.forEach((_) => {
        fadeOut(_, f, ms);
      });
      if (surreal.isNode(e2)) {
        (async () => {
          surreal.styles(e2, { transform: "scale(1)", transition: `all ${ms}ms ease-out`, overflow: "hidden" });
          await tick();
          surreal.styles(e2, { transform: "scale(0.9)", opacity: "0" });
          await sleep(ms, e2);
          if (typeof f === "function") f(thing);
          if (remove) surreal.remove(thing);
        })();
      }
    }
    function fadeIn(e2, f = void 0, ms = 1e3) {
      let thing = e2;
      if (surreal.isNodeList(e2)) e2.forEach((_) => {
        fadeIn(_, f, ms);
      });
      if (surreal.isNode(e2)) {
        (async () => {
          let save = e2.style;
          surreal.styles(e2, { transition: `all ${ms}ms ease-in`, overflow: "hidden" });
          await tick();
          surreal.styles(e2, { opacity: "1" });
          await sleep(ms, e2);
          e2.style = save;
          surreal.styles(e2, { opacity: "1" });
          if (typeof f === "function") f(thing);
        })();
      }
    }
    e.fadeOut = (f, ms, remove) => {
      return fadeOut(e, f, ms, remove);
    };
    e.fade_out = e.fadeOut;
    e.fadeIn = (f, ms) => {
      return fadeIn(e, f, ms);
    };
    e.fade_in = e.fadeIn;
  }
  surreal.plugins.push(pluginEffects);
  console.log("Surreal: Added plugins.");
  var createElement = document.createElement.bind(document);
  var create_element = document.createElement.bind(document);
  async function tick() {
    return await new Promise((resolve) => {
      requestAnimationFrame(resolve);
    });
  }
  async function sleep(ms, e) {
    return await new Promise((resolve) => setTimeout(() => {
      resolve(e);
    }, ms));
  }
  var surreal_default = surreal;
  console.log("Surreal: Added shortcuts.");

  // node_modules/@tauri-apps/api/path.js
  var BaseDirectory;
  (function(BaseDirectory2) {
    BaseDirectory2[BaseDirectory2["Audio"] = 1] = "Audio";
    BaseDirectory2[BaseDirectory2["Cache"] = 2] = "Cache";
    BaseDirectory2[BaseDirectory2["Config"] = 3] = "Config";
    BaseDirectory2[BaseDirectory2["Data"] = 4] = "Data";
    BaseDirectory2[BaseDirectory2["LocalData"] = 5] = "LocalData";
    BaseDirectory2[BaseDirectory2["Document"] = 6] = "Document";
    BaseDirectory2[BaseDirectory2["Download"] = 7] = "Download";
    BaseDirectory2[BaseDirectory2["Picture"] = 8] = "Picture";
    BaseDirectory2[BaseDirectory2["Public"] = 9] = "Public";
    BaseDirectory2[BaseDirectory2["Video"] = 10] = "Video";
    BaseDirectory2[BaseDirectory2["Resource"] = 11] = "Resource";
    BaseDirectory2[BaseDirectory2["Temp"] = 12] = "Temp";
    BaseDirectory2[BaseDirectory2["AppConfig"] = 13] = "AppConfig";
    BaseDirectory2[BaseDirectory2["AppData"] = 14] = "AppData";
    BaseDirectory2[BaseDirectory2["AppLocalData"] = 15] = "AppLocalData";
    BaseDirectory2[BaseDirectory2["AppCache"] = 16] = "AppCache";
    BaseDirectory2[BaseDirectory2["AppLog"] = 17] = "AppLog";
    BaseDirectory2[BaseDirectory2["Desktop"] = 18] = "Desktop";
    BaseDirectory2[BaseDirectory2["Executable"] = 19] = "Executable";
    BaseDirectory2[BaseDirectory2["Font"] = 20] = "Font";
    BaseDirectory2[BaseDirectory2["Home"] = 21] = "Home";
    BaseDirectory2[BaseDirectory2["Runtime"] = 22] = "Runtime";
    BaseDirectory2[BaseDirectory2["Template"] = 23] = "Template";
  })(BaseDirectory || (BaseDirectory = {}));

  // node_modules/@tauri-apps/plugin-fs/dist-js/index.js
  var SeekMode;
  (function(SeekMode2) {
    SeekMode2[SeekMode2["Start"] = 0] = "Start";
    SeekMode2[SeekMode2["Current"] = 1] = "Current";
    SeekMode2[SeekMode2["End"] = 2] = "End";
  })(SeekMode || (SeekMode = {}));

  // src/main.js
  var { dirname } = window.__TAURI__.path;
  var { me: me2, el, on } = surreal_default;
  function afterload(func) {
    window.addEventListener("DOMContentLoaded", func);
  }
  async function init() {
    var books = await invoke("books", { name: "" });
    let books2 = JSON.parse(books);
    add_gallery(generate_book_data(10));
  }
  afterload(async () => {
    await init();
  });
})();
