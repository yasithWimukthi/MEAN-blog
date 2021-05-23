const express = require('express');
const bodyParser = require('body-parser');
const app = express();

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
    "GET, POST,PATCH, DELETE, OPTIONS"
  );
  next();
})

app.post('/api/posts',(req,res,next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({message:'posts added successfully'})
})


app.get('/api/posts',(req,res,next) => {
  const posts = [
    {id:'post-1',title:'first server side post',content:'first server side post content'},
    {id:'post-2',title:'second server side post',content:'second server side post content'}
  ]
  res.status(200).json({
    message:'posts fetched',
    posts
  });

})

module.exports = app;
