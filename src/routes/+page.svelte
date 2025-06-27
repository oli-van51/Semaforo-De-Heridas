<script>
    import Entry from "./entry.svelte";
    import Checkbox from "./checkbox.svelte";
    import Dropdown from "./dropdown.svelte";
    import Calendar from "./calendar.svelte";
    import { onMount } from "svelte";

    let fields = {
        nombre: "",
        apellido: "",
        segundo_apellido: "",
        edad: 0,
        convenio: "",
        fecha_accidente: "",
        fecha_ultima_cirugia: "",
        numero_de_dias: "",
        centro_de_atencion: "",
        quien_registra: "",
        nombre_registrante: "",
        resultado: ""
    };

    let comorbilidades = { //seleción multiple
        "No": false,
        "Hipertensión arterial": false,
        "Diabetes Mellitus Insulino Requirente": false,
        "Diabetes Mellitus No insulino Requirente": false,
        "Enfermedad arterial periférica": false,
        "Enfermedad autoinmune": false,
        "Enfermedad tromboembólica periférica": false,
        "Enfermedad venosa periférica": false,
        "Malnutrición por exceso": false,
        "Malnutrición por déficit": false,
        "Inmunodepresión": false,
        "Otra": false,
    }

    let descripcion_herida = { //seleción multiple
        "Cerrada": false,
        "Costras pequeñas superficiales": false,
        "Cicatriz lineal": false,
        "Erosión superficial": false,
        "Eritema piel roja": false,
        "Edema de la herida": false,
        "Aumento de volumen local": false,
        "Aumento de temperatura local": false,
        "Celulitis": false,
        "Secreción serosa": false,
        "Secreción turbia": false,
        "Exudado purulento": false,
        "Esfacelo": false,
        "Necrosis seca costra gruesa y dura": false,
        "Necrosis húmeda": false,
        "Úlcera": false,
        "Flictenas": false,
        "Dolor local": false,
        "Prurito picazón": false,
        "Mal olor": false,
        "Induración de tejidos circundantes": false,
        "Sangrado persistente": false,
        "Tejido de hipergranulación granuloma": false,
        "Bordes irregulares": false,
        "Exposición de fascia tendón músculo osteosíntesis": false,

    }

    const convenios = ["Ley", "ISL", "Convenio", "Ley de Urgencia", "Particular"];
    const dias = ["Menos de 14", "Entre 15 y 20", "21 dias o más"];

    const centros_de_atencion = [
        "Santiago y Región Metropolitana",
        "Regional Tarapacá",
        "Regional Antofagasta",
        "Regional Coquimbo",
        "Regional Valparaíso",
        "Regional Libertador General Bernardo OHiggins",
        "Regional Maule",
        "Regional Ñuble",
        "Regional BioBio",
        "Regional Araucania",
        "Regional Los Ríos",
        "Regional Los Lagos",
        "Regional Aysen",
        "Regional Magallanes",
    ]

    const registradores = [
        "Tecnico paramédico",
        "Enfermeria",
        "Médico",
    ]

    let tratamientos_comorbilidad = {
        "Compensada, en tratamiento": false,
        "Descompensada, sin tratamiento": false,
    }

    let agesList = [];
    for (let i = 15; i < 120; i++) {
        agesList.push(i);
    }

    let resultado = "Ninguno";
    let saveState = "de ser ninguno";
    let pdfSaveState = "de ser ninguno";

    let onlyRed = [];
    let redAndYellow = [];
    let onlyGreen = [];
    let yellowAndGreen = [];
    let allCategories = [];

    onMount(async () => {
        try {
            const res = await fetch('categorias.json');
            const json = await res.json();

            onlyRed = json.onlyRed || [];
            redAndYellow = json.yellowAndRed || [];
            onlyGreen = json.onlyGreen || [];
            yellowAndGreen = json.yellowAndGreen || [];
            allCategories = json.allCategories || [];

            console.log('Loaded from JSON:', json);
        } catch (err) {
            console.error('Error loading JSON:', err);
        }
    });

    function handleInput(event) {
        const { field, value } = event.detail;
        fields[field] = value;
        console.log(`Field updated: `);
    }

    function handleComorbilidades(event) {
        const { field, value } = event.detail;
        comorbilidades[field] = value;
    }

    function handleHeridas(event) {
        const { field, value } = event.detail;
        descripcion_herida[field] = value;
    }

    function handleTratamientos(event) {
        const { field, value } = event.detail;
        tratamientos_comorbilidad[field] = value;
    }

    function calculateResult() {

        const accidentDay = new Date(fields.fecha_accidente);
        const currentDate = new Date(); //Parentesis vacio significa fecha actual
        const diffInMilliseconds = currentDate.getTime() - accidentDay.getTime();
        let tSinceAccident = diffInMilliseconds / (1000 * 60 * 60 * 24);

        const onlyRedResult = onlyRed.map(key =>
            descripcion_herida[key] ?? comorbilidades[key]  ?? tratamientos_comorbilidad[key] ?? false
        );

        const redAndYellowResult = redAndYellow.map(key =>
            descripcion_herida[key] ?? comorbilidades[key] ?? tratamientos_comorbilidad[key] ?? false
        );

        const onlyGreenResult = onlyGreen.map(key =>
            descripcion_herida[key] ?? comorbilidades[key] ?? tratamientos_comorbilidad[key] ?? false
        );

        const greenAndYellowResult = yellowAndGreen.map(key =>
            descripcion_herida[key] ?? comorbilidades[key] ?? tratamientos_comorbilidad[key] ?? false
        );

        const allCategoriesResults = allCategories.map(key =>
            descripcion_herida[key] ?? comorbilidades[key] ?? tratamientos_comorbilidad[key] ?? false
        );

        console.log(fields.numero_de_dias)

        if (((fields.numero_de_dias == "21 dias o más" || tSinceAccident >= 21) && (redAndYellowResult.some(val => val === true) || allCategoriesResults.some(val => val === true))) ||
        onlyRedResult.some(val => val === true)
        ){ 
            resultado = "Rojo";
            //console.log("a");
        }
        else if (((fields.numero_de_dias == "Entre 15 y 20" || tSinceAccident <= 20 && tSinceAccident >= 15) && (redAndYellowResult.some(val => val === true) || allCategoriesResults.some(val => val === true) || greenAndYellowResult.some(val => val === true))) ||
        (fields.numero_de_dias == "Menos de 14" || tSinceAccident <= 14) && redAndYellowResult.some(val => val === true)) {
            resultado = "Amarillo";
            //console.log("c");
        }
        else if (((fields.numero_de_dias == "Menos de 14" || tSinceAccident <= 14) && (greenAndYellowResult.some(val => val === true) || allCategoriesResults.some(val => val === true))) ||
        onlyGreenResult.some(val => val === true)){
            resultado = "Verde";
            //console.log("b");
        }
        else {
            console.log("Error finding result");
            resultado = "Ninguno";
        }

        console.log(resultado);

        fields.resultado = resultado;
    }

    function saveToDB() {
        const writeComorbilidades = Object.keys(comorbilidades).filter((val) => comorbilidades[val] === true);
        const writeTratamientos = Object.keys(tratamientos_comorbilidad).filter((val) => tratamientos_comorbilidad[val] === true);
        const writeDescrpiciones = Object.keys(descripcion_herida).filter((val) => descripcion_herida[val] === true);

        fetch("/api/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...fields,
                comorbilidades: writeComorbilidades,
                tratamientos_comorbilidad: writeTratamientos,
                descripcion_herida: writeDescrpiciones,
                resultado
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("Saved succesfully:", data);
            saveState = "sido exitoso"
        })
        .catch((err) => {
            console.error("Error svaong to DB:", err)
            saveState = "fallado"
        });

        console.log("Save successful!")
    }

    async function guardarPdf() {
        const data = {
            titulo: "Reporte " + fields.nombre,
            contenido: {
                fields: fields,
                comorbilidades: comorbilidades,
                tratamientos_comorbilidades: tratamientos_comorbilidad,
                descripcion_herida: descripcion_herida
            }
        }

        const response = await fetch("/api/pdf", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        pdfSaveState = "sido exitoso"

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        window.open(url);
    }

</script>

<style>
    .title {
        display: flex;
        justify-content: center;
        font-size: 300%;
        font-family: Arial, Helvetica, sans-serif;
        color: rgb(94, 238, 94);
        background-color: rgb(240, 240, 240);
        padding: 15px;
        margin: 2%;
        border: 2px solid rgb(100, 100, 100);
        border-radius: 1cm; 
    }

    .intro {
        display: flex;
        justify-content: center;
        font-size: 120%;
        font-family: Arial, Helvetica, sans-serif;
        background-color: rgb(240, 240, 240);
    }

    h3 {
        font-size: 100%;
        font-family: Arial, Helvetica, sans-serif;
    }

    h1 {
        font-size: 120%;
        font-family: Arial, Helvetica, sans-serif;
    }

    button {
        border: none;
        padding: 0.5rem 2rem;
        font-size: 1.5rem;
        color: white;
        background-color: rgb(94, 238, 94);
        transform-origin: center;
        border-radius: 0.5cm;
        transition: all 500ms;
        inset: 0px -2px 3px rgba(0, 0, 0, 0.25);
        box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.25);
        border: 2px solid black;
        margin: 30px 30px;
    }

    button:hover {
        cursor: pointer;
        transform: scale(0.975);
        box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.25);
    }

    .label {
        border: none;
        padding: 0.5rem 2rem;
        font-size: 1.5rem;
        color: white;
        transform-origin: center;
        border-radius: 0.5cm;
        transition: all 500ms;
        inset: 0px -2px 3px rgba(0, 0, 0, 0.25);
        box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.25);
        border: 2px solid black;
        margin: 50px 50px;
        font-family: Arial, Helvetica, sans-serif;
    }

    .rojo {
        background-color: red;
    }
    .amarillo {
        background-color: rgb(255, 230, 0);
        color: #000;
    }
    .verde {
        background-color: rgb(0, 221, 0);
    }
    .ninguno {
        background-color: black;
    }
