import {Meteor} from 'meteor/meteor';
// const Posts = new Mongo.Collection(null);
import {Post} from "../../collections/collection.js";
import axios from 'axios';

Template.HomeLayout.events({
  'click #signup': function(event){
    event.preventDefault();
    // FlowRouter.go('/signup');
    BlazeLayout.render("SignupLayout");
  },
  'click #signin': function(event){
    event.preventDefault();
    // FlowRouter.go('/signin');
    BlazeLayout.render("SigninLayout");
  }
});

Template.SignupLayout.events({
  'submit .form-signup': function(event){
    event.preventDefault();
    const email=event.target.email.value;
    const password=event.target.password.value;
    const cpassword=event.target.cpassword.value;
    if(!email || !password || !cpassword){
      alert("please fill all");
    }
    else if(password!==cpassword){
      alert("password not matched");
    }
    else{
      const obj = {
        email:email,
        password:password,
        cpassword:cpassword
      }
      axios.post("/signup",obj).then((res)=>{
          if(res.data.message==="user already exists"){
            alert("user already exists");
          }else {
            // change
            BlazeLayout.render("BlogLayout");
          }
      }).catch(err=>{
        console.log(err);
      })
    }
  },
  'click #signin-redirect':function(){
    // FlowRouter.go("/signin");
    BlazeLayout.render("SigninLayout");
  }
});

Template.SigninLayout.events({
  'submit .form-signin': function(event){
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    if(!email || !password){
      alert("please fill all");
    }else{
      var obj ={
        email:email,
        password:password
      }
      axios.post("/signin",obj).then((res)=>{
          if(res.data.message=="user not exists"){
            alert("user not exists");
          }
          else if (res.data.message=="invalid cridintials") {
            alert("invalid cridintials");
          }else {
            alert("signin succes");
            // change
            BlazeLayout.render("BlogLayout");
          }
      }).catch(err=>{
        console.log(err);
      })
    }
  },
  'click #signup-redirect': function(){
    // FlowRouter.go("/signup");
    BlazeLayout.render("SignupLayout");
  }
});

Template.BlogLayout.events({
  'submit .blog-form': function(event){
    event.preventDefault();
    const title= event.target.title.value;
    const desc = event.target.desc.value;
    if(!title || !desc){
      alert("please fill all");
    }
    else{
      var obj = {
        title:title,
        desc:desc,
        CreatedAt:new Date(),
        blogid:'blog'+ Date.now()
      }
      // Post._collection.insert(obj);
      axios.post("/post",obj).then((res)=>{

        alert(res.data.message);
      }).catch(err=>{
        console.log(err);
      })
    }
  },
  'click .delete-btn':function(event){
     var obj = {
       id:this.blogid
     }
     axios.post("/delete-blog",obj).then((res)=>{
       console.log("in delete");
       alert(res.data.message)
     }).catch(err=>{
       console.log(err);
     })
  },
  'click .edit-btn':function(event){
    event.preventDefault();
    BlazeLayout.render('EditLayout',{id: this.blogid,title:this.title,desc:this.desc});
  }
});

Template.EditLayout.events({
  'submit .edit-blog-form':function(event){
    event.preventDefault();
    var obj = {
      id:event.target.id.value,
      title:event.target.title.value,
      desc:event.target.desc.value
    }
    console.log(obj);
    axios.post("/edit-blog",obj).then((res)=>{
      alert(res.data.message);
      // FlowRouter.go("/blog");
      BlazeLayout.render("BlogLayout");
    }).catch(err=>{
      console.log(err);
    })
  }
})

Template.BlogLayout.helpers({
  posts:function(){
    return Post.find({}).fetch();
  }
});

Template.BlogLayout.onRendered(()=>{
  Meteor.subscribe('getPosts');
})
