const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/Dispensary");

const express = require("express");
const app = express();

const userRoute = require('./routes/userRoute');
app.use('/',userRoute);


app.listen(3000,function(){
  console.log("Server is running...")
});