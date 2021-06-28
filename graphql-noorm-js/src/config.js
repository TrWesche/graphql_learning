import path from 'path';
import dotenv from 'dotenv';

dotenv.config({path: path.resolve(__dirname, '.env')});

const PORT = process.env.PORT;


// ARANGODB Database Information
const ARANGODB_ADDRESS = process.env.ARANGODB_ADDRESS;
const ARANGODB_NAME = process.env.ARANGODB_NAME;
const ARANGODB_USER = process.env.ARANGODB_USER;
const ARANGODB_PASSWORD = process.env.ARANGODB_PASSWORD;

// Node Environment
const NODE_ENV = "dev";

// Security Information
const PRIVATE_KEY = process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.replace(/\\n/gm, '\n') : undefined;
const BCRYPT_WORK_FACTOR = process.env.BCRYPT_WORK_FACTOR;

// Permitted Access Addresses
const ORIGIN_WEBAPP = process.env.ORIGIN_WEBAPP;

export {
    PORT,
    ARANGODB_ADDRESS,
    ARANGODB_NAME,
    ARANGODB_USER,
    ARANGODB_PASSWORD,
    NODE_ENV,
    BCRYPT_WORK_FACTOR,
    ORIGIN_WEBAPP,
    PRIVATE_KEY
};