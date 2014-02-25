'use strict';

/* Filters */

angular.module('travelApp.filters', [])

// ------------------------------------------------------------------------
// Interpolate filter.
// ------------------------------------------------------------------------
.filter('interpolate', ['version', function(version) {
    return function(text) {
        return String(text).replace(/\%VERSION\%/mg, version);
    };
}])
  
// ------------------------------------------------------------------------
// excludeSelectedTravelFilter filter: exclude one element from the list.
// ------------------------------------------------------------------------
.filter('excludeSelectedTravelFilter', [function() {
    return function(travels, selectedTravel) {
	    if (!angular.isUndefined(travels) && !angular.isUndefined(selectedTravel)) {
		    var tempTravels = [];
			angular.forEach(travels, function(travel) {
			    if (!angular.equals(travel.id, selectedTravel.id)) {
				    tempTravels.push(travel);
                }
            });
			return tempTravels;
		} else {
			return travels;
		}
    };
}]);

