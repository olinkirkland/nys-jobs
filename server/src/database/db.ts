import dotenv from 'dotenv';
import postgres from 'postgres';

dotenv.config();

console.log('Database URL:', process.env.DATABASE_URL);
const databaseUrl = process.env.DATABASE_URL!;
const sql = postgres(databaseUrl);

export default sql;
