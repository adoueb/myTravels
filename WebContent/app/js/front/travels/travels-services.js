'use strict';

/* Services */

angular.module('travels-services', [ 'ngResource'])
	
// ------------------------------------------------------------------------
// version value
// ------------------------------------------------------------------------
.value('version', '0.1')

// ------------------------------------------------------------------------
// Travel factory: 
// like in angular-phonecat app
// Get data from file resources
// Not used in the project
// ------------------------------------------------------------------------
.factory('Travel', [ '$resource', function($resource) {
		return $resource('travels/:travelId.json', {}, {
			query : {
				method : 'GET',
				params : {
					travelId : 'travels'
				},
				isArray : true
			}
		});
} ])

// ------------------------------------------------------------------------
// travelResource factory
// Consuming REST services 
// REST: CRUD methods: query, save, remove, update
// ------------------------------------------------------------------------
.factory('travelResource', function ($http) {

    return function () {

        //basic configuration
        var travelRestUrl = 'http://localhost:8080/MyTravels-0.0.1-SNAPSHOT/travels';

        //utility methods
        var getId = function (data) {
            return data._id.$oid;
        };

        //a constructor for new resources
        var Resource = function (data) {
            angular.extend(this, data);
        };

        Resource.query = function (successFct, errorFct) {
            return $http.get(travelRestUrl).then(function (response) {
                var result = [];
                angular.forEach(response.data, function (value, key) {
                    result[key] = new Resource(value);
                });
                successFct(result);
                return result;
            }, function() {
        	    errorFct();
            });
        };

        Resource.save = function (data, successFct, errorFct) {
            return $http.post(travelRestUrl, data).then(function (response) {
            	var result = response.data;
                successFct(result);
                return result;
            }, function() {
        	    errorFct();
            });
        };

        Resource.prototype.$save = function (data) {
            return Resource.save(this);
        };

        Resource.remove = function (data, successFct, errorFct) {
            return $http['delete'](travelRestUrl + '/' + data.id).then(function (response) {
            	var result = [];
                angular.forEach(response.data, function (value, key) {
                    result[key] = new Resource(value);
                });
                successFct(result);
                return result;
            }, function() {
        	    errorFct();
            });
        };

        Resource.prototype.$remove = function (data) {
            return Resource.remove(this);
        };


        Resource.update = function (data, successFct, errorFct) {
            return $http.put(travelRestUrl + '/' + data.id, data).then(function (response) {
            	var result = response.data;
                successFct(result);
                return result;
            }, function() {
        	    errorFct();
            });
        };

        Resource.queryOne = function (id, successFct, errorFct) {
            return $http.get(travelRestUrl + '/' + id).then(function (response) {
            	var result = response.data;
                successFct(result);
                return result;
            }, function() {
        	    errorFct();
            });
        };

        //other CRUD methods go here

        //convenience methods
        Resource.prototype.$id = function () {
            return getId(this);
        };

        return Resource;
    };
})

// ------------------------------------------------------------------------
// TravelRest factory
// The one used in the controller.
// ------------------------------------------------------------------------
.factory('TravelRest', function (travelResource) {
    return travelResource();
})

