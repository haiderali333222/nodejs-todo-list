require('dotenv').config();
export const MONGODB_HOST = process.env.MONGODB_HOST || 'mongodb://localhost:27017/';
export const MONGODB_NAME = process.env.MONGODB_NAME || 'todo';
export const MONGO_USER = process.env.MONGO_USER ;
export const MONGO_PW = process.env.MONGO_PW;

export const { MONGODB_URL } = process.env;
