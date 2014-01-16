'use strict';

/* Controllers */

angular.module('travelApp.controllers', []).
  controller('TravelListCtrl', function($scope, $http) {
	  $http.get('travels/travels.json').success(function(data) {
		// Travel list.
	    $scope.travels = data;
	    
	    // Selected travel.
	    if ($scope.travels.length > 0) {
	    	$scope.selectedTravel =  $scope.travels[0];
	    } else {
	    	$scope.selectedTravel = undefined;
	    }
	    
	    // Order.
	    $scope.orderProp = 'year';
	  });
	});
