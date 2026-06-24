require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');


require('dotenv').config();

const app = express();

connection();

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`)
}) 