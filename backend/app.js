const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const postRoutes = require('./routes/posts.routes');
const userRoutes = require('./routes/users.routes');

const app = express();

mongoose.connect("mongodb+srv://wimukthi:mongo123@cluster0.oq224.mongodb.net/blogApp?retryWrites=true&w=majority")
  .then(r =>{console.log("connected to the database")} )
  .catch((e)=>{console.log("connection failed "+e.toString())})

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({extended:false}))

/** giving permission to access images folder*/
app.use("/images",express.static(path.join('backend/images')));


app.use((req,res,next) => {
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST,PATCH,PUT, DELETE, OPTIONS"
  );
  next();
})

app.use('/api/posts',postRoutes);
app.use('/api/user',userRoutes);

module.exports = app;
