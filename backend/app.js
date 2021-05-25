const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

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

app.post('/api/posts',(req,res,next) => {
  //const post = req.body;
  const post = new Post({
    title:req.body.title,
    content:req.body.content
  })
  post.save()
    .then(createdPost => {
      res.status(201).json({
        message:'posts added successfully',
        postId: createdPost._id
      })
    } )
    .catch(err => console.log(`Post ${req.body.title} not saved.\n ${err.toString()}`));

  //console.log(post);
})

app.put('/api/posts/:id',(req,res,next) => {
  const post = new Post({
    _id:req.body.id,
    title:req.body.title,
    content:req.body.content
  });
  Post.updateOne({_id:req.params.id},post)
    .then(result =>{
      console.log(result);
      res.status(200).json({message:'post is updated'})
    })
});

/** get all posts*/
app.get('/api/posts',(req,res,next) => {
  // const posts = [
  //   {id:'post-1',title:'first server side post',content:'first server side post content'},
  //   {id:'post-2',title:'second server side post',content:'second server side post content'}
  // ]
  Post.find()
    .then(documents => {
      console.log(documents)
      res.status(200).json({
        message:'posts fetched',
        posts: documents
      });
    })
})

/** get single post*/
app.get('/api/posts/:id',(req,res,next) =>{
  Post.findById(req.params.id)
    .then(post =>{
      if(post){
        res.status(200).json(post)
      }else{
        res.status(404).json({message: 'No post found'})
      }
    })
});

/** delete single post*/
app.delete('/api/posts/:id',(req,res,next) =>{
  //console.log(req.params.id);
  Post.deleteOne({_id:req.params.id})
    .then(result =>{
      console.log(result);
      res.status(200).json({message:'post deleted.'})
    })
})

module.exports = app;
