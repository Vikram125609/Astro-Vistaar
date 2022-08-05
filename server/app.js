const express = require('express');
const dotenv = require('dotenv');
// const cookieParser = require('cookie-parser');
const app = express();
dotenv.config({path:"./config.env"});
const connectDatabase = require('./database/database');
const router = require('./routes/api');
connectDatabase();
app.use(express.json());
// app.use(cookieParser);
app.use("/api",router);
app.listen(process.env.PORT, () => {
    console.log(`Server is running at ${process.env.PORT}`);
});