import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config();

const { Pool, types} = pkg;

// return date col (OID 1082) as plain 'YYYY-MM-DD' string as plain json

types.setTypeParser(1082, (val) => val);

const pool = new Pool({
    connectionString : process.env.DATABASE_URL,
    ssl : { rejectUnauthorized: false},
})

pool.on('connect' , () => {
    console.log('Connect to neon postgres!');
})

pool.on('error', (err) => {
    console.error('unexpected postgres error:', err);
    process.exit(-1);
})

export default pool; 