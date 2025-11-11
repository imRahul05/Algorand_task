import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

const getEnvVar = (name: string, fallback?: string): string => {
    const value = process.env[name];
    if (value !== undefined) { // allow empty string ""
        return value;
    }

    if (fallback !== undefined) {
        return fallback;
    }

    throw new Error(`Environment variable ${name} is not set.`);
};

export const env = {
    PORT: getEnvVar('PORT', '5001'),
    MONGODB_URI: getEnvVar('MONGODB_URI'),
    ALGOD_SERVER: getEnvVar('ALGOD_SERVER'),
    ALGOD_TOKEN: getEnvVar('ALGOD_TOKEN', ''),
    ALGOD_PORT: getEnvVar('ALGOD_PORT', ''),
    ALGOD_API_ADDR:getEnvVar('ALGOD_API_ADDR','')
};
