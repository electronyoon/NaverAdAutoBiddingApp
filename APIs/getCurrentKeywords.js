// importing
import Signatures from '../util/Signatures.js';
import dotenv from 'dotenv';
dotenv.config();

// setting variables
const { API_URL, API_KEY, CUSTOMER, SECRET_KEY, GROUP_ID } = process.env;
const timestamp = Date.now() + '';
const method = 'GET';
const resource = '/ncc/keywords';

// setting headers and params
const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'X-Timestamp': timestamp,
    'X-API-KEY': API_KEY,
    'X-Customer': CUSTOMER,
    'X-Signature': Signatures.of(timestamp, method, resource, SECRET_KEY)
}
const params = {
    'nccAdgroupId': GROUP_ID
}

// request to get current keywords
import axios from 'axios';
const getCurrentKeywords = async () => {
    try {
        const response = await axios.get(`${API_URL}${resource}`, {
            headers: headers,
            params: params
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
  
export default getCurrentKeywords;
  