</style>

<h1 class="title">Bienvenido al Semaforo de Heridas</h1>
<p class="intro">Visite&nbsp;<a href="https://www.mutual.cl/">el sitio de Mutual</a>&nbsp;para consultas y reclamos.</p>

<h1>1. Por favor rellene los campos</h1>

<h3>Ingrese nombre de paciente:</h3>
<Entry on:textEntered={handleInput} field="nombre"></Entry>

<h3>Ingrese apellido de paciente:</h3>
<Entry on:textEntered={handleInput} field="apellido"></Entry>

<h3>Ingrese segundo apellido de paciente:</h3>
<Entry on:textEntered={handleInput} field="segundo_apellido"></Entry>

<h3>Ingrese edad de paciente:</h3>
<Dropdown field="edad" menuType="Ingrese edad" items={agesList} on:optionSelected={handleInput}></Dropdown>

<h3>Especifique Ley/ISL/Convenio de paciente</h3>
<Dropdown field="convenio" menuType="Ley/ISL/Convenio" items={convenios} on:optionSelected={handleInput}></Dropdown>

<h3>Especifique fecha de accidente del paciente</h3>
<Calendar field="fecha_accidente"></Calendar>

<h3>Especifique fecha de ultima cirugía del paciente</h3>
<Calendar field="fecha_ultima_cirugía"></Calendar>

