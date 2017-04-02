

// document.getElementById('use-strict-bounds').addEventListener('click', function() {
//   console.log('Checkbox clicked! New state=' + this.checked);
//   autocomplete.setOptions({strictBounds: this.checked});
// });
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Reports } from '../../../collections/reports.js';
import { HTTP } from 'meteor/http';


import '../html/description.html';

Template.description.onRendered(function(){
  //date
  $( function() {
    $( "#datepicker" ).datepicker({
      dateFormat: 'dd/mm/yy'
    });
  } );

  $('#datepicker').datepicker()
  .on("change", function (e) {
    var datePicked = e.target.value;
    Session.set("date", datePicked);
    console.log("Date changed: ", datePicked);
  });


  $( function() {
    $("#timepicker").timepicker({

      timeFormat: 'h:mm p',
      defaultTime: 'now',
      interval: 10,
      dynamic: false,
      dropdown: true,
      scrollbar: true,
      change: function(time) {
        // the input field
        var element = $(this), text;
        // get access to this Timepicker instance
        const timepicker = element.timepicker();
        var timeString = new Date().toLocaleTimeString();
        Session.set("time", timeString);
        console.log("Time changed: " + timeString);
      }
    });
  } );

  //var input = document.getElementById('input-description');
  //console.log(input.oninput.val());
  var input;
  $("#input-description").bind('input', function() {
    input = $(this).val();
    Session.set("input-description", input);
  });


});

Template.description.events({
  'click .submit'(event, instance) {

    //set status as NA
    var report_id = Session.get("report_id");
    var image_id = Session.get("image_id");
    var lat = Session.get("lat");
    var lng = Session.get("lng");
    var date = Session.get("date");
    var time =  Session.get("time");
    var description =  Session.get("input-description");

    console.log(report_id);
    console.log(image_id);
    console.log(lat);
    console.log(lng);
    console.log(date);
    console.log(time);
    console.log(description);

    //update reports db with all the information
    Reports.update({_id: report_id}, {$set:{
      report_id:report_id,
      image_id: image_id,
      lat: lat,
      lng: lng,
      date: date,
      time: time,
      description: description,
      status: "na"
    }}, function(err, id){
      console.log(err || id);

      if (!err){
        console.log("updated db, before post");
        var report = {
          data :{
            report_id: report_id,
            image_id: image_id,
            lat: lat,
            lng: lng,
            date: date,
            time: time,
            description: description
          },
          headers: {
            'Content-Type': 'application/json'
          }
        };
        //insert post end point
        HTTP.post('http://10.124.12.52:9091', report,
        function(err, id) {
          console.log(err || id);

          alert("Thank you. Our repair crew is on the way!");
          if(!err){
            console.log(err.toString());
            // location.reload();
          }
          location.reload();
        });
      }

    });

    // Like calling HTTP.call( 'POST', 'url', { /* options */ }, function() {} );

  },
});
