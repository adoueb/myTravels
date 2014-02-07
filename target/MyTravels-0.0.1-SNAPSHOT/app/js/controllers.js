'use strict';

/* Controllers */

angular.module('travelApp.controllers', []).
  controller('TravelListCtrl', ['$scope', '$log', '$http', 'Travel', 'Restangular', function($scope, $log, $http, Travel, Restangular) {
	
	  // Initialize map.

	  // Enable the new Google Maps visuals until it gets enabled by default.
	  // See http://googlegeodevelopers.blogspot.ca/2013/05/a-fresh-new-look-for-maps-api-for-all.html
      google.maps.visualRefresh = true;
      
	  $scope.map = {
	    		center: {
	    			latitude: 47,
	    			longitude: -122
	    		},
	    		zoom:2,
	    		markers: []
	  };
	
	  // Call to display map when stops defined.
	  $scope.setMap = function(position, zoom, markers) {
		 $scope.map = {
		    		center: {
		    			latitude: position.coords.latitude,
		    			longitude: position.coords.longitude
		    		},
		    		zoom: (typeof zoom === "undefined") ? 8 : zoom,
		    		markers: markers
	  	  };		  
	  };

	  // Call to display map when stops not defined.
	  $scope.setCurrentMap = function() {
		  /*
		  if(navigator.geolocation) {
			 navigator.geolocation.getCurrentPosition($scope.setMap);
		  } else {
			 $scope.setMap({coords: {latitude:47, longitude:-122}}, 2);  
		  }
		  */
		  $scope.setMap({coords: {latitude:47, longitude:-122}}, 2, []);  
	  };
	  
	  $scope.onMarkerClicked = function (marker) {
	        marker.showWindow = true;
	    };
	    
	  // Set current stop.
	  $scope.setCurrentStop = function(marker) {
	  	$scope.currentStop = marker;
	  };
	    
	  // Update stop.
	  $scope.updateStop = function(stop) {
	    	// PUT /stops
	    	$log.info("update " +  stop.title);
	    	stop.put().then(function(travels) {
	    			alert(travels);
	    		}, function() {
	    			$log.error("There was an error updating");
	    		});
	  };
	 
	// Get travels.
    //$scope.travels = Travel.query();

	  /*
	    $http.get('../travels').
	    success(function(data) {
	    	  $scope.travels = data;
	    	  
	    	    // Selected travel.
	    	    if ($scope.travels.length > 0) {
	    	    	$scope.selectedTravel =  $scope.travels[0];
	    	    } else {
	    	    	$scope.selectedTravel = undefined;
	    	    }

	    }).
	    error(function(data, status, headers, config) {
	    	alert('Error status:  ' + status);
	    	});
	    	*/
	  var travels =  Restangular.all("travels").getList();
	  travels.then(function(travels) {
		  $log.info('travels loaded');
		  $scope.travels = travels;
	  });
	  
	  // Selected travel.
	  travels.then(function(travels) {
	    if (travels.length >= 1) {
	    	$scope.setSelectedTravel(travels[0]);
	    }
	  });
	  
	    /*
	    $http.get('travels/travels.json').success(function(data) {
    	  $scope.travels = data;
    	  
    	    // Selected travel.
    	    if ($scope.travels.length > 0) {
    	    	$scope.selectedTravel =  $scope.travels[0];
    	    } else {
    	    	$scope.selectedTravel = undefined;
    	    }

    	});*/

    
    // Order.
    $scope.orderProp = 'year';
   
    // Set selected travel.
    $scope.setSelectedTravel = function(selectedTravel) {
    	// Set selected travel.
    	$scope.selectedTravel =  selectedTravel;
    	
    	// Set map.
    	if (selectedTravel.itinerary.stops.length >= 1) {
    		// Compute southwest and northest points for all the markers to be displayed.
    		// Iterate through the stops.
    	
    		var bounds = computeBounds(selectedTravel.itinerary.stops);
	    	$scope.map = {
		    		center: {
		    			latitude: selectedTravel.itinerary.stops[0].latitude,
		    			longitude: selectedTravel.itinerary.stops[0].longitude
		    		},
		    		zoom: 9,
		    		markers: selectedTravel.itinerary.stops,
		    		bounds: bounds
		    	};
	    } else {
	    	$scope.setCurrentMap();
	    }
    };
    
    // Compute bounds from stops.
    var computeBounds = function(stops) {
		var southwest_latitude = stops[0].latitude;
		var southwest_longitude = stops[0].longitude;
		var northeast_latitude = stops[0].latitude;
		var northeast_longitude = stops[0].longitude;
		
		for (var stopIndex=0; stopIndex < stops.length; stopIndex++) {
			var currentStop = stops[stopIndex];
			if (currentStop.latitude < southwest_latitude) {
				southwest_latitude = currentStop.latitude;
			}
			if (currentStop.longitude < southwest_longitude) {
				southwest_longitude = currentStop.longitude;
			}
			if (currentStop.latitude > northeast_latitude) {
				northeast_latitude = currentStop.latitude;
			}
			if (currentStop.longitude > northeast_longitude) {
				northeast_longitude = currentStop.longitude;
			}
		}
		southwest_latitude -= 0.01;
		southwest_longitude -= 0.01;
		northeast_latitude += 0.01;
		northeast_longitude += 0.01;
		
		return {
			southwest: {
				latitude: southwest_latitude,
				longitude: southwest_longitude
			},
			northeast: {
			    latitude: northeast_latitude,
			    longitude: northeast_longitude
			}
		};
    }
    
    // Add travel.
    $scope.addTravel = function() {
    	var newTravel = {year:        $scope.newTravel_year, 
    			         country:     $scope.newTravel_country, 
    			         name:        $scope.newTravel_name, 
    			         description: $scope.newTravel_description};

    	// POST /travels
    	$log.info("add " +  newTravel.name);
    	var travels =  Restangular.all("travels");
    	travels.post(newTravel).then(function(travels) {
			  $scope.travels = travels;
		}, function() {
			$log.error("There was an error saving");
    	  });
    };
    
    // Set current travel.
    $scope.setCurrentTravel = function(travel) {
    	$scope.currentTravel = travel;
    };
   
    // Update travel.
    $scope.updateTravel = function(travel) {
    	// PUT /travels
    	$log.info("update " +  travel.name);
    	travel.put().then(function(travels) {
    			$scope.travels = travels;
    		}, function() {
    			$log.error("There was an error updating");
    		});
    };
    
    // Delete travel.
    $scope.deleteTravel = function(travel) {
    	// DELETE /travels
    	$log.info("delete " +  travel.name);
    	travel.remove().then(function(travels) {
			  $scope.travels = travels;
		}, function() {
			$log.error("There was an error deleting");
    	  });
    };
    
    // Send email.
    $scope.sendEmail = function() {
    	var link = "mailto:" + $scope.address
            + "&subject=" + escape($scope.subject)
            + "&body=" + escape($scope.body);

    	window.location.href = link;
    };
}]);