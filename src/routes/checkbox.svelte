<script>
    import {createEventDispatcher} from 'svelte';

    let {optionText, field} = $props();

    const dispatch = createEventDispatcher();

    let isTrue = $state(false);

    function handleClick() {
        dispatch('optionToggled', { field, value: isTrue });
    }

</script>

<label>
	<input type="checkbox" bind:checked={isTrue} onchange={handleClick}/>
	{optionText}
</label>

<style>
    label {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 120%;
    }

    input {
        font-family: Arial, Helvetica, sans-serif;
        margin: 10px;
        scale: 150%;
    }
</style>