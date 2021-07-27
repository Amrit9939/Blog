
import {Meteor} from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';



FlowRouter.route('/',{
  name: 'home',
  action(){
    BlazeLayout.render('HomeLayout')
  }
});

FlowRouter.route('/signup',{
  name: 'signup',
  action(){
    BlazeLayout.render('SignupLayout')
  }
});

FlowRouter.route('/signin',{
  name: 'signin',
  action(){
    BlazeLayout.render('SigninLayout')
  }
});

FlowRouter.route('/blog',{
  name: 'blog',
  action(){
    if(Session.get("userid") && Session.get("token")){
        BlazeLayout.render("BlogLayout");
    }
    else {
      FlowRouter.go("/signin");
    }
  }
});

FlowRouter.route('/create',{
  action(){
    if(Session.get("userid")&& Session.get("token")){
      BlazeLayout.render('CreateLayout');
    }else {
      BlazeLayout.render('SigninLayout');
    }

  }
});
FlowRouter.route('/edit/:blogid',{
  action(){
    if(Session.get("userid")&& Session.get("token")){
      BlazeLayout.render('EditLayout');
    }
    else {
      BlazeLayout.render('SigninLayout');
    }
  }
});
FlowRouter.route('/detail/:blogid',{
  action(){
    if(Session.get("userid")&& Session.get("token")){
      BlazeLayout.render("DetailLayout");
    }else {
      BlazeLayout.render("SigninLayout");
    }
  }
})
