'use strict';

/* jasmine specs for services go here */

describe('travels services tests', function() {

	describe('AddTravelService tests', function() {
		
		// Load the travels-services module, which contains the service
		beforeEach(module('travels-services'));
	 
		var AddTravelService, $log;
		beforeEach(inject(function(_AddTravelService_,_$log_) {
			AddTravelService = _AddTravelService_;
			$log = _$log_;
		}));

		// By default, no error to show.
		it('should set no error by default', function() {
			expect(AddTravelService).toBeDefined();
			expect(AddTravelService.getShowAddTravelError()).toBeFalsy();
		});

		// Show error.
		it('should show error when required', function() {
			AddTravelService.setShowAddTravelError(true);
			expect(AddTravelService.getShowAddTravelError()).toBeTruthy();
		});
	});
});
