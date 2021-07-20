import { Meteor } from 'meteor/meteor';
import multer from "multer";
import express from 'express';
import {WebApp} from 'meteor/webapp';
import md5 from 'md5';
import bcrypt from 'bcrypt';
const upload = multer({ dest: 'uploads/' });
const Fiber = require('fibers');
import {User,Post} from '../collections/collection.js';

const {uploadFile,getFile} = require("./s3");

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
          res.status(200).send(user);

        }else {
          res.status(200).json({message:'invalid cridintials'});
        }
      }else {
        res.status(200).json({message:"user not exists"});
      }
    } catch (err) {
      res.status(404).json({message:err.message});
    }
  }).run();
});

app.post("/post",upload.single('image'),(req,res)=>{
  console.log("in /post");
  console.log(req.file);
  Fiber(async function(){
    try {
      const result = await uploadFile(req.file);
      console.log(result.key);
      await Post.insert({title:req.body.title,desc:req.body.desc,CreatedAt:req.body.CreatedAt,blogid:req.body.blogid,key:"image/"+result.key});
      res.status(200).json({message:"post inserted"});
    } catch (err) {
      console.log(err);
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


app.post("/blog",(req,res)=>{
  Fiber(async function(){
    try {
      var blog = await Post.findOne({blogid:req.body.id});
      res.status(200).send(blog);
    } catch (err) {
      res.status(500).json({message:err});
    }
  }).run();
});

app.get("/image/:key",(req,res)=>{
  Fiber(async function(){
    try {
      const key = req.params.key
      const readStream = await getFile(key)
      console.log(readStream);
      readStream.pipe(res);
    } catch (err) {
      console.log(err);
    }
  }).run()
})

WebApp.connectHandlers.use(app);

Meteor.publish('getPosts',()=>{
  return Post.find({});

})
