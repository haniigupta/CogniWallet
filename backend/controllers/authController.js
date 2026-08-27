import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../db.js'
import { defaultCategories } from '../utils/defaultCategories.js'

const signToken = (userId) => 
    jwt.sign({ userId}, process.env.JWT_SECRET, { expiresIn: '7d'});
