// importing
import Signatures from '../util/Signatures.js';
// import dotenv from 'dotenv';
// dotenv.config();

// for test
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config({
    path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '.env'),
});

// setting variables
const { API_URL, API_KEY, CUSTOMER, SECRET_KEY } = process.env;
const timestamp = Date.now() + '';
const method = 'GET';
const resource = '/ncc/managedKeyword';

// setting headers and params
const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'X-Timestamp': timestamp,
    'X-API-KEY': API_KEY,
    'X-Customer': CUSTOMER,
    'X-Signature': Signatures.of(timestamp, method, resource, SECRET_KEY)
}

import axios from 'axios';
const isKeywordPopular = async (keyword) => {
    try {
        const response = await axios.get(`${API_URL}${resource}`, {
            headers: headers,
            params: {
                'keywords': keyword
            }
        });
        // if exposables are more than 3, consider as popular
        return response.data[0].managedKeyword.PCPLMaxDepth > 3;
    } catch (error) {
        throw error;
    }
};

export default isKeywordPopular;