// ------------------------------------------------------------------------
// travelResource factory
// Consuming REST services 
// REST: CRUD methods: query, save, remove, update
// ------------------------------------------------------------------------
.service('TravelService', ['$filter', '$log', 'MapService', 'TravelRest', function($filter, $log, MapService, TravelRest) {
	
	this.initTravels = function() {
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
		/*
		var travelsData = {travels:{selectedTravel:null}, error:{}};
		
	    TravelRest.query(function(travels) {
			// List of travels.
		    $log.info('travels loaded');
		    travelsData.travels = []; //this.getTravelsData(travels);
	    }, function() {
	    	$log.info('Error while loading travels');
	    	travelsData.error = {"class": "danger", "description": "The travels can't be loaded. Please retry."};
	    });
	    
	    return travelsData;*/
	};
	
	// Order for display the travels.
	this.getOrderProp = function() {
		return 'year';
	};
	
	// Return ordered travels from travels list.
	this.getOrderedTravels = function(travels) {
		// Order by date, reverse.
    	// ng-repeat="travel in travels | orderBy:orderProp:true" in HTML.
    	return $filter('orderBy')(travels, this.getOrderProp(), true);
	};
	
	// Get selected travel (travel + map + markers).
	this.getSelectedTravelData = function(travel) {
		var selectedTravel, map, markers;
    	if (travel != null && travel != undefined) {
	        // Get selected travel.
    		selectedTravel =  travel;
	    	
	    	// Get map.
	    	map = MapService.getMapFromStops(travel.itinerary.stops);
	    	
	    	// Stops: set icon.
	    	MapService.updateStops(selectedTravel.itinerary.stops);
    	} else {
    		// No selected travel
    		selectedTravel = null;
    		var mapData = MapService.getDefaultMapData();
    		map = mapData.map;
    		markers = mapData.markers;
    	}
    	return {selectedTravel: selectedTravel, map: map, markers:markers};
	};
	
	// Get travels data (travelsList + selectedTravel + map + markers).
	this.getTravelsData = function(travels) {

		var travelsList, selectedTravel, map, markers;
		
		travelsList = this.getOrderedTravels(travels);
      	  
		// Selected travel.
		var selectedTravelData;
	    if (travelsList.length >= 1) {
	    	selectedTravelData = this.getSelectedTravelData(travelsList[0]);
	    } else {
	    	selectedTravelData = this.getSelectedTravelData(null);
	    }
	    selectedTravel = selectedTravelData.selectedTravel;
    	map = selectedTravelData.map;
    	markers = selectedTravelData.markers;
		
    	return {travelsList: travelsList, selectedTravel: selectedTravel, map:map, markers: markers};
	};
	
	// Add travel to list and return travels data (travelsList + selectedTravel + map + markers).
	this.addTravel = function(travels, travel) {
		
		var travelsList;
		var selectedTravel = null;
		var map = null;
		var markers = null;
		
		var newTravels = travels;
		newTravels.push(travel);
		
		travelsList = this.getOrderedTravels(newTravels);
		
	   	if (travelsList.length == 1) {
    		// First travel creation.
	   		var selectedTravelData = this.getSelectedTravelData(travelsList[0]);
		    selectedTravel = selectedTravelData.selectedTravel;
	    	map = selectedTravelData.map;
	    	markers = selectedTravelData.markers;
    	}
		
	   	return {travelsList: travelsList, selectedTravel: selectedTravel, map:map, markers: markers};
	};
	
	// Update travel and return travels data (travelsList + selectedTravel + map + markers).
	this.updateTravel = function(travels, selectedTravel, travel) {
		
		var selectedUpdatedTravel = null;
		
    	// Iterate through travels.
	      for (var indexTravel = 0; indexTravel < travels.length; indexTravel++) {
	    	  if (travels[indexTravel].id == travel.id) {
	    		  travels[indexTravel] = travel;
	    		  // Update selection if so.
	    		  if (travel.id ==selectedTravel.id) {
	    			  selectedUpdatedTravel =  travel; 
	    		  }
	    		  break;
	    	  }
	      }
	      $log.info("travel " + travel.id + " / " + travel.country + " refreshed");
		
	   	return {selectedTravel: selectedUpdatedTravel};
	};
}])

// ------------------------------------------------------------------------
// AddTravelService
// ------------------------------------------------------------------------
.factory('AddTravelService', ['$log', function($log) {
	var me = {};
	
	return me;
}])

// ------------------------------------------------------------------------
// UpdateTravelService
// ------------------------------------------------------------------------
.factory('UpdateTravelService', ['$log', function($log) {
	var me = {};
	
	return me;
}])

// ------------------------------------------------------------------------
// DeleteTravelService
// ------------------------------------------------------------------------
.factory('DeleteTravelService', ['$log', function($log) {
	var me = {};
	
	return me;
}])
;