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
    BlazeLayout.render('BlogLayout');
  }
});

FlowRouter.route('/create',{
  action(){
    BlazeLayout.render('CreateLayout');
  }
});
FlowRouter.route('/edit/:blogid',{
  action(){
    BlazeLayout.render('EditLayout');
  }
});
FlowRouter.route('/detail/:blogid',{
  action(){
    BlazeLayout.render("DetailLayout");
  }
})
