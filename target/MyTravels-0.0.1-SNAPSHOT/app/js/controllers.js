/* Strict Mode is a new feature in ECMAScript 5 that allows you to place
 * a program, or a function, in a "strict" operating context. This strict 
 * context prevents certain actions from being taken and throws more exceptions.
 */
'use strict';

/* Controllers */

angular.module('travelApp.controllers', [])
 
// ------------------------------------------------------------------------
// TravelListCtrl controller
// ------------------------------------------------------------------------
.controller('TravelListCtrl', 
            ['$scope', '$log', '$http', 'TravelRest', 
		    function($scope, $log, $http, TravelRest) {
	
    // --------------------------------------------------------------------
    // Initializations.
    // --------------------------------------------------------------------
    $scope.showAddTravelError = false;
    $scope.showUpdateTravelError = false;
    $scope.showDeleteTravelError = false;
    $scope.showEditStopError = false;
 
    // Order of travels.
    $scope.orderProp = 'year';

    // Retrieve list of travels from the server.
    /*
    Restangular.all("travels").getList()
	   .then(function(travels) {
		  // List of travels.
	      $log.info('travels loaded');
		  $scope.travels = travels;
	  
		  // Selected travel.
	      if (travels.length >= 1) {
	          $scope.setSelectedTravel(travels[0]);
	      }
    });
    */
    TravelRest.query(function(travels) {
		  // List of travels.
	      $log.info('travels loaded');
		  $scope.travels = travels;
	  
		  // Selected travel.
	      if (travels.length >= 1) {
	          $scope.setSelectedTravel(travels[0]);
	      }
    }, function() {
    	alert('error while loading the travels');
    });   
	  
    // --------------------------------------------------------------------
    // Map initialization.
    // --------------------------------------------------------------------

	// Enable the new Google Maps visuals until it gets enabled by default.
	// See http://googlegeodevelopers.blogspot.ca/2013/05/a-fresh-new-look-for-maps-api-for-all.html
    google.maps.visualRefresh = true;
      
    // Initialize map.
	$scope.map = {
	            center: {
	    		    latitude: 0,
	    			longitude: 0
	    		},
	    		zoom:23,
	    		draggable: true,
	    		streetViewControl: true,
	    		events: {
	    			tilesloaded: function (map) {
	    				$scope.$apply(function () {
	    					$scope.mapInstance = map;			
	    				});
	    			}
	    		}
    };
	
    // --------------------------------------------------------------------
    // Manage map.
    // --------------------------------------------------------------------
	$scope.setMap = function(position, zoom, markers) {
		$scope.map.center =  {
	        latitude: position.coords.latitude,
	        longitude: position.coords.longitude
	    };
		$scope.map.zoom = (typeof zoom === "undefined") ? 8 : zoom;
		$scope.markers = markers;
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
    };
    	    
    // --------------------------------------------------------------------
    // Manage stops.
    // --------------------------------------------------------------------
	// Update stop.
	$scope.updateStop = function(stop) {
        // PUT /stops
	    $log.info("update " +  stop.title);
	    $scope.updateTravel($scope.selectedTravel);
	    // TODO: different error
	    $('#updateStop').modal('hide');
    };
	 
    // Set selected travel.
    $scope.setSelectedTravel = function(selectedTravel) {
        // Set selected travel.
    	$scope.selectedTravel =  selectedTravel;
    	
    	// Set map.
    	if (selectedTravel.itinerary.stops.length >= 1) {
    	    // Compute southwest and northeast points for all the markers to be displayed.
    		// Iterate through the stops.
    	
    		var bounds = computeBounds(selectedTravel.itinerary.stops);
    		$scope.map.center = {
	    	    latitude: selectedTravel.itinerary.stops[0].latitude,
	    		longitude: selectedTravel.itinerary.stops[0].longitude
	    	};
    		$scope.map.zoom = 9;
    		$scope.map.markers = selectedTravel.itinerary.stops;
    		$scope.map.bounds = bounds;
	    } else {
	    	$scope.setCurrentMap();
	    }
    	
    	// Stops: set icon.
    	for (var stopIndex=0; stopIndex < $scope.selectedTravel.itinerary.stops.length; stopIndex++) {
		    var currentStop = $scope.selectedTravel.itinerary.stops[stopIndex];
			currentStop.icon = "img/blue_Marker" + String.fromCharCode(65 + stopIndex) + ".png";
			currentStop.draggable = true;
    	}
    };

    // Set edit stop.
	$scope.setEditStop = function(marker) {
		$scope.showEditStopError = false;
	    $scope.setCurrentStop(marker);
	};

    // Set current stop.
	$scope.setCurrentStop = function(marker) {
	    $scope.currentStop = marker;
	};
    
    // --------------------------------------------------------------------
    // Manage CRUD operations on travels.
    // --------------------------------------------------------------------
    // Create travel.
    $scope.addTravel = function() {
        var newTravel = {year:        $scope.newTravel_year, 
    			         country:     $scope.newTravel_country, 
    			         name:        $scope.newTravel_name, 
    			         description: $scope.newTravel_description};

	    // POST /travels
	    $log.info("add " +  newTravel.name);
	    /*
	    Restangular.all("travels").post(newTravel).then(function(travels) {
	    	    Restangular.all("travels").getList().then(function(travels) {
	    	        // List of travels.
	 	            $scope.travels = travels;
	    		});
	            $('#addTravel').modal('hide');
	        }, function() {
		        $log.error("There was an error saving");
		        $scope.showAddTravelError = true;
	    });
	    */
	    TravelRest.save(newTravel, function(travel) {
	 	        $scope.travels.push(travel);
	            $('#addTravel').modal('hide');
	        }, function() {
		        $log.error("There was an error saving");
		        $scope.showAddTravelError = true;
	    });
    };
    
    // Update travel.
    $scope.updateTravel = function(travel) {
        // PUT /travels
    	$log.info("update " +  travel.name);
    	/*
    	travel.put().then(function(travels) {
    		    Restangular.all("travels").getList().then(function(travels) {
    	            // List of travels.
 	                $scope.travels = travels;
    		    });
    		    $('#updateTravel').modal('hide');
    	    }, function() {
    			$log.error("There was an error updating");
		        $scope.showUpdateTravelError = true;
		        $scope.showEditStopError = true;
    	});
    	*/
    	TravelRest.update(travel, function(travel) {
    	        // Update list of travels.
    			for (var travelIndex = 0; travelIndex < $scope.travels.length; travelIndex++) {
    				if ($scope.travels[travelIndex].id == travel.id) {
    					$scope.travels[travelIndex] = travel;
    					break;
    				}
    			}
 	            $('#updateTravel').modal('hide');
    	    }, function() {
    			$log.error("There was an error updating");
		        $scope.showUpdateTravelError = true;
		        $scope.showEditStopError = true;
    	});
    };
    
    // Delete travel.
    $scope.deleteTravel = function(travel) {
        // DELETE /travels
    	$log.info("delete " +  travel.name);
    	/*
    	travel.remove().then(function(travels) {
    		    Restangular.all("travels").getList().then(function(travels) {
    	            // List of travels.
 	                $scope.travels = travels;
    		    });
		        $('#removeTravel').modal('hide');
		    }, function() {
			    $log.error("There was an error deleting");
		        $scope.showDeleteTravelError = true;
    	});
    	*/
    	TravelRest.remove(travel, function(travels) {
 	        $scope.travels = travels;
 	       $('#removeTravel').modal('hide');
        }, function() {
        	$log.error("There was an error deleting");
	        $scope.showDeleteTravelError = true;
        });
    };

    // Set add travel.
    $scope.setAddTravel = function() {
        $scope.showAddTravelError = false;
    };

    // Set update travel.
    $scope.setUpdateTravel = function(travel) {
        $scope.showUpdateTravelError = false;
    	$scope.setCurrentTravel(travel);
    };

    // Set remove travel.
    $scope.setRemoveTravel = function(travel) {
        $scope.showDeleteTravelError = false;
    	$scope.setCurrentTravel(travel);
    };

    // Set current travel.
    $scope.setCurrentTravel = function(travel) {
        $scope.currentTravel = travel;
    };
    
    // --------------------------------------------------------------------
    // General actions of navigation bar.
    // --------------------------------------------------------------------
    // Send email.
    $scope.sendEmail = function() {
    	var link = "mailto:" + $scope.address
                 + "&subject=" + escape($scope.subject)
                 + "&body=" + escape($scope.body);

    	window.location.href = link;
    };
}]);