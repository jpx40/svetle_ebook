<script>
  import ePub from "epubjs"
  import { invoke } from "@tauri-apps/api/core";
    import { onMount } from "svelte";
      
  let viewer 
  let selecter
  	var rendition
  function init_viewer(url, view, $select) {
		// var $viewer = document.getElementById("viewer");
  
		// var $next = document.getElementById("next");
		// var $prev = document.getElementById("prev");
		var currentSectionIndex = 9;
		// Load the opf
		var book = ePub(url);
		rendition = book.renderTo(view, { flow: "scrolled-doc", width: 600, height: 400});
		var displayed = rendition.display(currentSectionIndex);
         
		book.loaded.navigation.then(function(toc){
		//var $select = document.getElementById("toc"),
		
		var			docfrag = document.createDocumentFragment();
         
			toc.forEach(function(chapter) {
				var option = document.createElement("option");
				option.textContent = chapter.label;
				option.ref = chapter.href;
         
				docfrag.appendChild(option);
			});
         
			$select.appendChild(docfrag);
         
			$select.onchange = function(){
					var index = $select.selectedIndex,
							url = $select.options[index].ref;
					rendition.display(url);
					return false;
			};
         
         
		});
	 // window.addEventListener(
  //       "keydown",
  //       function (e) {
  //         // Left Key
  //         if ((e.keyCode || e.which) == 37) {
  //           rendition.prev();
  //         }else {
  
  //         // Right Key
  //         if ((e.keyCode || e.which) == 39) {
  //           rendition.next();
  //         }
  //         }
  //       },
  //       sleep(1000),
  
  //       false,
  //     );
		
  }
//  let key = $state();
//	let keyCode = $state();
  
	function onkeydown(e) {
		// key = event.key;
		// keyCode = event.keyCode;
		
	 if ((e.keyCode || e.which) == 37) {
            rendition.prev();
          }else {
  
          // Right Key
          if ((e.keyCode || e.which) == 39) {
            rendition.next();
          }
          }
        
	}
  
  onMount(() => {
    
    let url = "https://s3.amazonaws.com/moby-dick/"
    init_viewer(url,viewer,selecter)
  })
    </script>
<svelte:window {onkeydown} />

<select bind:this={selecter} ></select>
<div class="scrolled" bind:this={viewer}></div>