angular.module('travel-maps-directives', ['travel-maps-services'])

.directive('countrySelect', ['PlacesService', function (PlacesService) {
    
    var getCountriesOptions = function() {
    	var options = "";
    	for (var countryIndex = 0; countryIndex < PlacesService.getCountryCount(); countryIndex++) {
    		options += '<option value="' + PlacesService.getCountryCode(countryIndex) + '">';
    		options += PlacesService.getCountryName(countryIndex);
    		options += '</option>';
    		
    	}
    	return options;
    }; 

    return {
      restrict: 'E',
      template: '<select>' + getCountriesOptions() + '</select>',
      replace: true
    };
  }]);
