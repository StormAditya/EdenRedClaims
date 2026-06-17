const express = require('express');
const cors = require('cors');
const index = require('./config/index')

require('./config/index'); 

const loginRouter = require('./routes/router-login');
const adminRouter = require('./routes/router-admin')
const employeeRouter = require('./routes/router-employe')

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api', loginRouter);
app.use('/api/admin-dashboard', adminRouter);
app.use('/api/employee-dashboard', employeeRouter);

//app.use('/api/employee-dashboard/:id', employeeRouter);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
}); 