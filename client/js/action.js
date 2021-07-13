import {Meteor} from 'meteor/meteor';
const Blog = new Mongo.Collection(null);
import {Post} from "../../collections/collection.js";
import axios from 'axios';
// import Quill from 'quill/core';
// import Toolbar from 'quill/modules/toolbar';
// import Snow from 'quill/themes/snow';
// import Bold from 'quill/formats/bold';
// import Italic from 'quill/formats/italic';
// import Header from 'quill/formats/header';
//
// Quill.register({
//   'modules/toolbar': Toolbar,
//   'themes/snow': Snow,
//   'formats/bold': Bold,
//   'formats/italic': Italic,
//   'formats/header': Header
// });

console.log("yes");
var x = null;
var text = "";

Template.HomeLayout.events({
  'click #signup': function(event){
    event.preventDefault();
    FlowRouter.go('/signup');
  },
  'click #signin': function(event){
    event.preventDefault();
    FlowRouter.go('/signin');
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
            FlowRouter.go("/blog");
          }
      }).catch(err=>{
        console.log(err);
      })
    }
  },
  'click #signin-redirect':function(){
    FlowRouter.go("/signin");
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
            FlowRouter.go("/blog");
          }
      }).catch(err=>{
        console.log(err);
      })
    }
  },
  'click #signup-redirect': function(){
    FlowRouter.go("/signup");
  }
});

Template.BlogLayout.events({
  'click .create-btn':function(){
    FlowRouter.go("/create");
  },
  'click .delete-btn':function(event){
     var obj = {
       id:this.blogid
     }
     axios.post("/delete-blog",obj).then((res)=>{
       console.log("in delete");

     }).catch(err=>{
       console.log(err);
     })
  },
  'click .edit-btn':function(){

    // BlazeLayout.render('EditLayout',{id: this.blogid,title:this.title,desc:this.desc});
    FlowRouter.go(`/edit/${this.blogid}`);
  },
  'click .view':function(){
    FlowRouter.go(`/detail/${this.blogid}`);
  }
});

Template.CreateLayout.events({
  'submit .blog-form': function(event){
    event.preventDefault();
    // var r = quill.root.innerHTML;
    // console.log(r);
    const title= event.target.title.value;
    const desc = $(".ql-editor").html();
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
        FlowRouter.go("/blog");
      }).catch(err=>{
        console.log(err);
      })
    }
  },
  'click .quill1': function(){
    var r = $(".ql-editor").html();
    console.log(r);
  }
})

Template.EditLayout.events({
  'submit .edit-blog-form':function(event){
    event.preventDefault();
    var obj = {
      id:x,
      title:event.target.title.value,
      desc:$(".ql-editor").html()
    }
    axios.post("/edit-blog",obj).then((res)=>{
      FlowRouter.go("/blog");
      // BlazeLayout.render("BlogLayout");
    }).catch(err=>{
      console.log(err);
    })
  }
})

Template.BlogLayout.helpers({
  posts:function(){
    return Post.find({},{sort:{CreatedAt:-1}}).fetch();
  }
});

Template.BlogLayout.onRendered(()=>{
  Meteor.subscribe('getPosts');
})

Template.EditLayout.onRendered(()=>{
  var bid = FlowRouter.current().params.blogid;
  console.log(bid);
  // Blogid._collection.insert({bid});
  x=bid;

  $.getScript( "https://cdn.quilljs.com/1.3.7/quill.js")
  .done(function( script, textStatus ) {
    console.log( textStatus );
    var quill1 = new Quill('#editor1', {
      theme: 'snow'
    });
  })
  .fail(function( jqxhr, settings, exception ) {
});

})

Template.DetailLayout.onRendered(()=>{
  var bid = FlowRouter.current().params.blogid;
  var obj = {
    id:bid
  }
  axios.post("/blog",obj).then((res)=>{
    var blog = res.data.message;
    Blog._collection.insert({desc:blog.desc});
    console.log(Blog.find({}).fetch());
  }).catch(err=>{
    console.log(err);
  })
})

Template.DetailLayout.onDestroyed(()=>{
   Blog.remove({});
})

Template.DetailLayout.helpers({
   blog:function(){
     return Blog.find({}).fetch();
   }
})

Template.CreateLayout.onRendered(()=>{
  $.getScript( "https://cdn.quilljs.com/1.3.7/quill.js")
  .done(function( script, textStatus ) {
    console.log( textStatus );
    var quill = new Quill('#editor', {
      theme: 'snow'
    });
  })
  .fail(function( jqxhr, settings, exception ) {
});
});

Template.DetailLayout.events({
  'click .back':function(){
    FlowRouter.go("/blog");
  }
})



Template.EditLayout.onRendered(()=>{

})
