// Load Flicker Api WIth Specify Keyword And Tag
function loadlocalhostFlickrAPIScript(){
  keyword = "";
  tags = "House,Rent,Brisbane";
  url = "/Flickr/" + tags ;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      flicktest = JSON.parse(xmlhttp.responseText)
      loadflickrcallback(flicktest);
    }
  }
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}
// Load Flicker Api WIth Passing Keyword And Tag Parameter
function loadflickrapifloorplan(keyword , tags) {
  parameterflicker =  tags + ',,' + keyword;
  url = "/Flickr/" + parameterflicker;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      flickrfloorplan = JSON.parse(xmlhttp.responseText)
      loadflickrcallback(flickrfloorplan);
    }
  }
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}


first = 1;
// Predefine Flickr Call Back Function.
function loadflickrcallback(rsp) {
  HousesOtherPhotos = "";
  FlickrData = rsp;
  for (i = 0 ; i < rsp.photos.photo.length ; i++) {
    photo = rsp.photos.photo[i];
    ptitle = photo.title
    thumbnail = "http://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_m.jpg";
    picture = "http://www.flickr.com/photos/" + photo.owner + "/" + photo.id;
    url = '<a href="' + picture + '"><img alt="' + photo.title + '" src="' + thumbnail + '"/></a>';
    searchingtitle = photo.title;
    specifyPhoto = url ;
    HousesOtherPhotos += url;
    HouseDecp = photo.description._content;
    
    //Run the house Searcher Function on for 1 times.
    if(first == 1){
      HousesOtherPhotos = "" ;
      geocodeAddress(geocoder, map , specifyPhoto , photo , thumbnail );
    }
  }
  first = 0;
}

// @param keyword , latitude, longitude
// Run Foursquare Function With seraching keyword,lat and lon in that area
function loadFourSquareAPI(keyword , latitude ,longitude ) {
  var xmlhttp = new XMLHttpRequest();
  parameterfoursquare = keyword + "," + latitude + "," + longitude;
  var url = "/Foursquare/" + parameterfoursquare;
  testingurl = url;
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var myArr = JSON.parse(xmlhttp.responseText);
      getFourSquareRespond(myArr);
    }
  }

  xmlhttp.open("GET", url, true);
  xmlhttp.send();

  function getFourSquareRespond(frsp) {
    try {
    FoursquarePlaceId = frsp.response.venues[0].id;
    loadFourSquareApiByID(FoursquarePlaceId);
    } catch (error){
      FoursquarePlaceId = "";
    }
  }
}
// @param id 
// Search for The Specify Place ID on Foursquare
var FoursquareIdData;
function loadFourSquareApiByID(id){
  var xmlhttp = new XMLHttpRequest();
  var url = "/FoursquareID/" + id;
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var FoursquareIDParse = JSON.parse(xmlhttp.responseText);
        getFourSquareResondID(FoursquareIDParse);
    }
  }

  xmlhttp.open("GET", url, true);
  xmlhttp.send();

  function getFourSquareResondID(fidrsp) {
    FourSquarePhotoURL = "";
    FoursquareIdData = fidrsp;
    FourSquarePlaceName = FoursquareIdData.response.venue.name;
    try{
      FourSquarePhoto = FoursquareIdData.response.venue.bestPhoto.prefix + "400x300" + FoursquareIdData.response.venue.bestPhoto.suffix;
      FourSquarePhotoURL = '<a href="#"><img alt="' + "" + '" src="' + FourSquarePhoto + '"/></a>';
      FourSquareURL = '<a href="' + FoursquareIdData.response.venue.canonicalUrl + '">View From Foursquare</a>';
    } catch (error) {
      FourSquarePhotoURL = "";
      }
      try{
      FourSquareHoursIsOpen = FoursquareIdData.response.venue.hours.isOpen;
      FourSquareHoursIsOpenStatus = FoursquareIdData.response.venue.hours.status;
    } catch (error){
      FourSquareHoursIsOpen = "";
      FourSquareHoursIsOpenStatus = "";
    }
    FourSquareCheckInCount = FoursquareIdData.response.venue.stats.checkinsCount;
    FourSquareRating = FoursquareIdData.response.venue.rating;

    if (!checkdata(FourSquareRating)) {
      FourSquareRating = "This Place Have No Rating Yet";
    }
    if (checkdata(FourSquarePhotoURL)){
    FoursquareInfoContent = FourSquarePhotoURL + "<br><b>" + FourSquarePlaceName + "</b><br>" + FourSquareURL;
      
    if(checkdata(FourSquareCheckInCount)){
      FoursquareInfoContent = FourSquarePhotoURL + "<br><b>" + FourSquarePlaceName + "</b>"
        + "<br>Check In Counts: " + FourSquareCheckInCount
        + "<br>Rating: " + FourSquareRating + "<br>" + FourSquareURL;

      if(checkdata(FourSquareHoursIsOpenStatus)){
        FoursquareInfoContent = FourSquarePhotoURL + "<br><b>" + FourSquarePlaceName + "</b>"
        + "<br>Status: " + FourSquareHoursIsOpenStatus
        + "<br>Check In Counts: " + FourSquareCheckInCount
        + "<br>Rating: " + FourSquareRating + "<br>" + FourSquareURL;
        }
      }
    }
  NearbySearchInfoWindow.setContent( FoursquareInfoContent );
  }
}


