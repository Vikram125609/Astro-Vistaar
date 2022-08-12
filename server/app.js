const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
dotenv.config({path:"./config.env"});
app.use(cookieParser());
const connectDatabase = require('./database/database');
const router = require('./routes/api');
connectDatabase();
app.use(express.json());
app.use(cors({origin:"http://localhost:3000"}));
app.use("/api",router);
app.listen(process.env.PORT, () => {
    console.log(`Server is running at ${process.env.PORT}`);
});