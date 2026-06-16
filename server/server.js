const express = require('express');
const cors = require('cors');

require('./config/index'); 

const loginRouter = require('./routes/router-login');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', loginRouter);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});