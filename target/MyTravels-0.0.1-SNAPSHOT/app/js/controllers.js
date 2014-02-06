'use strict';

/* Controllers */

angular.module('travelApp.controllers', []).
  controller('TravelListCtrl', ['$scope', '$log', '$http', 'Travel', 'Restangular', function($scope, $log, $http, Travel, Restangular) {
	
	  $scope.map = {
	    		center: {
	    			latitude: 47,
	    			longitude: -122
	    		},
	    		zoom:2 
	  };
	  
	  // Initialize map.
	  $scope.setMap = function(position, zoom) {
		  $log.info('setMap');
		  $log.info('set map data: geolocation');
		  $scope.map = {
		    		center: {
		    			latitude: position.coords.latitude,
		    			longitude: position.coords.longitude
		    		},
		    		zoom: (typeof zoom === "undefined") ? 8 : zoom
	  	  };		  
	  };
	  
	  $scope.setCurrentMap = function() {
		  $log.info('setCurrentMap');
		  if(navigator.geolocation) {
			  $log.info('geoLocation enabled');
			  //navigator.geolocation.getCurrentPosition($scope.setMap);
			  $scope.setMap({coords: {latitude:47, longitude:-122}}, 2);  
		  } else {
			  $log.info('geoLocation denied');
			  $log.info('set map data: default in code');
			  $scope.setMap({coords: {latitude:47, longitude:-122}}, 2);  
		  }
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
	    	$log.info('at least one stop');
	    	$log.info('set map data: itinerary');
		    $scope.map = {
		    		center: {
		    			latitude: selectedTravel.itinerary.stops[0].latitude,
		    			longitude: selectedTravel.itinerary.stops[0].longitude
		    		},
		    		zoom: 8
		    	};
	    } else {
	    	$scope.setCurrentMap();
	    }
    };
    
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