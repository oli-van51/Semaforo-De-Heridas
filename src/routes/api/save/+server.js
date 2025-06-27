import db from "$lib/db";

export async function POST({ request }) {
    const data = await request.json();

    const stmt = db.prepare(`
        INSERT INTO patients (
        Nombre,
        Apellido,
        Segundo_apellido,
        Edad,
        Convenio,
        Fecha_accidente,
        Fecha_ultima_cirugia,
        Numero_de_dias,
        Centro_de_atencion,
        Quien_registra,
        Nombre_registrante,
        Comorbilidades,
        Tratamientos_comorbilidades,
        Descripcion_herida,
        Resultado
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
        data.nombre,
        data.apellido,
        data.segundo_apellido,
        data.edad,
        data.convenio,
        data.fecha_accidente,
        data.fecha_ultima_cirugia,
        data.numero_de_dias,
        data.centro_de_atencion,
        data.quien_registra,
        data.nombre_registrante,
        JSON.stringify(data.comorbilidades),
        JSON.stringify(data.tratamientos_comorbilidad),
        JSON.stringify(data.descripcion_herida),
        data.resultado
    );

    return new Response(JSON.stringify({ success: true }), {
        status: 200,
    });
}