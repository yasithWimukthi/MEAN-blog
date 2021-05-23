const express = require('express');
const app = express();


app.use('/api/posts',(req,res,next) => {
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
