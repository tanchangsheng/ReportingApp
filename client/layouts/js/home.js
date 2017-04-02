import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Reports } from '../../../collections/reports.js';

import '../html/home.html';


Reports.insert({
  createdAt : new Date().toLocaleString()
},
function(err, id){
  Session.set("report_id", id);
  console.log("report_id: " + id + " createdAt: " + new Date().toLocaleString())
}
);


//alert(Session.get("report_id"));



//Sesson.set({"report_id",});
