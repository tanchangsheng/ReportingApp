import { Mongo } from 'meteor/mongo';

export const Reports = new Mongo.Collection('reports');
/*
Reports.schema = new SimpleSchema({
createdAt: {type: String},
latitude: {type: Number, defaultValue: 0},
longitude: {type: Number, defaultValue: 0},
date: {type : String, defaultValue: ""},
time: {type : String, defaultValue: ""},
description: {type: String, optional: true}
});
*/

// JsonRoutes.setResponseHeaders({
//   "Cache-Control": "no-store",
//   "Pragma": "no-cache",
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
// });

if (Meteor.isServer) {
  Reports.allow({
    insert: function () {
      /* user and doc checks ,
      return true to allow insert */
      return true;
    },
    update: function () {
      /* user and doc checks ,
      return true to allow insert */
      return true;
    }
  });
}


if (Meteor.isServer){
  var Api = new Restivus({
    prettyJson: true
  })

  Api.addCollection(Reports);

  //reading JSON message
  Api.addRoute('updatereport/assigned', {}, {
    post: function(){
      var report_id = this.bodyParams.report_id;
      var crew_id = this.bodyParams.crew_id;
      if (report_id != null || crew_id != null){
        return {success: false, message: "report_id or crew_id is null"}
      }
      Reports.update({_id: report_id}, {$set:{
        crew_id: crew_id,
        status: "a"
      }},
      function(err,id){
        //console.log(err || id);
      });
    }
  });

  Api.addRoute('updatereport/completed', {}, {
    post: function(){
      // var report_id = this.bodyParams.report_id;
      // var repair_endTime = this.bodyParams.repair_endTime;
      var root = this.bodyParams.root;
      var report_id = root["report_id"];
      var repair_endTime = root["repair_endTime"];

      Reports.update({_id: report_id}, {$set:{
        crew_id: crew_id,
        repair_endTime: repair_endTime,
        status: "c"
      }},
      function(err,id){
        //console.log(err || id);
        if(!err){
          return {success: true, message: "successfull updated reporting app"}
        }
      });
    }
  });


  // Api.addRoute('crewList/:id', {}, {
  //   get: function(){
  //     var id = this.urlParams.id;
  //     var crew = crewList.findOne({_id: id})
  //     return crew == null ? {} : crew;
  //   }
  // });

}
// 
// if(Meteor.isServer){
//   WebApp.rawConnectHandlers.use(function(req, res, next) {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     return next();
//   });
// }
