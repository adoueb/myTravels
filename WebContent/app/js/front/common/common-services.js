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
}]);