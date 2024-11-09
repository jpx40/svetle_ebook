<script lang="ts">
  import { emit } from "@tauri-apps/api/event";
  
  import { open } from "@tauri-apps/plugin-dialog";
    
let books = [{name: "book_1", id: "1"
},{name: "book_2", id: "2"
},{name: "book_3", id: "3"
}]



async function add_book() {
  var file = await open({
    multiple: false,
    directory: false
  });

  console.log(file);
  emit("add_book", {
    file: file
  });
} 
  </script>


<button on:click="{async() => await add_book()}"  class="bg-blue-500 text-white font-bold py-2 px-4 rounded">Add new Book</button>
<div id="gallery2" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
<div>
    {#each books as { id, name }, i}
		<div class="h-64 w-64 bg-white rounded-lg hover:shadow-lg border-none">
		<div class="h-32 w-32 bg-blue-500 whitespace-pre-wrap rounded-lg mx-auto mt-8 border-none">
		{i + 1}: {name}
			</div>
			</div>
	{/each}
   
    </div>
</div>