<h3>Especifique numero de días desde el accidente del paciente</h3>
<Dropdown field="numero_de_dias" menuType="Dias desde accidente" items={dias} on:optionSelected={handleInput}></Dropdown>

<h3>Especifique centro de atención del paciente</h3>
<Dropdown field="centro_de_atencion" menuType="Centro de atención" items={centros_de_atencion} on:optionSelected={handleInput}></Dropdown>

<h3>Tipo del quién registra</h3>
<Dropdown field="quien_registra" menuType="Tipo de Registrante" items={registradores} on:optionSelected={handleInput}></Dropdown>

<h3>Ingrese nombre de registrante</h3>
<Entry on:textEntered={handleInput} field="nombre_registrante"></Entry>

<h3>Marque todas las comorbilidades que apliquen:</h3>

{#each Object.keys(comorbilidades) as item}
    <Checkbox optionText={item} field={item} on:optionToggled={handleComorbilidades}></Checkbox>
    <p></p>
{/each}

<h3>Marque el tratamiento en la comorbilidad correspondiente:</h3>
{#each Object.keys(tratamientos_comorbilidad) as item2}
    <Checkbox optionText={item2} field={item2} on:optionToggled={handleTratamientos}></Checkbox>
    <p></p>
{/each}

<h3>Marque todas las descripciones de heridas que apliquen:</h3>

{#each Object.keys(descripcion_herida) as item1}
    <Checkbox optionText={item1} field={item1} on:optionToggled={handleHeridas}></Checkbox>
    <p></p>
{/each}


<button onclick={calculateResult}>Calcular estado</button>

<h1>2. Su resutado estará disponible abajo:</h1>

<div style="margin-top: 40px;">
    <span class={`label ${resultado.toLowerCase()}`}>
        Resultado: {resultado}
    </span>
</div>

<div style="margin-top: 60px;"> 
    <button onclick={saveToDB}>Guardar en base de datos</button>
</div>

<h3>El guardado el la base de datos ha {saveState}.</h3>

<div style="margin-top: 40px;"> 
    <button onclick={guardarPdf}>Guardar como PDF</button>
</div>

<h3>El guardado en el PDF ha {pdfSaveState}</h3>