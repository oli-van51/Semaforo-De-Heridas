import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export async function POST({ request }) {
    const { titulo, contenido } = await request.json();
    const doc = new PDFDocument();
    const filePath = path.join(process.cwd(), "resultados", "pdf", `${titulo}.pdf`);
    const fileStream = fs.createWriteStream(filePath);

    let buffers = [];
    doc.pipe(fileStream);

    return new Promise((resolve) => {
        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        resolve(new Response(pdfData, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${titulo}.pdf"`
            }
        }));
    });
        doc.text("Información del registro:", { align: 'center', fontSize: 20 });
        doc.moveDown();
        doc.text(JSON.stringify(contenido.fields, null, 2));
        doc.addPage();

        doc.text("Comorbilidades:", { align: 'center', fontSize: 20 })
        doc.moveDown();
        doc.text(JSON.stringify(contenido.comorbilidades, null, 2));
        doc.moveDown();

        doc.text("Tratamientos de comorbilidades:", { align: 'center', fontSize: 20 })
        doc.moveDown();
        doc.text(JSON.stringify(contenido.tratamientos_comorbilidades, null, 2));
        doc.addPage();

        doc.text("Descripciones de herida:", { align: 'center', fontSize: 20 })
        doc.moveDown();
        doc.text(JSON.stringify(contenido.descripcion_herida, null, 2));

        doc.end();
    });
}