'use strict';

/* Directives */


angular.module('common-directives', [])

// showAlerts directive
// Ex: <show-alerts key="main"/>
.directive("showAlerts", function() {   
    return {
        restrict: "E",
        replace: true,
        templateUrl: "partials/showAlerts.html",
        scope: {
        	key: '@',
        	alerts: '='
        }
    }
});