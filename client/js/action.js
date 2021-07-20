
import {Meteor} from 'meteor/meteor';
const Blog = new Mongo.Collection(null);
import {Post} from "../../collections/collection.js";
import axios from 'axios';
import { Session } from 'meteor/session'

import'cropperjs/dist/cropper.css';

import Cropper from 'cropperjs';


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
            const result = res.data;
            console.log(result);
            Session.setPersistent({"userid":result._id});
            setTimeout(myFunction, 60*60*1000);
            function myFunction(){
              localStorage.removeItem("__amplify__userid");
              FlowRouter.go("/signin");
            }
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
  },
  'click .logout':function(){
    localStorage.removeItem("__amplify__userid");
    FlowRouter.go("/signin")
  }
});

Template.CreateLayout.events({
  'change #fileInput':function(event){

    $.getScript("/path/to/cropper.js")
    .done(function (script,textStatus){
    console.log(textStatus);

    var file = document.getElementById("fileInput").files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    var canvas;
    reader.onload = function(){
    document.getElementById("image").src = reader.result;

    const image = document.getElementById('image');

    var img = new Image();

    var cropper = new Cropper(image, {
    aspectRatio: 16 / 9,
    crop(event) {
    console.log(event.detail.x);
    console.log(event.detail.y);
    console.log(event.detail.width);
    console.log(event.detail.height);
    console.log(event.detail.rotate);
    console.log(event.detail.scaleX);
    console.log(event.detail.scaleY);

    canvas = cropper.getCroppedCanvas();
    },
    preview: '.preview'
    });

   console.log(canvas);

    }
    // const cropper =new Cropper(document.getElementById('image'), {
    //   aspectRatio: 1,
    //   viewMode: 3,
    //   preview: '.preview'
    // });



  })

  },

  'submit .blog-form': function(event){
    event.preventDefault();


    var form_data = new FormData();
    const title= event.target.title.value;
    const desc = $(".ql-editor").html();
    const selectedFile = document.getElementById('fileInput').files[0];
    console.log(document.getElementById("image").src);
    form_data.append("title",event.target.title.value);
    form_data.append("desc",desc);
    form_data.append("image",selectedFile);
    form_data.append("CreatedAt",new Date());
    form_data.append("blogid", 'blog'+ Date.now());
    console.log(form_data);
    if(!title || !desc){
      alert("please fill all");
    }
    else{
      console.log(selectedFile);
      var obj = {
        title:title,
        desc:desc,
        CreatedAt:new Date(),
        blogid:'blog'+ Date.now(),
        image:selectedFile
      }
      // Post._collection.insert(obj);
      axios.post("/post",form_data,{headers:{'Content-Type': 'multipart/form-data'}}).then((res)=>{
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
    console.log(event.target.img.value);
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
  var obj = {
    id:bid
  }
  axios.post("/blog",obj).then((res)=>{
    var blog = res.data;
    console.log(blog);
    Blog._collection.insert({desc:blog.desc,key:blog.key,title:blog.title});
  }).catch(err=>{
    console.log(err);
  });

  $.getScript( "https://cdn.quilljs.com/1.3.7/quill.js")
  .done(function( script, textStatus ) {
    console.log( textStatus );
    var quill1 = new Quill('#editor1', {
      theme: 'snow'
    });
  })
  .fail(function( jqxhr, settings, exception ) {
});

});

Template.EditLayout.onDestroyed(()=>{
   Blog.remove({});
})

Template.EditLayout.helpers({
  blog : function(){
    return Blog.find({}).fetch();
  }
})

Template.DetailLayout.onRendered(()=>{
  var bid = FlowRouter.current().params.blogid;
  var obj = {
    id:bid
  }
  axios.post("/blog",obj).then((res)=>{
    var blog = res.data;
    console.log(blog);
    Blog._collection.insert({desc:blog.desc,key:blog.key,title:blog.title});
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
     console.log(Blog.find({}).fetch());
     return Blog.find({}).fetch();
   }
})

Template.CreateLayout.onRendered(()=>{
 $.getScript("https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.4.1/js/bootstrap.min.js")
 .done(function( script,textStatus){
   console.log(textStatus);
 });

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
// import {Meteor} from 'meteor/meteor';
// // const Posts = new Mongo.Collection(null);
// import {Post} from "../../collections/collection.js";
// import axios from 'axios';
//
// Template.HomeLayout.events({
//   'click #signup': function(event){
//     event.preventDefault();
//     // FlowRouter.go('/signup');
//     BlazeLayout.render("SignupLayout");
//   },
//   'click #signin': function(event){
//     event.preventDefault();
//     // FlowRouter.go('/signin');
//     BlazeLayout.render("SigninLayout");
//   }
// });
//
// Template.SignupLayout.events({
//   'submit .form-signup': function(event){
//     event.preventDefault();
//     const email=event.target.email.value;
//     const password=event.target.password.value;
//     const cpassword=event.target.cpassword.value;
//     if(!email || !password || !cpassword){
//       alert("please fill all");
//     }
//     else if(password!==cpassword){
//       alert("password not matched");
//     }
//     else{
//       const obj = {
//         email:email,
//         password:password,
//         cpassword:cpassword
//       }
//       axios.post("/signup",obj).then((res)=>{
//           if(res.data.message==="user already exists"){
//             alert("user already exists");
//           }else {
//             // change
//             BlazeLayout.render("BlogLayout");
//           }
//       }).catch(err=>{
//         console.log(err);
//       })
//     }
//   },
//   'click #signin-redirect':function(){
//     // FlowRouter.go("/signin");
//     BlazeLayout.render("SigninLayout");
//   }
// });
//
// Template.SigninLayout.events({
//   'submit .form-signin': function(event){
//     event.preventDefault();
//     const email = event.target.email.value;
//     const password = event.target.password.value;
//     if(!email || !password){
//       alert("please fill all");
//     }else{
//       var obj ={
//         email:email,
//         password:password
//       }
//       axios.post("/signin",obj).then((res)=>{
//           if(res.data.message=="user not exists"){
//             alert("user not exists");
//           }
//           else if (res.data.message=="invalid cridintials") {
//             alert("invalid cridintials");
//           }else {
//             alert("signin succes");
//             // change
//             BlazeLayout.render("BlogLayout");
//           }
//       }).catch(err=>{
//         console.log(err);
//       })
//     }
//   },
//   'click #signup-redirect': function(){
//     // FlowRouter.go("/signup");
//     BlazeLayout.render("SignupLayout");
//   }
// });
//
// Template.BlogLayout.events({
//   'submit .blog-form': function(event){
//     event.preventDefault();
//     const title= event.target.title.value;
//     const desc = event.target.desc.value;
//     if(!title || !desc){
//       alert("please fill all");
//     }
//     else{
//       var obj = {
//         title:title,
//         desc:desc,
//         CreatedAt:new Date(),
//         blogid:'blog'+ Date.now()
//       }
//       // Post._collection.insert(obj);
//       axios.post("/post",obj).then((res)=>{
//
//         alert(res.data.message);
//       }).catch(err=>{
//         console.log(err);
//       })
//     }
//   },
//   'click .delete-btn':function(event){
//      var obj = {
//        id:this.blogid
//      }
//      axios.post("/delete-blog",obj).then((res)=>{
//        console.log("in delete");
//        alert(res.data.message)
//      }).catch(err=>{
//        console.log(err);
//      })
//   },
//   'click .edit-btn':function(event){
//     event.preventDefault();
//     BlazeLayout.render('EditLayout',{id: this.blogid,title:this.title,desc:this.desc});
//   }
// });
//
// Template.EditLayout.events({
//   'submit .edit-blog-form':function(event){
//     event.preventDefault();
//     var obj = {
//       id:event.target.id.value,
//       title:event.target.title.value,
//       desc:event.target.desc.value
//     }
//     console.log(obj);
//     axios.post("/edit-blog",obj).then((res)=>{
//       alert(res.data.message);
//       // FlowRouter.go("/blog");
//       BlazeLayout.render("BlogLayout");
//     }).catch(err=>{
//       console.log(err);
//     })
//   }
// })
//
// Template.BlogLayout.helpers({
//   posts:function(){
//     return Post.find({}).fetch();
//   }
// });
//
// Template.BlogLayout.onRendered(()=>{
//   Meteor.subscribe('getPosts');
// })
