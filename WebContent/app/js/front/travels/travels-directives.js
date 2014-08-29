'use strict';

/* Directives */


angular.module('travels-directives', [])

.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
       elm.text(version);
    };
}])
/*
.directive('file', function() {
    return {
        restrict: 'E',
        template: '<input type="file" multiple/>',
        replace: true,
        require: 'ngModel',
        link: function(scope, element, attr, ctrl) {
            var listener = function() {
                scope.$apply(function() {
                    attr.multiple ? ctrl.$setViewValue(element[0].files) : ctrl.$setViewValue(element[0].files[0]);
                });
            }
            element.bind('change', listener);
        }
    }
})
*/
.directive("clickToEdit", function() {
    var editorTemplate = '<div class="click-to-edit">' +
        '<p class="cuttext panel-text" ng-hide="view.editorEnabled">' +
            '{{value}} ' +
            '<a ng-click="enableEditor()"><i class="glyphicon glyphicon-edit" title="Edit"></i></a>' +
        '</p>' +
        '<p class="cuttext panel-text" ng-show="view.editorEnabled">' +
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
