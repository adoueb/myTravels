'use strict';

/* Directives */


angular.module('common-directives', [])


/**
 * clickToEdit directive
 * Ex: <click-to-edit value="ref to obj" bold="true or false" tooltip="string"></click-to-edit>
 */
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
})

/**
 * showAlerts directive
 * Ex: <show-alerts key="main"/>
 */
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
})

/**
 * Ask for confirmation because executing the action.
 * Usage: Add attributes: confirmation-message="Really?" confirmation-click="takeAction()" function
 */
.directive('confirmationClick', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                var message = attrs.confirmationMessage;
                if (message) {
                	// Take care of param if any.
                    var param = attrs.confirmationParam;
                    if (param != undefined) {
                    	// Replace the param in the message.
                    	message = message.replace("%param%", param);
                    }
                	scope.confirmDlg(message, attrs.confirmationClick);
                }
            });
            
            scope.confirmDlg = function (message, callback) {
            	bootbox.confirm(message, function(result) {
            		if (result == true) {
            			scope.$apply(callback);
            		}
            	}); 
            };
        }
    }
}])

/**
 * Display warning if some conditions are met.
 * Then ask for confirmation because executing the action.
 * Usage: Add attributes: warning-condition="true" warning-message="Warning: nothing to do" confirmation-message="Really?" warning-and-confirmation-click="takeAction()" function
 */
.directive('warningAndConfirmationClick', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
            	var warningCondition = attrs.warningCondition;
            	if (warningCondition == "true") {
            		// Display warning.
            		var warningMessage = attrs.warningMessage;
            		bootbox.alert(warningMessage, function() {});
            	} else {
            		// If no warning to display, ask for confirmation.
	                var message = attrs.confirmationMessage;
	                if (message) {
	                    var param = attrs.confirmationParam;
	                    if (param != undefined) {
	                    	// Replace the param in the message.
	                    	message = message.replace("%param%", param);
	                    }
	                	scope.confirmDlg(message, attrs.warningAndConfirmationClick);
	                }
            	}
            });
            
            scope.confirmDlg = function (message, callback) {
            	bootbox.confirm(message, function(result) {
            		if (result == true) {
            			scope.$apply(callback);
            		}
            	}); 
            };
        }
    }
}])

/**
 * Display warning if some conditions are met.
 * Usage: Add attributes: warning-message="Warning: nothing to do"
 */
.directive('warningMessage', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
            	// Display warning.
            	var warningMessage = attrs.warningMessage;
            	bootbox.alert(warningMessage, function() {});
            });
        }
    }
}]);