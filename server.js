require('dotenv').config()
const express=require('express');
const app=express();
const port=3333;
const bodyParser = require('body-parser');



const connectDB = require('./config/db.js');
connectDB();


// // built-in middleware to parse JSON
app.use(express.json());
app.use('/api/users',require('./routes/api/users.js'))





app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})