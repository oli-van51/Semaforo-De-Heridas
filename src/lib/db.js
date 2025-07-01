import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dir = path.resolve("resultados");
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new Database(path.join(dir, "registro_semaforo_de_heridas.sqlite"));

db.exec(`
CREATE TABLE IF NOT EXISTS patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  Nombre TEXT,
  Apellido TEXT,
  Segundo_apellido TEXT,
  Edad TEXT,
  Convenio TEXT,
  Fecha_accidente TEXT,
  Fecha_ultima_cirugia TEXT,
  Numero_de_dias TEXT,
  Centro_de_atencion TEXT,
  Quien_registra TEXT,
  Nombre_registrante TEXT,
  Comorbilidades TEXT,
  Tratamientos_comorbilidades TEXT,
  Descripcion_herida TEXT,
  Resultado TEXT
);
`);

export default db;