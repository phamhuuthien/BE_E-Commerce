const express = require('express');
require('dotenv').config();
const app = express();
const initRoute = require('./routes')
const port = process.env.PORT || 8888;
const dbconnect = require('./config/dbconnect');
const cookieParser = require('cookie-parser');
// express hiểu được file json
app.use(express.json());
app.use(cookieParser());
// đọc được file từ client gửi lên
app.use(express.urlencoded({extended : true}))

dbconnect()

initRoute(app)


app.listen(port,()=>{
    console.log("listening on port")
})

