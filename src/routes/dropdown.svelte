<script>
    import {createEventDispatcher} from 'svelte';
    
    export let items = [
      "Option 1",
      "Option 2",
      "Option 3"
    ];
    export let menuType = "Choose an option:";
    export let field;
    let selected = "";

    const dispatch = createEventDispatcher();

    function handleSelection(item) {
        selected = item;
        menuType = item;
        dispatch('optionSelected', { field, value: selected });
    }
    
</script>

<div class="dropdown">
    <button class="dropbtn">{menuType}</button>
    <div class="dropdown-content">
        {#each items as item}
            <!-- svelte-ignore event_directive_deprecated -->
            <button type="button" class="dropdown-item" on:click={() => {handleSelection(item)}}>
                {item}
            </button>
        {/each}
    </div>
</div>

<style>

.dropbtn {
  background-color: rgb(78, 202, 78);
  color: white;
  padding: 6px;
  font-size: 16px;
  border: 2px solid black;
  border-radius: 0.3cm;
  cursor: pointer;
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: inline-block;
  border-radius: 0.3cm;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  border-radius: 0.3cm;
  min-width: 400px;
}

/* Links inside the dropdown */
.dropdown-content button {
  color: black;
  padding: 5px 10px;
  text-decoration: none;
  display: block;
  border-radius: 0.3cm;
}

/* Change color of dropdown links on hover */
.dropdown-content button:hover {background-color: #b6b5b5; cursor: pointer; border-radius: 0.3cm;}

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {
  display: block;
  border-radius: 0.3cm;
}

/* Change the background color of the dropdown button when the dropdown content is shown */
.dropdown:hover .dropbtn {
  background-color: rgb(44, 165, 44);
}
</style>