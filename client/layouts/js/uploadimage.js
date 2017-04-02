import { FilesCollection } from 'meteor/ostrio:files';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Images } from '../../../collections/images.js';
import { Session } from 'meteor/session';

import '../html/home.html'


//Meteor.subscribe('files.images.all');

Template.uploadimage.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
});

Template.uploadimage.helpers({
  currentUpload: function () {
    return Template.instance().currentUpload.get();
  }
});
var image_id;
Template.uploadimage.events({
  'change #fileInput': function (e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // multiple files were selected
      console.log(Session.get("report_id"));
      var upload = Images.insert({
        file: e.currentTarget.files[0],
        streams: 'dynamic',
        chunkSize: 'dynamic'
      }, false);

      upload.on('start', function () {
        template.currentUpload.set(this);
      });

      upload.on('end', function (error, fileObj) {
        if (error) {
          alert('Error during upload: ' + error);
        } else {
          alert('File "' + fileObj.name + '" successfully uploaded');
        }
        var report_id = Session.get("report_id");
        image_id = fileObj._id;
        Session.set("image_id", fileObj._id);
        console.log("image_report_id: " + report_id);
        // Images.remove({report_id : report_id},
        //   function(err,id){
        //     console.log(err || id);
        //     console.log("updated image");
        //   });
        Images.update({
          _id: fileObj._id
        }, {$set:{
          report_id: report_id
        }},
        function(err,id){
          //console.log(err || id);
        });


        template.currentUpload.set(false);
      });

      upload.start();
    }
  }
});

Template.file.helpers({
  image(){

  },
});


if (Meteor.isServer) {
  Meteor.publish('files.Images.all', function () {
    return Images.find().cursor;
  });

} else {
  Meteor.subscribe('files.Images.all');
}

Template.uploadimage.helpers({
  imageFile: function () {
    return Images.find({
      report_id : ""
    });
  }
});
