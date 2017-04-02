FlowRouter.route('/', {
  action(){
    BlazeLayout.render('home', {report : 'report'});
  }
});
