<script>
  import { onMount } from 'svelte';
  import flatpickr from 'flatpickr';
  import 'flatpickr/dist/flatpickr.css';
  import {createEventDispatcher} from 'svelte';
  import {Spanish} from "flatpickr/dist/l10n/es.js"

  export let field;

  let dateInput;
  let selectedDate = '';

  const dispatch = createEventDispatcher();

  function handleSelection(dateStr) {
      selectedDate = dateStr;
      dispatch('dateSelected', { field, value: selectedDate });
  }

  onMount(() => {
    flatpickr(dateInput, {
      locale: Spanish, 
      dateFormat: "d-m-Y",
      onChange: (selectedDates, dateStr) => {
        selectedDate = dateStr;
        handleSelection(dateStr);
      }
    });
  });

</script>

<input bind:this={dateInput} type="text" />

<style>
  input {
    background-color: rgb(240, 240, 240);
    border: 2px outset black;
    border-radius: 0.2cm;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    margin: 10px;
    animation-delay: 1000ms;
    font-family: Arial, Helvetica, sans-serif;
  }

  input:hover {
    transform: scale(0.975);
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.25);
    animation-delay: 1000ms;
  }
</style>