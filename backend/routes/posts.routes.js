const express = require('express');
const router = express.Router();

const Post = require('../models/post');

router.post('',(req,res,next) => {
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

router.put('/:id',(req,res,next) => {
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
router.get('',(req,res,next) => {
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
router.get('/:id',(req,res,next) =>{
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
router.delete('/:id',(req,res,next) =>{
  //console.log(req.params.id);
  Post.deleteOne({_id:req.params.id})
    .then(result =>{
      console.log(result);
      res.status(200).json({message:'post deleted.'})
    })
})

module.exports = router;