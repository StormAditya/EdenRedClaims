const mongoose = require('mongoose');
require('dotenv').config();

const uri = "mongodb://localhost:27017/receiptsDB";

const connection = async () => {
    try{
        await mongoose.connect(uri);
        console.log('Database Connected SUccessfully');
    }
    catch(err){
        console.error(err);
    }
}

module.exports = {connection};
