'use strict';

/* Services */

angular.module('travelApp.services', [ 'ngResource' ])
	
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
});