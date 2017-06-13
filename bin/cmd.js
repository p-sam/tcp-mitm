#!/usr/bin/env node
const dotenv = require('dotenv');

if(process.argv[2]) {
    dotenv.config({path: process.argv[2]});
} else {
    dotenv.config();
}

require('../index.js');