'use strict';

/* Directives */


angular.module('travels-directives', [])

.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
       elm.text(version);
    };
}])
.directive("clickToEdit", function() {
    var editorTemplate = '<div class="click-to-edit">' +
        '<p class="cuttext" ng-class="{isbold: boldValue == true}" ng-hide="view.editorEnabled">' +
            '{{value || "[Enter text here]"}} ' +
            '<a ng-click="enableEditor()" ng-attr-title="{{value}}"><i class="glyphicon glyphicon-edit"></i></a>' +
        '</p>' +
        '<p class="cuttext"  ng-class="{isbold: boldValue == true}" ng-show="view.editorEnabled">' +
            '<input ng-model="view.editableValue">' +
            '<a href="#" ng-click="save()"><i class="glyphicon glyphicon-ok" title="Save"></i></a>' +
            '<a ng-click="disableEditor()"><i class="glyphicon glyphicon-remove" title="Cancel"></i></a>' +
        '</p class="cuttext panel-text-bold">' +
    '</div>';

    return {
        restrict: "A",
        replace: true,
        template: editorTemplate,
        scope: {
            value: "=clickToEdit",
            boldValue: "=clickToEditBold",
            //editTooltipValue: "=clickToEditTooltip"
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
})
;
