import dotenv from 'dotenv';
import { Pool } from 'pg';
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in the environment variables');
}

const pool = new Pool({
    connectionString,
});

async function connectToDatabase() {
    try {
        await pool.query('SELECT 1');
        console.log('PostgreSQL connected');
    } catch (error) {
        throw new Error(`Database connection failed: ${error.message}`);
    }
}

export { pool, connectToDatabase };