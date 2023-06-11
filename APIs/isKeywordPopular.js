import Signatures from '../util/Signatures.js';
import dotenv from 'dotenv';
dotenv.config();
const { API_URL, API_KEY, CUSTOMER, SECRET_KEY } = process.env;

import axios from 'axios';
const isKeywordPopular = async (keyword) => {
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
    const params = {
        'keywords': keyword
    }
    const config = {
        headers: headers,
        params: params
    };
    // sending request
    try {
        const response = await axios.get(`${API_URL}${resource}`, config);
        return response.data[0].managedKeyword.PCPLMaxDepth > 3;
    } catch (error) {
        throw error;
    }
};

export default isKeywordPopular;