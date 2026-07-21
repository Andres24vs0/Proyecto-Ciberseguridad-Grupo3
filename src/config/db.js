import { Pool } from 'pg';

// Configuración base de la base de datos relacional
// Los datos actuales son de ejemplo, hay que conversar que credenciales usar para la conexión 
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'proyecto_grupo3',
    password: 'tu_clave_aqui',
    port: 5432,
});

export default pool;