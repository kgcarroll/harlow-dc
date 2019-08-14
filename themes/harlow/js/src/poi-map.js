(function() {
  "use strict";

  var bounds = null, // Google maps bounds for fitting all POIs on map
      categories = null, // Categories data from JSON
      categories_container = $("#categories"),
      // ddl_categories = $('#ddl-categories'),
      map_marker = null, // Default map marker info from JSON
      infoWindow = null, // Opened infoWindow
      map = null, // Google maps element
      mobile_category_label = $("#mobile-label"),
      mobile_category_overlay = $("#mobile-category-overlay"),
      property = null, // Property info from JSON
      property_coordinates = null, // Property LatLng
      isMobileWidth = false,
      markersArray = [],
      infowindowsArray = [],
      infoWindow = null,
      marker_cntr = 0;

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

  function checkMobileWidth(){
    isMobileWidth = ($(window).width() <= 768);
  }

  function fit_map_to_bounds(){
    map.fitBounds(bounds); // Fit map to show all visible POIs

    // Zoom out if map has just single POI.
    var listener = google.maps.event.addListener(map, "idle", function() {
      if (map.getZoom() > 18) map.setZoom(18);
      google.maps.event.removeListener(listener);
    });
  }

  function init_categories(){
    for (var i in categories){
      map_marker = categories[i].marker;  // Assign categoty marker(s);
      var category = build_category_elements(categories[i]);
      categories[i].element = category;
      build_category_pois(categories[i]);
      categories_container.append(category);
    }
    fit_map_to_bounds();
  }

  function build_cat_children(cat) {
    var pois = cat.pois,
        child_ul = $(document.createElement("ul"));

    child_ul.addClass('children');

    for (var i in pois){
      var cat_child_li = $(document.createElement("li")),
          cat_child_span = $(document.createElement("span"));

      cat_child_li.attr('id','marker'+ marker_cntr);
      cat_child_li.addClass('poi');

      // infoBoxArray[marker_cntr] = infoBoxContent;

      cat_child_span.html(pois[i].name);
      cat_child_li.append(cat_child_span);
      child_ul.append(cat_child_li);

      cat_child_li.on({
          click:function(e){
            e.stopPropagation();

            var id = $(this).attr('id'),
                marker_key = id.replace(/marker/,'');
            marker_key = parseInt(marker_key);

            var current_marker = markersArray[marker_key];
            
            closeInfowindows();
            infowindowsArray[marker_key].open(map, current_marker);
          }
      });

      marker_cntr++;
    }
    return child_ul;
  }


  function build_category_elements(cat){
    //ul li for desktop
    var cat_li = $(document.createElement("li")),
        cat_span = $(document.createElement("span"));

    cat_span.addClass('ease');
    cat_li.addClass('parent');
    cat_span.html(cat.name);
    cat_li.append(cat_span);

    cat_li.append(build_cat_children(cat));

    cat_li.on({
        click:function(){
          if(cat_li.hasClass('active')) {
            cat_li.removeClass('active');
          } else {
            show_category(cat);
          }
        }
    });


    return cat_li;
  }

  function build_category_pois(cat){
    for (var i in cat.pois){
      var poi = build_poi(cat.pois[i]);
      bounds.extend(poi.position);
      cat.pois[i].marker = poi;
    }
  }

  function build_poi(poi){
    var marker_icon = null;
    if (map_marker){
      marker_icon = {
        path: 'M256,0C167.641,0,96,71.625,96,160c0,24.75,5.625,48.219,15.672,69.125C112.234,230.313,256,512,256,512l142.594-279.375    C409.719,210.844,416,186.156,416,160C416,71.625,344.375,0,256,0z M256,256c-53.016,0-96-43-96-96s42.984-96,96-96    c53,0,96,43,96,96S309,256,256,256z',
        fillColor: map_marker.color,
        fillOpacity: 1,
        scale: 0.05,
      };
    }

    if (typeof(poi.url) != "undefined" && poi.url != "") {
      var map_link = '<div class="website"><a href="' + poi.url + '" target="_blank">Website</a></div>';
    } else {
      var map_link = '';
    }

    var coordinates = new google.maps.LatLng(poi.lat,poi.lng),
        directions_link = '<div class="directions"><a href="http://maps.google.com/?q=' + poi.address.address+ '" target="_blank">Directions</a></div>',
        description = (poi.description !== "") ? '<div class="description-container">' + poi.description + '</div>' : '',
        cur_info = '<div class="info-window"><div class="name"><strong>' + poi.name + '</strong></div><div class="address">' + poi.address.address + '</div>' + map_link + directions_link + '</div>',
        infowindow = new google.maps.InfoWindow({
          content: cur_info
        }),
        marker = new google.maps.Marker({
            icon: marker_icon,
            infoWindow: infowindow,
            map: map,
            position: coordinates,
            title: poi.name
        });
    google.maps.event.addListener(marker, 'click', function(event) {
      if (infoWindow){
        infoWindow.close();
      }
      marker.infoWindow.open(map, marker);
      infoWindow = marker.infoWindow;
    });


    bounds.extend(marker.position);
    markersArray.push(marker);
    infowindowsArray.push(infowindow);

    return marker;
  }

  function show_category(cat){
    // Reset bounds
    bounds = new google.maps.LatLngBounds(property_coordinates);

    // Loop through categories, hiding all POIs except those in the current category
    for (var i in categories){
      var set_map = (categories[i].name != cat.name) ? null : map, // check if this is the current category, hide all POIs if not, otherwise show POIs
          category_class = (categories[i].name != cat.name) ? '<parent></parent>' : 'parent active'; // set active class for current category
          

      if (typeof categories[i].element != "undefined"){
        categories[i].element.removeClass();
        if (category_class != ''){
          categories[i].element.addClass(category_class);
        }
      }
      for (var j in categories[i].pois){
        if (typeof categories[i].pois[j].marker != "undefined"){
          categories[i].pois[j].marker.setMap(set_map);
          if (set_map){
            bounds.extend(categories[i].pois[j].marker.position);
          }
        }
      }
    }
    fit_map_to_bounds();
  }

  function init_property_marker(){
    if (property){
      property_coordinates = new google.maps.LatLng(property.lat,property.lng);
      var property_icon = {
            url: property.property_map_marker.url,
            size: new google.maps.Size(property.property_map_marker.width,property.property_map_marker.height),
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(62,37)
          },
      map_link = '<a href="http://maps.google.com/?q=' + property.address + ', ' + property.city + ', ' + property.state + ' ' + property.zip + '" target="_blank">Directions</a>',
      property_infowindow = new google.maps.InfoWindow({
        content: '<div class="info-window"><div class="name"><strong>' + property.property_name + '</strong></div><div class="address">' + property.address.replace(", ","<br />") + ',<br />' + property.city + ', ' + property.state + ' ' + property.zip + '</div>' + map_link + '</div>'
      }),
      property_marker = new google.maps.Marker({
        icon: property_icon,
        infoWindow: property_infowindow,
        map: map,
        position: property_coordinates,
        title: property.property_name
      });
      google.maps.event.addListener(property_marker, 'click', function(event) {
        if (infoWindow){
          infoWindow.close();
        }
        property_marker.infoWindow.open(map, property_marker);
        infoWindow = property_marker.infoWindow;
      });
      bounds = new google.maps.LatLngBounds(property_coordinates);
      init_categories();
      return property_marker;
    }
  }

  function init_map(){
    var coordinates = null;
    if (property) {
      coordinates = new google.maps.LatLng(property.lat, property.lng);
    }
    var MY_MAPTYPE_ID = 'custom_style',
        map_style = [
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
              ],
    
    map_options = {
      center: coordinates,
      zoom: 14,
      scrollwheel:false,
      streetViewControl:false,
      zoomControlOptions:{
        style:google.maps.ZoomControlStyle.SMALL,
        position:google.maps.ControlPosition.LEFT_CENTER
      },
      mapTypeId: MY_MAPTYPE_ID,
      draggable: true
    },
    custom_map_type = new google.maps.StyledMapType(map_style, {
      name:MY_MAPTYPE_ID
    });
    map = new google.maps.Map(document.getElementById('map'),map_options);


    google.maps.event.addListener(map, "click", function(event) {
        infoWindow.close();
    });

    
    map.mapTypes.set(MY_MAPTYPE_ID, custom_map_type);
    init_property_marker();
  }

  function init(){
    $.ajax({
      cache:false,
      url:templateURL + "/JSON/neighborhood.json",
      dataType:"json",
      success:function(data){
        categories = data.categories;
        property = data.property;

        
        // Create "All" category from other categories
        // var allCategories = {
        //   name: "All",
        //   pois:[]
        // };
        // Loop through data and get existing category pois, and push them to into "allCategories" array.
        // for (var i=0; i<categories.length; i++){
        //   for (var j=0; j<categories[i].pois.length; j++){
        //     allCategories.pois.push(categories[i].pois[j]);
        //   }
        // }
        // categories.unshift(allCategories);
        // End of "All" categories addition.
      
        init_map();
      }
    });

    mobile_category_label.on("click",function(){
      categories_container.slideToggle();
    });

    if(isMobileWidth) {
      categories_container.css('display', 'block');
    }

  }


  $(document).ready(function(){
    init();
    checkMobileWidth();
  });

  // On Window resize
  $(window).on({
    resize:function(){
      checkMobileWidth();
    }
  })

})();