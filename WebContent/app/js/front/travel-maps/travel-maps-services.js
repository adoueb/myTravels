'use strict';

/* Services */


angular.module('travel-maps-services', [])

// ------------------------------------------------------------------------
// 
// ------------------------------------------------------------------------
.service('MapService', ['$log', function($log) {
	
	this.initMap = function() {
		// Enable the new Google Maps visuals until it gets enabled by default.
		// See http://googlegeodevelopers.blogspot.ca/2013/05/a-fresh-new-look-for-maps-api-for-all.html
	    // As we celebrate your maps, we’re also introducing the largest visible change in our eight year history: 
	    // a fresh new look and feel for the JavaScript and Static Maps APIs, in line with the launch of the new Google Maps.
	    // The new look is available for opt-in today, and is a simple one line code change: google.maps.visualRefresh=true;.
	    google.maps.visualRefresh = true;
	};
	
	// Return map data (map + markers) from position, zoom and markers.
	this.getMapData = function(position, zoom, markers) {
		var map = {};
		map.center =  {
		        latitude: position.coords.latitude,
		        longitude: position.coords.longitude
	    };
		map.zoom = (typeof zoom === "undefined") ? 8 : zoom;
		return {map:map, markers: markers};
	};
	
	// Return default map data (map + markers).
	this.getDefaultMapData = function() {
		// TODO: think about geolocalization.
	    /*
		if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition($scope.setMap);
		} else {
		    $scope.setMapData({coords: {latitude:47, longitude:-122}}, 2);  
		}
		*/

		return this.getMapData({coords: {latitude:0, longitude:0}}, 2, []);  
	};
	
	// Return map data (map + markers) from an array of stops.
	this.getMapFromStops = function(stops) {
		var map = {};
		
    	if (stops.length >= 1) {
    		map.markers = stops;
    		
    		var bounds = {
    			    southwest: {
    				    latitude: 0,
    					longitude: 0
    				},
    				northeast: {
    				    latitude: 0,
    				    longitude: 0
    				}
    			};
    		map.bounds = bounds;
    		map.center = {
	    	    latitude: 0,
	    		longitude: 0
	    	};
    		map.zoom = 9;    		    		
	    } else {
	    	map = this.getDefaultMapData().map;
	    	map.markers = [];
	    }
		return map;
	};
	
	// Update stops with id, icon, show, options, onMarkerClick.
	this.updateStops = function(stops) {
		for (var stopIndex=0; stopIndex < stops.length; stopIndex++) {
		    var currentStop = stops[stopIndex];
		    currentStop.id = stopIndex;
			currentStop.icon = "img/static/blue_Marker" + String.fromCharCode(65 + stopIndex) + ".png";
			currentStop.show = false;
			currentStop.options = {
				labelContent: currentStop.title,
				labelClass: "marker-labels"
			};
			currentStop.onMarkerClick = function(){
				this.show = !this.show;
			};
    	}
	};
	
	// Reset stops.
	this.resetStops = function(stops) {
		for (var stopIndex=0; stopIndex < stops.length; stopIndex++) {
		    var currentStop = stops[stopIndex];
		    delete currentStop.id;
		    delete currentStop.icon;
		    delete currentStop.show;
		    delete currentStop.onMarkerClick;
		    delete currentStop.options;
    	}
	};
    
}]);