var FourSquarePhotoURL;
var NearbySearchInfoWindow;
var searchnearbylocation = {lat: -27.5927251, lng: 153.06183389999998};

// Google Map CallBack Function
function initMap() {
   map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -33.8688, lng: 151.2195},
    zoom: 13
  });
  NearbySearchInfoWindow = new google.maps.InfoWindow();
  var infowindow = new google.maps.InfoWindow();
  geocoder = new google.maps.Geocoder();

  // Get CurrentLocation
   if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      infowindow.setPosition(pos);
      infowindow.setContent('Location found.');
      geolat = position.coords.latitude;
      geolng = position.coords.longitude;
      searchnearbylocation = {lat: geolat, lng: geolng};
      geocodeLatLng(geocoder, map, infowindow)
      map.setCenter(pos);

    },function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0){
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker){
      marker.setMap(null);
    });
    markers = [];


    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      Mapmarker = new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location,
        placelat: place.geometry.location.G,
        placelng: place.geometry.location.K
      });


      google.maps.event.addListener(Mapmarker, 'click', function() {
        FoursquareInfoContent = "<b>" + place.name + "<br>" ;
        NearbySearchInfoWindow.setContent(FoursquareInfoContent);
        loadFourSquareAPI(place.name, Mapmarker.placelat , Mapmarker.placelng);
        NearbySearchInfoWindow.open(map, this);
      });

      markers.push(Mapmarker);

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
          } else {
          bounds.extend(place.geometry.location);
        }
      });
    map.fitBounds(bounds);
  });
}

// Function For Searching Nearby When Click On the House Marker
NearbyPlaceMarkers_array = [];
function SearchNearByPlace(NearBySearchLocation , NearbySearchType){
  deleteMarkers();
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: NearBySearchLocation,
    radius: 500,
    types: [NearbySearchType]
  }, callback);
}

// @param Search Result,Status,
// Return Pass the Search Result And Call Create Marker Function.
function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}
// @param place Object
// Generate Marker For Nearby Places
function createMarker(place) {
  FoursquareInfoContent = null;
  maptesting = place;
  var placeLoc = place.geometry.location;
  var image = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
  };
  var markerSize = new google.maps.Size(24, 24);
  var NearbyPlacemarker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    placelat: place.geometry.location.G,
    placelng: place.geometry.location.K,
    icon: image
  });

  NearbyPlaceMarkers_array.push(NearbyPlacemarker);

  google.maps.event.addListener(NearbyPlacemarker, 'click', function() {
    FoursquareInfoContent = "<b>" + place.name + "<br>" ;
    NearbySearchInfoWindow.setContent( FoursquareInfoContent );
    loadFourSquareAPI(place.name, NearbyPlacemarker.placelat , NearbyPlacemarker.placelng);
    NearbySearchInfoWindow.open(map, this);
  });
}

// Set all place Nearby Search Marker To The Map
// @param map
function setMapOnAll(map) {
  for (var i = 0; i < NearbyPlaceMarkers_array.length; i++) {
    NearbyPlaceMarkers_array[i].setMap(map);
  }
}

// Hide All NearbySearchMarker
function clearMarkers() {
  setMapOnAll(null);
}

// Delete All NearbySearchMarker
function deleteMarkers() {
  clearMarkers();
  NearbyPlaceMarkers_array = [];
}
// Check data That Not Undefine
function checkdata(data){
  if ( data == null || data == NaN &&  data == undefined || data == "" ){
      return false
  }
  else {
      return true
  }
}

// HandelingError
// @param keyword , infowindow , position  
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}

/**
* @param Get Currurent Location From Googlemap 
* Function To Trace Location By Latitude, Longtidute
* @Reture Place Name
*/  
function geocodeLatLng(geocoder, map, infowindow) {
  input = geolat + "," + geolng;
  latlngStr = input.split(',', 2);
  latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      testing = results;
      if (results[1]) {
        map.setZoom(17);
        var image = 'images/blue.png';
        var beachMarker = new google.maps.Marker({
          position: latlng,
          map: map,
          icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10
          },
        });
        infowindow.setContent("<b>YOur Location Is<br>" + results[1].formatted_address);
        infowindow.open(map, beachMarker);
      }
    }   
  });
}

