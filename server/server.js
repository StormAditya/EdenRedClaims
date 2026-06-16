const express = require('express');
const cors = require('cors');
const index = require('./config/index')

require('./config/index'); 

const loginRouter = require('./routes/router-login');
const adminRouter = require('./routes/router-admin')

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api', loginRouter);
app.use('/api/admin-dashboard', adminRouter);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
}); 