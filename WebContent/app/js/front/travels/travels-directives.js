'use strict';

/* Directives */


angular.module('travels-directives', [])

.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
       elm.text(version);
    };
}])

// clickToEdit directive
// Ex: <click-to-edit value="ref to obj" bold="true or false" tooltip="string"></click-to-edit>
.directive("clickToEdit", function() {   
    return {
        restrict: "E",
        replace: true,
        templateUrl: "partials/clickToEdit.html",
        scope: {
            value: "=value",
            boldValue: "=bold",
            editTooltipValue: "@tooltip"
        },
        controller: function($scope) {
        	
        	$scope.view = {
                editableValue: $scope.value,
                editorEnabled: false
            };

            $scope.enableEditor = function() {
                $scope.view.editorEnabled = true;
                $scope.view.editableValue = $scope.value;
            };

            $scope.disableEditor = function() {
                $scope.view.editorEnabled = false;
            };

            $scope.save = function() {
                $scope.value = $scope.view.editableValue;
                $scope.disableEditor();
            };
        }
    };
});