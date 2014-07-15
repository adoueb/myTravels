'use strict';

/* Filters */

angular.module('travels-filters', [])

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
// Example: <href="#" class="list-group-item" 
// ng-repeat="travel in filtered = (travels | excludeSelectedTravelFilter:selectedTravel)">
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
}])

// Format byte numbers to readable presentations:
.provider('formatFileSizeFilter', function () {
    var $config = {
        // Byte units following the IEC format
        // http://en.wikipedia.org/wiki/Kilobyte
        units: [
            {size: 1000000000, suffix: ' GB'},
            {size: 1000000, suffix: ' MB'},
            {size: 1000, suffix: ' KB'}
        ]
    };
    this.defaults = $config;
    this.$get = function () {
        return function (bytes) {
            if (!angular.isNumber(bytes)) {
                return '';
            }
            var unit = true,
                i = 0,
                prefix,
                suffix;
            while (unit) {
                unit = $config.units[i];
                prefix = unit.prefix || '';
                suffix = unit.suffix || '';
                if (i === $config.units.length - 1 || bytes >= unit.size) {
                    return prefix + (bytes / unit.size).toFixed(2) + suffix;
                }
                i += 1;
            }
        };
    };
});

