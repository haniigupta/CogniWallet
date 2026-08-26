import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import pool from '../utils/db.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DROP_ALL = `
    DROP TABLE IF EXISTS ai_insights CASCADE; 
    DROP TABLE IF EXISTS budgets CASCADE; 
    DROP TABLE IF EXISTS transactions CASCADE; 
    DROP TABLE IF EXISTS categories CASCADE; 
    DROP TABLE IF EXISTS users CASCADE; 
`;