import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.DB_USER || 'app_grupo3',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'proyecto_grupo3',
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
});

export default pool;