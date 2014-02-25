'use strict';


// Declare app level module which depends on filters, and services
angular.module('travelApp', [
  'ngRoute',
  'travelApp.filters',
  'travelApp.services',
  'travelApp.directives',
  'travelApp.controllers',
  'google-maps'
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
