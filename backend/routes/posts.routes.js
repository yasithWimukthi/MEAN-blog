const express = require('express');
const multer = require('multer');

const router = express.Router();

const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');

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
router.post(
  '',
  checkAuth,
  multer({storage:storage}).single('image'),
  (req,res,next) => {
  //const post = req.body;
  const url = req.protocol + "://" + req.get('host');
  const post = new Post({
    title:req.body.title,
    content:req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator:req.userData.userId
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
  checkAuth,
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
    imagePath: imagePath,
    creator : req.userData.userId
  });
  Post.updateOne({_id:req.params.id,creator:req.userData.userId},post)
    .then(result =>{
      console.log(result);
      if (result.nModified > 0){
        res.status(200).json({message:'post is updated',imagePath})
      }else{
        res.status(401).json({message:'Not authorized.',imagePath})
      }

    })
});

/** get all posts*/
router.get('',(req,res,next) => {
  // const posts = [
  //   {id:'post-1',title:'first server side post',content:'first server side post content'},
  //   {id:'post-2',title:'second server side post',content:'second server side post content'}
  // ]
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;

  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage-1))
      .limit(pageSize)
  }

  postQuery
    .then(documents => {
      // console.log(documents)
      fetchedPosts = documents;
      return Post.count()
    })
    .then(count =>{
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: fetchedPosts,
        maxPosts: count
      })
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
router.delete('/:id',checkAuth,(req,res,next) =>{
  //console.log(req.params.id);
  Post.deleteOne({_id:req.params.id,creator:req.userData.userId})
    .then(result =>{
      console.log(result);
      if (result.n > 0){
        res.status(200).json({message:'post is deleted.'})
      }else{
        res.status(401).json({message:'Not authorized.'})
      }
    })
})

module.exports = router;
