$(document).ready(function () {

//initialize map
  var fullstackAcademy = new google.maps.LatLng(40.705086, -74.009151);

  var styleArr = [{
    featureType: 'landscape',
    stylers: [{ saturation: -100 }, { lightness: 60 }]
  }, {
    featureType: 'road.local',
    stylers: [{ saturation: -100 }, { lightness: 40 }, { visibility: 'on' }]
  }, {
    featureType: 'transit',
    stylers: [{ saturation: -100 }, { visibility: 'simplified' }]
  }, {
    featureType: 'administrative.province',
    stylers: [{ visibility: 'off' }]
  }, {
    featureType: 'water',
    stylers: [{ visibility: 'on' }, { lightness: 30 }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ef8c25' }, { lightness: 40 }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ visibility: 'off' }]
  }, {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [{ color: '#b6c54c' }, { lightness: 40 }, { saturation: -40 }]
  }];

  var mapCanvas = document.getElementById('map-canvas');

  var currentMap = new google.maps.Map(mapCanvas, {
    center: fullstackAcademy,
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: styleArr
  });

  var iconURLs = {
    hotel: '/images/lodging_0star.png',
    restaurant: '/images/restaurant.png',
    activity: '/images/star-3.png'
  };

//Create hotel, restaurant, and activity drop-down menus
  for (var i = 0; i < hotels.length; i++){
    $('#hotel-choices').append("<option>" + hotels[i].name + "</option>" );
  }
  for (var j = 0; j < restaurants.length; j++){
    $('#restaurant-choices').append("<option>" + restaurants[j].name + "</option>" );
  }
  for (var k = 0; k < activities.length; k++){
    $('#activity-choices').append("<option>" + activities[k].name + "</option>" );
  }

//initialize array of day objects:
//each day will have these properties: dayNumber(int), myHotels(arr), myRestaurants(arr), myActivities(arr), mapMarkers(arr)
  var itineraryMaster = [];
  var currentDay = 0;
  var totalDays = 0;

  if (currentDay === 0){
    $('#day-title').html("Add days to your trip!");
  }

//Utility function to reset map bounds
function newBounds (markersArray){
  var bounds = new google.maps.LatLngBounds();
  markersArray.forEach(function (marker){
    bounds.extend(marker.position);
  });
  currentMap.fitBounds(bounds);
}

//Add a map marker and push to current day's mapMarker array
  function drawMarker (type, coords, name) {
    var latLng = new google.maps.LatLng(coords[0], coords[1]);
    var iconURL = iconURLs[type];
    var marker = new google.maps.Marker({
      icon: iconURL,
      position: latLng
    });
    marker.setMap(currentMap);
    marker.name = name;
    itineraryMaster[currentDay - 1].mapMarkers = itineraryMaster[currentDay - 1].mapMarkers || [];
    itineraryMaster[currentDay - 1].mapMarkers.push(marker);
    newBounds(itineraryMaster[currentDay - 1].mapMarkers);
  }

//Utility function to clear DOM's map markers and itinerary
function clearDOM (day){
  itineraryMaster[day - 1].mapMarkers.forEach(function (marker){
      marker.setMap(null);
    });
  $('#hotel-list').empty();
  $('#restaurant-list').empty();
  $('#activity-list').empty();
}

//Utility function to re-populate DOM's map markers, itinerary, and day title for a given day
function populateDOM (day){
  $('#day-title').html('<span id="day-number">Day ' + day + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button>');
  itineraryMaster[day - 1].mapMarkers.forEach(function (marker){
    marker.setMap(currentMap);
  });
  itineraryMaster[day - 1].myHotels.forEach(function (hotel){
    var hotelNode = '<span class="title">' + hotel + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button>';
    $('#hotel-list').append(hotelNode);
  });
  itineraryMaster[day - 1].myRestaurants.forEach(function (restaurant){
    var restaurantNode = '<span class="title">' + restaurant + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button>';
    $('#restaurant-list').append(restaurantNode);
  });
  itineraryMaster[day - 1].myActivities.forEach(function (activity){
    var activityNode = '<span class="title">' + activity + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button>';
    $('#activity-list').append(activityNode);
  });
}

//When hotel is selected from options drop-down
//1) add to DOM itinerary
//2) update itineraryMaster's current day's myHotels array
  $('#hotel-button').on('click', function(){
    var selectedHotel = $('#hotel-choices option:selected').text();
    var hotelNode = '<span class="title">' + selectedHotel + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button>';
    $('#hotel-list').append(hotelNode);
    var hotelKeys = Object.keys(hotels);
    var hotelLocation;
    for (var x = 0; x < hotelKeys.length; x++){
      var thisHotelObj = hotels[x];
      if (thisHotelObj.name === selectedHotel){
        var thisPlace = thisHotelObj.place;
        hotelLocation = thisPlace.location;
      }
    }
    drawMarker('hotel', hotelLocation, selectedHotel);
    itineraryMaster[currentDay - 1].myHotels = itineraryMaster[currentDay - 1].myHotels || [];
    itineraryMaster[currentDay - 1].myHotels.push(selectedHotel);
  });

//When restaurant is selected from options drop-down
//1) add to DOM itinerary
//2) update itineraryMaster's current day's myRestaurants array
  $('#restaurant-button').on('click', function(){
    var selectedRestaurant = $('#restaurant-choices option:selected').text();
    var restaurantNode = '<span class="title">' + selectedRestaurant + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button>';
    $('#restaurant-list').append(restaurantNode);
    var restaurantKeys = Object.keys(restaurants);
    var restaurantLocation;
    for (var y = 0; y < restaurantKeys.length; y++){
      var thisRestaurantObj = restaurants[y];
      if (thisRestaurantObj.name === selectedRestaurant){
        var thisRestaurant = thisRestaurantObj.place;
        restaurantLocation = thisRestaurant.location;
      }
    }
    drawMarker('restaurant', restaurantLocation, selectedRestaurant);
    itineraryMaster[currentDay - 1].myRestaurants = itineraryMaster[currentDay - 1].myRestaurants || [];
    itineraryMaster[currentDay - 1].myRestaurants.push(selectedRestaurant);
  });

//When activity is selected from options drop-down:
//1) add to DOM itinerary
//2) update itineraryMaster's current day's myActivities array
  $('#activity-button').on('click', function(event){
    var selectedActivity = $('#activity-choices option:selected').text();
    var activityNode = '<span class="title">' + selectedActivity + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button>';
    $('#activity-list').append(activityNode);
    var activityKeys = Object.keys(activities);
    var activityLocation;
    for (var z = 0; z < activityKeys.length; z++){
      var thisActivityObj = activities[z];
      if (thisActivityObj.name === selectedActivity){
        var thisActivity = thisActivityObj.place;
        activityLocation = thisActivity.location;
      }
    }
    drawMarker('activity', activityLocation, selectedActivity);
    itineraryMaster[currentDay - 1].myActivities = itineraryMaster[currentDay - 1].myActivities || [];
    itineraryMaster[currentDay - 1].myActivities.push(selectedActivity);
  });

//When a given itinerary item's remove button is clicked:
//1) remove that item from the DOM
//2) remove that item from the itineraryMaster's current day's hotels/restaurants/activities array
//3) remove that item's marker from the itineraryMaster's current day's mapMarkers array
  $('#itinerary').on('click', '.remove', function (event){
    var locationName = $(this).prev().text().trim();
    for (var i = 0; i < itineraryMaster[currentDay - 1].mapMarkers.length; i++){
      var currentMarker = itineraryMaster[currentDay - 1].mapMarkers[i];
      if (currentMarker.name === locationName){
        currentMarker.setMap(null);
        itineraryMaster[currentDay - 1].mapMarkers.splice(i, 1);
        newBounds(itineraryMaster[currentDay - 1].mapMarkers);
      }
    }
    itineraryMaster[currentDay - 1].myHotels.forEach(function (hotel, index){
      if (hotel === locationName){
        itineraryMaster[currentDay - 1].myHotels.splice(index, 1);
      }
    });
    itineraryMaster[currentDay - 1].myRestaurants.forEach(function (restaurant, index){
      if (restaurant === locationName){
        itineraryMaster[currentDay - 1].myRestaurants.splice(index, 1);
      }
    });
    itineraryMaster[currentDay - 1].myActivities.forEach(function (activity, index){
      if (activity === locationName){
        itineraryMaster[currentDay - 1].myActivities.splice(index, 1);
      }
    });
    $(this).prev().remove();
    $(this).remove();
  });

//When the "+" button is clicked:
//1) add a new day button to the DOM of number (current day + 1)
//2) update current day variable to that day. set data-dayNumber.
//3) push a new object to the itineraryMaster array
//4) clear the DOM: remove map markers and current itinerary
  $('#day-add').on('click', function (){
    var priorDay = currentDay;
    totalDays++;
    currentDay = totalDays;
    var toAppend = '<button class="btn btn-circle day-btn day-btn-num" data-dayNumber=' + currentDay + '>' + currentDay + '</button>';
    $('.day-buttons').append(toAppend);
    $('#day-title').html('<span id="day-number">Day ' + currentDay + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button>');
    itineraryMaster.push({dayNumber: currentDay, myHotels: [], myRestaurants: [], myActivities: [], mapMarkers: []});
    if (itineraryMaster.length > 1){
      clearDOM(priorDay);
    }
  });

//When you click day button of day number x:
//1) update current day to selected day's number (get from data-dayNumber)
//2) update day-title to selected day
//3) clear DOM: remove map markers and current itinerary
//4) re-populate DOM with selected day's map markers, itinerary, and title
  $('.day-buttons').on('click', '.day-btn-num', function(){
    var priorDay = currentDay;
    var dayNumber = $(this).data("daynumber");
    currentDay = dayNumber;
    clearDOM(priorDay);
    populateDOM(currentDay);
  });

//When current day removal button is clicked:

//1) if the current day is the last day:
//1a) Delete that object from itineraryMaster array
//1b) Clear DOM: clear map markers, itinerary, and day title
//1c) Load Day 1 info on map, itin, and title OR if the current day was the only day, update day title to:
// $('#day-title').html("Add days to your trip!");
//remove round day button

//2) else:
//2a) Starting with the current day (day x), set itineraryMaster[x] to be itineraryMaster[x+1]
//2b) Delete the last object in itineraryMaster
//2c) Clear DOM: clear map markers, itinerary, and day title
//2d) Load new Day 1 info on map, itin, and title
//remove round day button

  $('#day-title').on('click', '.remove', function (){
    clearDOM(currentDay);
    $('.day-buttons button:last-child').remove();
    totalDays--;
    if (totalDays === 0){
      $('#day-title').html("Add days to your trip!");
      itineraryMaster.splice(currentDay - 1, 1);
      currentDay = 0;
    } else if (currentDay === totalDays){
      populateDOM(1);
      itineraryMaster.splice(currentDay - 1, 1);
      currentDay = 1;
    } else {
      for (var i = currentDay - 1; i < itineraryMaster.length - 1; i++){
        itineraryMaster[i] = itineraryMaster[i + 1];
        itineraryMaster.splice(itineraryMaster.length - 1, 1);
      }
      populateDOM(1);
      currentDay = 1;
    }
  });

});
