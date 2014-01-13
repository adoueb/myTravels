'use strict';

/* Controllers */

angular.module('travelApp.controllers', []).
  controller('TravelListCtrl', function($scope, $http) {
	  $http.get('travels/travels.json').success(function(data) {
	    $scope.travels = data;
	    if ($scope.travels.length > 0) {
	    	$scope.selectedTravel =  $scope.travels[0];
	    } else {
	    	$scope.selectedTravel = undefined;
	    }
	  });
	});
