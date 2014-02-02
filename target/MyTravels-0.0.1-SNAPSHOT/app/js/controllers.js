'use strict';

/* Controllers */

angular.module('travelApp.controllers', []).
  controller('TravelListCtrl', ['$scope', '$http', 'Travel', 'Restangular', function($scope, $http, Travel, Restangular) {
	    
	 
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
			  $scope.travels = travels;
			});
	  
	  // Selected travel.
	  travels.then(function(travels) {
	    // returns a list of users
	    $scope.selectedTravel = travels[0];
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
    	$scope.selectedTravel =  selectedTravel;
    };
    
    // Add travel.
    $scope.addTravel = function() {
    	var newTravel = {year:        $scope.newTravel_year, 
    			         country:    $scope.newTravel_country, 
    			         name:        $scope.newTravel_name, 
    			         description: $scope.newTravel_description};

    	// POST /travels
    	var travels =  Restangular.all("travels");
    	travels.post(newTravel).then(function(travels) {
			  $scope.travels = travels;
		}, function() {
    	    console.log("There was an error saving");
    	  });
    };
    
    // Set current travel.
    $scope.setCurrentTravel = function(travel) {
    	$scope.currentTravel = travel;
    };
   
    // Update travel.
    $scope.updateTravel = function(travel) {
    	alert(travel.country);
    };
    
    // Delete travel.
    $scope.deleteTravel = function(travel) {
    	var currentTravel = {year:        $scope.newTravel_year, 
		         country:    $scope.newTravel_country, 
		         name:        $scope.newTravel_name, 
		         description: $scope.newTravel_description};

// POST /travels
var travels =  Restangular.all("travels");
travels.post(newTravel).then(function(travels) {
	  $scope.travels = travels;
}, function() {
   console.log("There was an error saving");
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