'use strict';

/* Services */
angular.module('common-services', [])

// ------------------------------------------------------------------------
// Common services.
// ------------------------------------------------------------------------
.service('CommonService', ['$log', function($log) {
	
	// Send an email.
	this.sendEmail = function(email) {
		var link = "mailto:" + email.address
                 + "&subject=" + escape(email.subject)
                 + "&body=" + escape(email.body);

		window.location.href = link;
	};
	
	// show error.   
    this.showError = function(ngModelController, error) {
    	return ngModelController.$error[error];
    };
}])

// ------------------------------------------------------------------------
// AlertService: alerts are stored in a hashmap.
// An array of alerts per key.
// ------------------------------------------------------------------------
.factory('AlertService', ['$rootScope', '$log', function($rootScope, $log) {
    var alertService = {};

    // Initialization for a key.
    alertService.initAlerts = function(key) {
      if ($rootScope.alerts == undefined) {
    	  $rootScope.alerts = {};
      }
      if ($rootScope.alerts[key] == undefined) {
    	  $rootScope.alerts[key] = [];
      }
    };

    // Get alerts for a key.
    alertService.getAlerts = function(key) {
      return $rootScope.alerts[key];
    };

    // Add alert for a key.
    alertService.addAlert = function(key, type, msg) {
      this.initAlerts(key);
      $rootScope.alerts[key].push({'type': type, 'message': msg});
    };

    // Close an alert for a key.
    alertService.closeAlert = function(key, index) {
      $rootScope.alerts[key].splice(index, 1);
    };

    // Close all alerts for a key.
    alertService.resetAlerts = function(key) {
      $rootScope.alerts[key].clear();
    };

    return alertService;
}])
;