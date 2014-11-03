angular.module('travel-maps-directives', ['travel-maps-services'])

.directive('countrySelect', ['PlacesService', function (PlacesService) {

    return {
      restrict: 'E',
      templateUrl: "partials/selectCountry.html",
      replace: true,
      controller: function($scope) {
    	  $scope.getCountries = function() {
    		  return PlacesService.getCountries();
    	  }; 
      }
    };
  }]);
