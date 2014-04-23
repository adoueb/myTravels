'use strict';	// Strict Mode is a new feature in ECMAScript 5 that allows you to place a 
				// program, or a function, in a "strict" operating context. This strict 
				// context prevents certain actions from being taken and throws more exceptions.


// Declare app level module which depends on filters, services, directives and controllers.
angular.module('travelApp', [
  'travelApp.filters',
  'travelApp.services',
  'travelApp.directives',
  'travelApp.controllers',
  'google-maps',
  'ngRoute',
  'angularFileUpload'
]);

/*
.config(function($routeProvider, RestangularProvider) {
	RestangularProvider.setBaseUrl('http://localhost:8080/MyTravels-0.0.1-SNAPSHOT');
	RestangularProvider.setRestangularFields({
	      id: '_id.$oid'
	    });
    RestangularProvider.setRequestInterceptor(function(elem, operation, what) {
        
        if (operation === 'put') {
          elem._id = undefined;
          return elem;
        }
        return elem;
      });
    RestangularProvider.setDefaultHeaders({'Content-Type': 'application/json'});
});*/
