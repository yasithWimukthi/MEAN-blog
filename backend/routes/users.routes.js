const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/user');

/**
 * save user email and encrypted password in database*/
router.post('/signup',(req, res, next) =>{
  bcrypt.hash(req.body.password,10)
    .then(hash =>{
      const user = new User({
        email: req.body.email,
        password: hash
      });

      user.save()
        .then((result) =>{
          res.status(201).json({
            message: 'User created',
            result
          })
        })
        .catch((error) =>{
          res.status(500).json({error})
        })
    });

})

/**validate user name and password
 * create json web token
 * */
router.post('/login',(req,res,next) => {
  User.findOne({email: req.body.email})
    .then(user => {
      if(!user){
        return res.status(401).json({
          message: 'User not found'
        })
      }
      return bcrypt.compare(req.body.password,user.password);
    })
    .then(result => {
      if(!result){
        return res.status(401).json({
          message: 'Password is wrong.'
        })
      }
      /** create json web token*/
      const token = jwt.sign(
        {email:user.email,userId:user._id},
        'secret_this_should_be_longer',
        {expiresIn: '1h'}
      );
    })
    .catch((error) =>{
      res.status(501).json({
        message: 'Auth failed.'
      })
    })
})


module.exports = router;
