import { Meteor } from 'meteor/meteor';
import { webapp } from 'meteor/webapp';


Meteor.startup(() => {
  // code to run on server at startup
  // WebApp.rawConnectHandlers.use(function(req, res, next) {
  //   res.setHeader("Access-Control-Allow-Origin", "*");
  //   return next();
  // });
});
