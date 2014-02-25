'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
  var scope, httpBackend;
  beforeEach(module('travelApp'));
  beforeEach(inject(function ($controller, _$httpBackend_, $rootScope, _Restangular_, _$log_, _Travel_) {
	    httpBackend = _$httpBackend_;
	    httpBackend.expectGET('http://localhost:8080/MyTravels-0.0.1-SNAPSHOT/travels').respond('[]');
	    Restangular = _Restangular_;
	    scope = $rootScope.$new();
	    $log = _$log_;
	    Travel = _Travel_;
	    TravelListCtrl = $controller('TravelListCtrl', {
	    	$scope: scope,
	    	$log: $log,
	        $httpBackend: httpBackend,
	        Travel: Travel,
	        Restangular: Restangular
	      });
	  }));
  afterEach(function () {
	  //httpBackend.verifyNoOutstandingExpectation();
	  //httpBackend.verifyNoOutstandingRequest();
	  });
  
/*
  it('should initialize the map', inject(function ($controller) {
	 /
	  var scope = {},
      ctrl = $controller('TravelListCtrl', {$scope:scope});
	    
	  //verify the initial setup
	    expect($scope.map.center.latitude, 0);
	    expect($scope.map.center.longitude, 0);
	    expect($scope.map.center.zoom, 23);
	    expect($scope.map.center.draggable, true);
  }));*/

  it('should ....', inject(function() {  
	  alert('It works');
  }));
});