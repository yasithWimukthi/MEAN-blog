const express = require('express');
const multer = require('multer');

const router = express.Router();

const Post = require('../models/post');

const MIME_TYPE_MAP = {
  'image/png':'png',
  'image/jpeg': 'jpg',
  'image/jpg' : 'jpg'
}

/** upload image*/
const storage = multer.diskStorage({
  destination : (req,file,callback) =>{
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if(isValid) error = null;
    callback(error,'backend/images');
  },
  fileName: (req,file,callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const extension = MIME_TYPE_MAP[file.mimetype];
    callback(null,name + '-' +Date.now() +'.'+ extension);
  }
});

/*** save post*/
router.post('',multer({storage:storage}).single('image'),(req,res,next) => {
  //const post = req.body;
  const url = req.protocol + "://" + req.get('host');
  const post = new Post({
    title:req.body.title,
    content:req.body.content,
    imagePath: url + "/images/" + req.file.filename
  })
  post.save()
    .then(createdPost => {
      res.status(201).json({
        message:'posts added successfully',
        post : {
          id: createdPost._id,
          title: createdPost.title,
          content: createdPost.content,
          imagePath : createdPost.imagePath
        }
      })
    } )
    .catch(err => console.log(`Post ${req.body.title} not saved.\n ${err.toString()}`));

  //console.log(post);
})

router.put(
  '/:id',
  multer({storage:storage}).single('image'),
  (req,res,next) => {
    let imagePath = req.body.imagePath;
    if(req.file){
      const url = req.protocol + "://" + req.get('host');
      imagePath = url + "/images/" + req.file.filename;
    }

  const post = new Post({
    _id:req.body.id,
    title:req.body.title,
    content:req.body.content,
    imagePath: imagePath
  });
  Post.updateOne({_id:req.params.id},post)
    .then(result =>{
      console.log(result);
      res.status(200).json({message:'post is updated',imagePath})
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
