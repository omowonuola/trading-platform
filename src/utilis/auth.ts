import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = 'process.env.JWT_SECRET'


export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}


export const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
}

export const generateToken = (payload: object): string => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h'})
}