// @param flicker with all flicker data
// Function process Flicker Result 
// Used photo title and search for the House address 
function geocodeAddress(geocoder, resultsMap , housephoto , dataobject , housephotoThumbnail ) {
  FlickrMarkerArray = [];
  HouseIndex = 0;
  var address = searchingtitle;
  var placesList = document.getElementById('places');
  geocoder.geocode({'address': address}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
      var image = '/blue.png';
      var PlaceReturnmarker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location,
        HouseAddress:results[0].formatted_address,
        HouseMainPhoto: housephoto,
        ResultPanelURL: '<a href="#map"onclick="ResultPanalClick(' + HouseIndex + ')"><img src="' + housephotoThumbnail + '"/></a>',
        PlaceIndexs: HouseIndex++,
        MarkerPlaceName : dataobject.title,
        HouseDesc: dataobject.description._content,
        icon: image,
        HouseFloorPlanPhotos: ""
      });
      FlickrMarkerArray.push( PlaceReturnmarker );
      placesList.innerHTML += '<li>' + PlaceReturnmarker.ResultPanelURL 
      + "<br><b>"+ PlaceReturnmarker.HouseAddress 
      + '</li>';

      RentPlaceinfowindow = new google.maps.InfoWindow({
        content: "" 
      });

      PlaceReturnmarker.addListener('click', function() {
        loadflickrapifloorplan( PlaceReturnmarker.MarkerPlaceName , "Brisbane,Rent,House,FloorPlan");
        map.setCenter( PlaceReturnmarker.position );
        map.setZoom( 17 );

        SearchNearByPlace ( PlaceReturnmarker.position , "bus_station" );
        SearchNearByPlace ( PlaceReturnmarker.position , "train_station" );
        SearchNearByPlace ( PlaceReturnmarker.position , "cafe" );
        SearchNearByPlace ( PlaceReturnmarker.position , "food" );
        SearchNearByPlace ( PlaceReturnmarker.position , "gym" );
        SearchNearByPlace ( PlaceReturnmarker.position , "university" );
        SearchNearByPlace ( PlaceReturnmarker.position , "shopping_mall" );

        window.setTimeout(function() {
          infocontent = PlaceReturnmarker.HouseMainPhoto + "<br><b>"
            + PlaceReturnmarker.HouseAddress + "</b><br>" 
            + PlaceReturnmarker.HouseDesc;
          PlaceReturnmarker.HouseFloorPlanPhotos = HousesOtherPhotos;
            if (checkdata(PlaceReturnmarker.HouseFloorPlanPhotos)){
              infocontent = PlaceReturnmarker.HouseMainPhoto + "<br><b>"
              + PlaceReturnmarker.HouseAddress + "<br>" 
              + PlaceReturnmarker.HouseFloorPlanPhotos + "</b><br>" 
              + PlaceReturnmarker.HouseDesc ;
            }
        RentPlaceinfowindow.setContent( infocontent );
        RentPlaceinfowindow.open(map, PlaceReturnmarker);
        }, 500 );
      });
    } 
  });
}

// Event Lisener For The Result Plan
// While Click On the photo On THis To Call This Function
function ResultPanalClick(Resultsindex){
  loadflickrapifloorplan( FlickrMarkerArray[Resultsindex].MarkerPlaceName , "Brisbane,Rent,House,FloorPlan");
  map.setCenter(FlickrMarkerArray[Resultsindex].position);
  map.setZoom(17);
  
  SearchNearByPlace ( FlickrMarkerArray[Resultsindex].position , "bus_station" );
  SearchNearByPlace ( FlickrMarkerArray[Resultsindex].position , "train_station" );
  SearchNearByPlace ( FlickrMarkerArray[Resultsindex].position , "cafe" );
  SearchNearByPlace ( FlickrMarkerArray[Resultsindex].position , "food" );
  SearchNearByPlace ( FlickrMarkerArray[Resultsindex].position , "gym" );
  SearchNearByPlace ( FlickrMarkerArray[Resultsindex].position , "university" );
  SearchNearByPlace ( FlickrMarkerArray[Resultsindex].position , "shopping_mall" );
  
  window.setTimeout(function() {
    infocontent = FlickrMarkerArray[Resultsindex].HouseMainPhoto + "<br><b>"
    + FlickrMarkerArray[Resultsindex].HouseAddress + "</b><br>" 
    + FlickrMarkerArray[Resultsindex].HouseDesc  ;

    FlickrMarkerArray[Resultsindex].HouseFloorPlanPhotos = HousesOtherPhotos;
    
    if (checkdata(FlickrMarkerArray[Resultsindex].HouseFloorPlanPhotos)){
      infocontent = FlickrMarkerArray[Resultsindex].HouseMainPhoto + "<br><b>"
      + FlickrMarkerArray[Resultsindex].HouseAddress + "<br>" 
      + FlickrMarkerArray[Resultsindex].HouseFloorPlanPhotos + "</b><br>" 
      + FlickrMarkerArray[Resultsindex].HouseDesc ;
    }
    RentPlaceinfowindow.setContent( infocontent );
    RentPlaceinfowindow.open(map, FlickrMarkerArray[Resultsindex]);
  } , 500 );

}  

// Function Handling Error
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}

// Load The Flickr API When Page Finish load
$(window).load(function() {
  loadlocalhostFlickrAPIScript();
});
