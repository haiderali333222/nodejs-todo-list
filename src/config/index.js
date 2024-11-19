require('dotenv').config();

export const { PRICING_DB_URI } = process.env;
export const { PRICING_MONGO_URL } = process.env;
export const IS_PRODUCTION = process.env.ENVIRONMENT === 'production';
export const {PORT,ENVIRONMENT} =process.env