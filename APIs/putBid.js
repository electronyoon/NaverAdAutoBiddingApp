import Signatures from '../util/Signatures.js';
import dotenv from 'dotenv';
dotenv.config();
const { API_URL, API_KEY, CUSTOMER, SECRET_KEY } = process.env;

import axios from 'axios';
const putBid = async (data) => {
    const timestamp = Date.now() + '';
    const method = 'PUT';
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
        'fields': 'bidAmt'
    }
    const config = {
        headers: headers,
        params: params
    };
    // sending request
    axios.put(`${API_URL}${resource}`, data, config)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error;
        });
};

export default putBid;