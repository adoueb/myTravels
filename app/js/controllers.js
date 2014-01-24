'use strict';

/* Controllers */

angular.module('travelApp.controllers', []).
  controller('TravelListCtrl', ['$scope', '$http', 'Travel', function($scope, $http, Travel) {
	    
	 
	// Travel list.
    //$scope.travels = Travel.query();

	    $http.get('http://localhost:8080/myTravels').
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
    
    $scope.setSelectedTravel = function(selectedTravel) {
    	$scope.selectedTravel =  selectedTravel;
    };

}]);