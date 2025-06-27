<script>

    import {createEventDispatcher} from 'svelte';

    let info = $state("");
    let {field} = $props();

    const dispatch = createEventDispatcher();

    function handleClick() {
        dispatch('textEntered', { field, value: info });
        console.log(info);
    }

</script>

<div class="entrada">
    <input bind:value={info} oninput={handleClick}/>
</div>

<style>
    .entrada {
        font-family: Arial, Helvetica, sans-serif;
        padding: 0.2cm;
    }

    input {
        font-size: 150%;
        background-color: rgb(240, 240, 240);
        border-radius: 0.2cm;
        padding: 0.2cm;
        inset: 0px -2px 3px rgba(0, 0, 0, 0.25);
        box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.25);
        width: 700px;
        animation-delay: 700ms;
    }
</style>