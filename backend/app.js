const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postRoutes = require('./routes/posts.routes');

const app = express();

mongoose.connect("mongodb+srv://wimukthi:mongo123@cluster0.oq224.mongodb.net/blogApp?retryWrites=true&w=majority")
  .then(r =>{console.log("connected to the database")} )
  .catch((e)=>{console.log("connection failed "+e.toString())})

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({extended:false}))

app.use((req,res,next) => {
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST,PATCH,PUT, DELETE, OPTIONS"
  );
  next();
})

app.use('/api/posts',postRoutes);

module.exports = app;
