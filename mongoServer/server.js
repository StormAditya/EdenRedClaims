const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const {connection} = require('./db')

require('dotenv').config();

const app = express();

connection();


app.listen((port) => {
    console.log(`Server listening on port: ${port}`)
})