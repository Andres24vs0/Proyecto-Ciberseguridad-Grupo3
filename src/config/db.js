import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'proyecto_grupo3',
    password: 'clavada123',
    port: 5432,
});

export default pool;