import fs from 'fs';
import axios from 'axios';

const infura_api_add = '/api/v0/add'

const response = axios({
    method: 'post',
    url: process.env.INFURA_ENDPOINT + infura_api_add,
    data: {

    }
});