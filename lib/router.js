var pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
  {
      _id: "username",
      type: "text",
      displayName: "username",
      required: true,
      minLength: 4,
  },
  pwd
]);

AccountsTemplates.configureRoute('signIn', {
    name: 'login',
    path: '/login',
    template: 'login',
    layoutTemplate: 'layout',
    contentRegion: 'content'
});

AccountsTemplates.configureRoute('signUp', {
    name: 'signup',
    path: '/signup',
    template: 'signup',
    layoutTemplate: 'layout',
    contentRegion: 'content'
});


FlowRouter.route('/login', {
  name: 'login',
  action: function() {
    return BlazeLayout.render('login');
  }
});

FlowRouter.route('/signup’', {
  name: 'signup’',
  action: function() {
    return BlazeLayout.render('signup’');
  }
});

const authenticatedRedirect = function(){
  if ( !Meteor.loggingIn() && !Meteor.userId() ) {
    FlowRouter.go( 'login' );
  }
};

const privateRoutes = FlowRouter.group({
  name: 'authenticated',
  triggersEnter: [ authenticatedRedirect ]
});


privateRoutes.route('/', {
    action: function() {
      BlazeLayout.render("layout",{content: "home"})
    }
});

privateRoutes.route('/player', {
    action: function() {
      BlazeLayout.render("layout",{content: "player"})
    }
});

// Accounts.onLogin(function() {
//   FlowRouter.go('/')
// });