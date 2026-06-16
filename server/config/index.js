const express  = require('express')
const database = require('./database')

const app = express()



app.listen(5000, () => {
    console.log('running...')
})