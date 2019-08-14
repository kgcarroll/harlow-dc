var ia_map = null;

var markersArray = [];
var infowindowsArray = [];
var featuredCount=0;

//create empty LatLngBounds object
var bounds = new google.maps.LatLngBounds();

// Shows any overlays currently in the array
function showOverlays() {
  if (markersArray) {
    for (i in markersArray) {
      markersArray[i].setMap(ia_map);
    }
  }
}

// Clears any overlays currently in the array
function clearOverlays() {
  if (markersArray) {
    for (var i = 0; i < markersArray.length; i++ ) {
      markersArray[i].setMap(null);
    }
  }
}

// Closes any infowindows currently in the Array
function closeInfowindows() {
  if (infowindowsArray) {
    for (var i = 0; i < infowindowsArray.length; i++ ) {
      infowindowsArray[i].close();
    }
  }
}


// Build a Map.
function initialize_map(){
  var MY_MAPTYPE_ID = 'custom_style';
  var mapOptions = { scrollwheel:false, panControl:true, panControlOptions:{ position:google.maps.ControlPosition.LEFT_BOTTOM }, streetViewControl:false, zoomControlOptions:{ style:google.maps.ZoomControlStyle.SMALL, position:google.maps.ControlPosition.LEFT_CENTER }, mapTypeId: MY_MAPTYPE_ID, draggable:true };
  ia_map = new google.maps.Map(document.getElementById('map'),mapOptions);
  var featureOpts = [
                  {
                      "featureType": "administrative",
                      "elementType": "labels.text.fill",
                      "stylers": [
                          {
                              "color": "#005362"
                          }
                      ]
                  },
                  {
                      "featureType": "administrative.province",
                      "elementType": "geometry",
                      "stylers": [
                          {
                              "saturation": "7"
                          }
                      ]
                  },
                  {
                      "featureType": "administrative.province",
                      "elementType": "geometry.fill",
                      "stylers": [
                          {
                              "visibility": "on"
                          },
                          {
                              "saturation": "17"
                          },
                          {
                              "lightness": "20"
                          }
                      ]
                  },
                  {
                      "featureType": "landscape",
                      "elementType": "all",
                      "stylers": [
                          {
                              "color": "#f2f2f2"
                          }
                      ]
                  },
                  {
                      "featureType": "landscape.man_made",
                      "elementType": "geometry.fill",
                      "stylers": [
                          {
                              "color": "#dbe7e6"
                          }
                      ]
                  },
                  {
                      "featureType": "poi",
                      "elementType": "all",
                      "stylers": [
                          {
                              "visibility": "off"
                          }
                      ]
                  },
                  {
                      "featureType": "poi.park",
                      "elementType": "geometry.fill",
                      "stylers": [
                          {
                              "visibility": "on"
                          },
                          {
                              "color": "#8fbaa7"
                          }
                      ]
                  },
                  {
                      "featureType": "poi.park",
                      "elementType": "labels.text",
                      "stylers": [
                          {
                              "visibility": "on"
                          }
                      ]
                  },
                  {
                      "featureType": "road",
                      "elementType": "all",
                      "stylers": [
                          {
                              "saturation": -100
                          },
                          {
                              "lightness": 45
                          }
                      ]
                  },
                  {
                      "featureType": "road.highway",
                      "elementType": "all",
                      "stylers": [
                          {
                              "visibility": "simplified"
                          }
                      ]
                  },
                  {
                      "featureType": "road.highway",
                      "elementType": "geometry.fill",
                      "stylers": [
                          {
                              "color": "#96989b"
                          }
                      ]
                  },
                  {
                      "featureType": "road.highway",
                      "elementType": "geometry.stroke",
                      "stylers": [
                          {
                              "color": "#32879c"
                          }
                      ]
                  },
                  {
                      "featureType": "road.highway",
                      "elementType": "labels.text.fill",
                      "stylers": [
                          {
                              "invert_lightness": true
                          }
                      ]
                  },
                  {
                      "featureType": "road.highway",
                      "elementType": "labels.text.stroke",
                      "stylers": [
                          {
                              "color": "#ffffff"
                          },
                          {
                              "visibility": "off"
                          },
                          {
                              "weight": "0.57"
                          }
                      ]
                  },
                  {
                      "featureType": "road.arterial",
                      "elementType": "labels.icon",
                      "stylers": [
                          {
                              "visibility": "off"
                          }
                      ]
                  },
                  {
                      "featureType": "transit",
                      "elementType": "all",
                      "stylers": [
                          {
                              "visibility": "on"
                          }
                      ]
                  },
                  {
                      "featureType": "transit.station",
                      "elementType": "labels.text",
                      "stylers": [
                          {
                              "saturation": "-74"
                          }
                      ]
                  },
                  {
                      "featureType": "transit.station",
                      "elementType": "labels.icon",
                      "stylers": [
                          {
                              "saturation": "-74"
                          }
                      ]
                  },
                  {
                      "featureType": "water",
                      "elementType": "all",
                      "stylers": [
                          {
                              "color": "#46bcec"
                          },
                          {
                              "visibility": "on"
                          }
                      ]
                  },
                  {
                      "featureType": "water",
                      "elementType": "geometry.fill",
                      "stylers": [
                          {
                              "color": "#32879c"
                          }
                      ]
                  },
                  {
                      "featureType": "water",
                      "elementType": "labels.text.fill",
                      "stylers": [
                          {
                              "color": "#ffffff"
                          }
                      ]
                  },
                  {
                      "featureType": "water",
                      "elementType": "labels.text.stroke",
                      "stylers": [
                          {
                              "visibility": "off"
                          }
                      ]
                  }
              ];
  var styledMapOptions = { name: MY_MAPTYPE_ID };
  var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);
  ia_map.mapTypes.set(MY_MAPTYPE_ID, customMapType);
  var marker_cntr = 0;

  //create categories container
  var keys=$('#categories');
  keys.find('li').remove();


  //loop through categories
  for(var j=0;j<categories.length;j++) {
    var newCatLI=$(document.createElement('li'));
    var newCatSpan=$(document.createElement('span'));
    newCatSpan.append(categories[j].category_name);
    newCatSpan.addClass('category');
    var newCatUL=$(document.createElement('ul'));
    newCatUL.attr('id','cat'+j);
    newCatSpan.click(function(){

      //create empty LatLngBounds object
      var bounds = new google.maps.LatLngBounds();

      //close any open info windows
      closeInfowindows();

      //hide other markers
      clearOverlays();

      //remove active class from other li
      $(this).parent('li').siblings().removeClass('active');

      //add active class to the category's li
      $(this).parent('li').addClass('active');

      //loop through markers to display those from this category
      $(this).parent('li').children('ul').children('li').each(function() {
        var marker = $(this).attr('id').replace(/marker/,'');
        markersArray[marker].setVisible(true);
        markersArray[marker].setMap(ia_map);;

        //extend the bounds to include each marker's position
        bounds.extend(markersArray[marker].position);
      });

      //add property marker to bounds
      bounds.extend(propertyMarker.position);

      //show property marker
      propertyMarker.setVisible(true);
      propertyMarker.setMap(ia_map);

      //now fit the map to the newly inclusive bounds
      ia_map.fitBounds(bounds);
    });

    newCatLI.append(newCatSpan);
    newCatLI.append(newCatUL);
    //loop through category pois
    var pois=categories[j].pois;
    for(var k=0; k<pois.length;k++){

        //check if lat and lng are actual coordinates
        var coordinates = new google.maps.LatLng(pois[k].latitude,pois[k].longitude);
        if (typeof categories[j].category_map_marker != 'undefined') {
          var marker_icon=categories[j].category_map_marker;
        }
        if (typeof marker_icon != 'undefined'){
          var overlay_icon = {
            url: marker_icon.url,
            size: new google.maps.Size(marker_icon.width, marker_icon.height),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point((marker_icon.width / 2), (-93))
          };
          marker = new google.maps.Marker({
            position: coordinates,
            title: pois[k].name,
            visible:true,
            icon:overlay_icon
          });
        }else{
          marker = new google.maps.Marker({
            position: coordinates,
            title: pois[k].name,
            visible:true
          });
        }


        //extend the bounds to include each marker's position
        bounds.extend(marker.position);
        markersArray.push(marker);


      //create infowindow
      var address = pois[k].address+', '+pois[k].city+', '+pois[k].state+' '+pois[k].zip;
      var address2 = address.replace(/\s/g,'+');
      var map_url = 'http://maps.google.com/maps?key=AIzaSyBLGDbL7PkNbZLKg2BRtIb6anAkSnl0Y_Y&q='+address2+'&hl=en&z=16';
      var map_link = '<a href="'+map_url+'" target="_blank">Directions</a>';
      if (address.split(',').length > 2){
        address=address.replace(', ','<br>');
      }
      var cur_info = '<div class="info-window"><strong>'+pois[k].name+'</strong><br>'+address+'<br>'+map_link+'</div>';
      var infowindow = new google.maps.InfoWindow({
        content: cur_info
      });
      infowindowsArray.push(infowindow);


      //add click event to display infowindow
      var cur_marker = marker_cntr;
      google.maps.event.addListener(markersArray[cur_marker], 'click', function(event) {
        var current_marker = this;
        var marker_key = false;
        for(l=0;l<markersArray.length;l++){
          if(markersArray[l].title == current_marker.title){
            var marker_key = l;
            break;
          }
        }
        closeInfowindows();
        if(marker_key !== false){
          infowindowsArray[marker_key].open(ia_map,current_marker);
        }
      });


      //create li to add to categories list
      var newLI = $(document.createElement('li'));
      newLI.attr('id','marker'+ marker_cntr);
      newLI.addClass('poi');

      newLI.on({
        click: function() {
          var id = $(this).attr('id');
          var marker_key = id.replace(/marker/,'');
          //marker key is getting set to 1 too high so we subtract 1 to get the correct number
          //current marker still needs the original number so we add the 1 back in
          marker_key = parseInt(marker_key);
          // console.log(marker_key);
          var current_marker = markersArray[marker_key];
          // console.log(current_marker.title);
          // console.log(infowindowsArray[marker_key]);


          closeInfowindows();
          infowindowsArray[marker_key].open(ia_map,current_marker);
        }
      })

      newLI.append(pois[k].name);
      newCatUL.append(newLI);
      marker_cntr++;
    } // end poi for loop
    keys.append(newCatLI);
  } // end category for loop



  //add property marker
  if (typeof propertyObj !== 'undefined'){
    var coordinates = new google.maps.LatLng(propertyObj.latitude,propertyObj.longitude);
    if (typeof propertyObj.property_map_marker != 'undefined'){
      var property_icon=propertyObj.property_map_marker;
      var overlay_icon = {
        url: property_icon.url,
        size: new google.maps.Size(property_icon.width,property_icon.height),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point((property_icon.width/2),(property_icon.height/2))
      };
      marker = new google.maps.Marker({
        position: coordinates,
        title: propertyObj.property_name,
        visible:true,
        icon:overlay_icon
      });
    }else{
      marker = new google.maps.Marker({
        position: coordinates,
        title: propertyObj.property_name,
        visible:true
      });
    }


    //extend the bounds to include each marker's position
    bounds.extend(marker.position);
    markersArray.push(marker);


    //create infowindow
    var currentAddress=propertyObj.address+', '+propertyObj.city+', '+propertyObj.state+' '+propertyObj.zip;
    var map_link = '<a href="http://maps.google.com/?key=AIzaSyBLGDbL7PkNbZLKg2BRtIb6anAkSnl0Y_Y&q='+currentAddress+'" target="_blank">Directions</a>';
    var description = '';
    if (typeof propertyObj.description != "undefined" && propertyObj.description != ''){
      description = '<br>' + propertyObj.description;
    }
    var cur_info = '<div class="info-window"><strong>'+propertyObj.property_name+'</strong><br>'+currentAddress.replace(',','<br />')+description+'<br>'+map_link+'</div>';
    var infowindow = new google.maps.InfoWindow({
      content: cur_info
    });
    infowindowsArray.push(infowindow);


    //add click event to display infowindow
    var cur_marker = marker_cntr;
    google.maps.event.addListener(markersArray[cur_marker], 'click', function(event) {
      var current_marker = this;
      var marker_key = false;
      for(l=0;l<markersArray.length;l++){
        if(markersArray[l].title == current_marker.title){
          var marker_key = l;
          break;
        }
      }
      closeInfowindows();
      if(marker_key !== false){
        infowindowsArray[marker_key].open(ia_map,current_marker);
      }
    });
    var propertyMarker=marker;
  }



  //now fit the map to the newly inclusive bounds
  ia_map.fitBounds(bounds);



  //if map just contains single POI, zoom out
  var listener = google.maps.event.addListener(ia_map, "idle", function() {
    if (ia_map.getZoom() > 14) ia_map.setZoom(14);
    google.maps.event.removeListener(listener);
  });

  //show markers
  showOverlays();
}

function init(){
  $.getJSON(templateURL + "/JSON/enclave_neighborhood.json", function(data) {
    categories=data.categories;
    propertyObj=data.property;  

      console.log('tererte');
    // console.log(data);  // This will display the data in the .json file.  Uncomment to check for troubleshooting help.
    initialize_map();
  });


  // $.ajax({
  //   cache:false,
  //   url:templateURL + "/JSON/neighborhood.json",
  //   dataType:"json",
  //   success:function(data){
  //     categories = data.categories;
  //     property = data.property;

      
  //     // Create "All" category from other categories
  //     // var allCategories = {
  //     //   name: "All",
  //     //   pois:[]
  //     // };
  //     // Loop through data and get existing category pois, and push them to into "allCategories" array.
  //     // for (var i=0; i<categories.length; i++){
  //     //   for (var j=0; j<categories[i].pois.length; j++){
  //     //     allCategories.pois.push(categories[i].pois[j]);
  //     //   }
  //     // }
  //     // categories.unshift(allCategories);
  //     // End of "All" categories addition.
    
  //     initialize_map();
  //     console.log('tererte');
  //   }
  // });

}

$(window).load(function(){
  init();
});