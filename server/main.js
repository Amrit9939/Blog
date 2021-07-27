const fs = require('fs');
import { Meteor } from 'meteor/meteor';
import multer from "multer";
import express from 'express';
import {WebApp} from 'meteor/webapp';
import md5 from 'md5';
import bcrypt from 'bcrypt';
const upload = multer({ dest: 'uploads/' });
const Fiber = require('fibers');
import {User,Post} from '../collections/collection.js';
const uploadfile = require("express-fileupload");
const jwt = require('jsonwebtoken');

var ffmpeg = require('ffmpeg');
const {uploadFile,getFile,uploadFile1} = require("./s3");

const signup = require("./routes/signup");

const app = express();
app.use(express.json());
app.use(uploadfile());
app.use("/signup1",signup);
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
          const payload = {
      id: user._id,
    };

    var token = await jwt.sign(payload, 'amritbdjd', { expiresIn: 3600 * 1000 });
if (!token) {
      console.log(err);
    } else {
      return res.json({
        id: user._id,
        message: 'Welcome back!',
        code: 200,
        token: token,
      });
    }


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
  var file = req.file;
  // console.log(req);
  Fiber(async function(){
    try {
      const result = await uploadFile(file);
      console.log(result.key);
      await Post.insert({title:req.body.title,desc:req.body.desc,CreatedAt:req.body.CreatedAt,blogid:req.body.blogid,key:"image/"+result.key});
      res.status(200).json({message:"post inserted"});
    } catch (err) {
      console.log(err);
      res.status(400).json({message:err});
    }
  }).run();
});

app.post("/video",(req,res)=>{
  console.log("in video");
  var file = req.files.file;

  file.mv("tmp/" + file.name, function (err) {
       if (err) {
           console.log(err);
       }
     else {
         console.log("succes");
         try {
         var process = new ffmpeg('tmp/'+file.name);
         process.then( function (video) {
           console.log('The video is ready to be processed');
           var newfilename='temp'+Date.now()+'.mp4';
           video.fnExtractSoundToMP3("tmp/"+newfilename);
           video.setDisableAudio();

           video.setVideoSize("50%", true,true, "")
           video.save("tmp/"+newfilename,async function(err,file){
             if(err){
               console.log("error");
               console.log(err);
             }else {
               const result = await uploadFile1(file);
               console.log("in result");
               console.log(result);
             }
           })
           // const fileStream = fs.createReadStream("tmp/"+newfilename);
           // console.log(fileStream);
         }, function (err) {
           console.log('Error: ' + err);
         });
         } catch (e) {
         console.log(e);
         console.log(e);
         }
     }
});

})

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
      // console.log(readStream);
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
