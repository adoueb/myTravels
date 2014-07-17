'use strict';

/* jasmine specs for services go here */

describe('travels services tests', function() {

	describe('TravelService tests', function() {
		  it('should ....', function() {  
		  });
	});
		

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
	

	describe('UpdateTravelService tests', function() {
		
		// Load the travels-services module, which contains the service
		beforeEach(module('travels-services'));
	 
		var UpdateTravelService, $log;
		beforeEach(inject(function(_UpdateTravelService_,_$log_) {
			UpdateTravelService = _UpdateTravelService_;
			$log = _$log_;
		}));

		// By default, no error to show.
		it('should set no error by default', function() {
			expect(UpdateTravelService).toBeDefined();
			expect(UpdateTravelService.getShowUpdateTravelError()).toBeFalsy();
		});

		// Show error.
		it('should show error when required', function() {
			UpdateTravelService.setShowUpdateTravelError(true);
			expect(UpdateTravelService.getShowUpdateTravelError()).toBeTruthy();
		});
	});


	describe('DeleteTravelService tests', function() {
		
		// Load the travels-services module, which contains the service
		beforeEach(module('travels-services'));
	 
		var DeleteTravelService, $log;
		beforeEach(inject(function(_DeleteTravelService_,_$log_) {
			DeleteTravelService = _DeleteTravelService_;
			$log = _$log_;
		}));

		// By default, no error to show.
		it('should set no error by default', function() {
			expect(DeleteTravelService).toBeDefined();
			expect(DeleteTravelService.getShowDeleteTravelError()).toBeFalsy();
		});

		// Show error.
		it('should show error when required', function() {
			DeleteTravelService.setShowDeleteTravelError(true);
			expect(DeleteTravelService.getShowDeleteTravelError()).toBeTruthy();
		});
	});
});
