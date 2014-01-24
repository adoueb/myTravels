'use strict';

/* Services */

angular.module('travelApp.services', [ 'ngResource' ]).
	value('version', '0.1').

	factory('Travel', [ '$resource', function($resource) {
		return $resource('travels/:travelId.json', {}, {
			query : {
				method : 'GET',
				params : {
					travelId : 'travels'
				},
				isArray : true
			}
		});
} ]);
