'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
  var scope, httpBackend, google;
  beforeEach(module('travelApp'));
  beforeEach(inject(function ($controller, _$httpBackend_, $rootScope, _$log_, _TravelRest_) {
	    httpBackend = _$httpBackend_;
	    httpBackend.expectGET('http://localhost:8080/MyTravels-0.0.1-SNAPSHOT/travels').respond('[]');
	    TravelRest = _TravelRest_;
	    scope = $rootScope.$new();
	    $log = _$log_;
	    google = {};
	    TravelListCtrl = $controller('TravelListCtrl', {
	    	$scope: scope,
	    	$log: $log,
	        $httpBackend: httpBackend,
	        TravelRest: TravelRest
	      });
	    
	  }));
  afterEach(function () {
	  //httpBackend.verifyNoOutstandingExpectation();
	  //httpBackend.verifyNoOutstandingRequest();
	  });
  

  it('should initialize the map', inject(function ($controller) {
	  //verify the initial setup
	    expect($scope.map.center.latitude, 0);
	    expect($scope.map.center.longitude, 0);
	    expect($scope.map.center.zoom, 23);
	    expect($scope.map.center.draggable, true);
  }));

  it('should ....', inject(function() {  
	  alert('It works');
  }));
});