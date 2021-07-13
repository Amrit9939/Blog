import { Meteor } from 'meteor/meteor';
import express from 'express';
import {WebApp} from 'meteor/webapp';
import md5 from 'md5';
import bcrypt from 'bcrypt';
const Fiber = require('fibers');
import {User,Post} from '../collections/collection.js';

const app = express();
app.use(express.json());
// Meteor.startup(() => {
//   // code to run on server at startup
// });
console.log("yes");

app.post('/signup',(req,res)=>{
  Fiber(async function(){
    try {
      const userexist = await User.findOne({email:req.body.email});
      if(userexist){
       return  res.status(200).json({message:"user already exists"})
      }
      const password = md5(req.body.password);
      const cpassword = md5(req.body.cpassword);
      await User.insert({
        email:req.body.email,
        password:password,
        cpassword:cpassword,
        createdAt:new Date()
      });
      return res.status(200).json({
        message:'registred'
      })
    } catch (err) {
      console.log(err);
      }
    }
  ).run();
});

app.post('/signin',(req,res)=>{
  Fiber(async function(){
    try {
      const email = req.body.email;
      const password = md5(req.body.password);
      const user = await User.findOne({email:email});
      if(user){
        if(user.password==password){
          res.status(200).json({message:'signin succes'});
        }else {
          res.status(200).json({message:'invalid cridintials'});
        }
      }else {
        res.status(200).json({message:"invalid cridintials"});
      }
    } catch (err) {
      res.status(404).json({message:err.message});
    }
  }).run();
});

app.post("/post",(req,res)=>{
  console.log("in /post");
  Fiber(async function(){
    try {
      await Post.insert({title:req.body.title,desc:req.body.desc,CreatedAt:req.body.CreatedAt,blogid:req.body.blogid});
      res.status(200).json({message:"post inserted"});
    } catch (err) {
      res.status(400).json({message:err});
    }
  }).run();
});

app.post("/delete-blog",(req,res)=>{
  console.log("in delete");
  Fiber(async function(){
    try {
      await Post.remove({blogid:req.body.id});
      res.status(200).json({message:"blog deleted"});
    } catch (err) {
      console.log(err);
      res.status(400).json({message:err});
    }
  }).run();
});

app.post("/edit-blog",(req,res)=>{
  Fiber(async function(){
    try {
      await Post.update({blogid:req.body.id},{$set:{title:req.body.title,desc:req.body.desc}});
      res.status(200).json({message:"blog updated"});
    } catch (err) {
      console.log(err);
      res.status(500).json({message:err});
    }
  }).run();
});

<<<<<<< HEAD
app.post("/blog",(req,res)=>{
  Fiber(async function(){
    try {
      var blog = await Post.findOne({blogid:req.body.id});
      res.status(200).json({message:blog});
    } catch (err) {
      res.status(500).json({message:err});
    }
  }).run();
})

=======
>>>>>>> 06c25418d267e0093922cb7d6bdeb8a201ff32e0
WebApp.connectHandlers.use(app);

Meteor.publish('getPosts',()=>{
  return Post.find({});
<<<<<<< HEAD

=======
>>>>>>> 06c25418d267e0093922cb7d6bdeb8a201ff32e0
})
