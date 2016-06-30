Template.layout.events({
  'click .sign-up': function(e) {
    e.defaultPrevented;
    FlowRouter.go("/signup");
  }
});