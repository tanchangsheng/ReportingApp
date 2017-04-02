// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

import {Template} from 'meteor/templating';
import { Session } from 'meteor/session';

import '../html/map.html';


function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 1.3521, lng: 103.8198},
    zoom: 15,
    draggable : true
  });
  var card = document.getElementById('pac-card');
  var pac_input = document.getElementById('pac-input');

  // var types = document.getElementById('type-selector');
  //var strictBounds = document.getElementById('strict-bounds-selector');
  var options = {
    componentRestrictions: {country: 'sg'}
  };

  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);
  var autocomplete;
  (function pacSelectFirst(input) {
    // store the original event binding function
    var _addEventListener = (input.addEventListener) ? input.addEventListener : input.attachEvent;

    function addEventListenerWrapper(type, listener) {
      // Simulate a 'down arrow' keypress on hitting 'return' when no pac suggestion is selected,
      // and then trigger the original listener.
      if (type == "keydown") {
        var orig_listener = listener;
        listener = function(event) {
          var suggestion_selected = $(".pac-item-selected").length > 0;
          if (event.which == 13 && !suggestion_selected) {
            var simulated_downarrow = $.Event("keydown", {
              keyCode: 40,
              which: 40
            });
            orig_listener.apply(input, [simulated_downarrow]);
          }

          orig_listener.apply(input, [event]);
        };
      }

      _addEventListener.apply(input, [type, listener]);
    }

    input.addEventListener = addEventListenerWrapper;
    input.attachEvent = addEventListenerWrapper;

    autocomplete = new google.maps.places.Autocomplete(input, options);

  })(pac_input);

  // Bind the map's bounds (viewport) property to the autocomplete object,
  // so that the autocomplete requests use the current map bounds for the
  // bounds option in the request.
  autocomplete.bindTo('bounds', map);

  var infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);
  var marker = new google.maps.Marker({
    map: map,
    draggable:true,
    anchorPoint: new google.maps.Point(0, -29)
  });
  //get current location and set marker
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map.setCenter(pos);
      Session.set("lat", position.coords.latitude);
      Session.set("lng", position.coords.longitude);
      marker.setPosition(pos);
    }, function() {
      //nothing
    });
  } else {
    // Browser doesn't support Geolocation
  }

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(10);  // Why 17? Because it looks good.
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    //set lat and long
    Session.set("lat", place.geometry.location.lat());
    Session.set("lng", place.geometry.location.lng());
    // Session.set("lat", marker.getPosition.lat());
    // Session.set("lng", marker.getPosition.lng());
    console.log("lat: " +  place.geometry.location.lat() + " lng: " + place.geometry.location.lng());
    // console.log("lat: " +  marker.getPosition.lat() + " lng: " + marker.getPosition.lng());


    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    //infowindowContent.children['place-icon'].src = place.icon;
    infowindowContent.children['place-name'].textContent = place.name;
    infowindowContent.children['place-address'].textContent = address;
    infowindow.open(map, marker);
  });

  // Sets a listener on a radio button to change the filter type on Places
  // Autocomplete.
  // function setupClickListener(id, types) {
  //   var radioButton = document.getElementById(id);
  //   radioButton.addEventListener('click', function() {
  //     autocomplete.setTypes(types);
  //   });
  // }

  // setupClickListener('changetype-all', []);
  // setupClickListener('changetype-address', ['address']);
  // setupClickListener('changetype-establishment', ['establishment']);
  // setupClickListener('changetype-geocode', ['geocode']);

  // document.getElementById('use-strict-bounds')
  // .addEventListener('click', function() {
  //   console.log('Checkbox clicked! New state=' + this.checked);
  //   autocomplete.setOptions({strictBounds: this.checked});
  // });
}

Template.map.onRendered(function(){
  initMap();
  console.log("Init Maps");
});
