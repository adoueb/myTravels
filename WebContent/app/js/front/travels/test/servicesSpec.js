'use strict';

/* jasmine specs for services go here */

describe('Service: travels services', function() {

	describe('Service: TravelService', function() {
		// Load the travels-services module, which contains the service
		beforeEach(function(){
		    module('ngResource');
		    //module('travels-services');
		});
		
		beforeEach(module('travels-services', function($provide) {
			MapService = {};
			$filter = {};

		    $provide.value('MapService', MapService);
		    $provide.value('$filter', $filter);
		  }));
	
		var TravelService, $log, TravelRest;
		beforeEach(inject(function(_TravelService_, _$log_) {
			TravelService = _TravelService_;
			$log = _$log_;
		}));

		// Ordered by year
		it('should order travels by year', function() {
			expect(TravelService).toBeDefined();
			expect(TravelService.getOrderProp()).toEqual("year");
			
			//spyOn($filter, 'orderBy');
			//TravelService.getOrderedTravels(travels);
		    //expect($filter.orderBy).toHaveBeenCalled();
		});
		
	});
		

	describe('Service: AddTravelService', function() {
		
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
			expect(AddTravelService.getShowAddTravelAlert()).toBeFalsy();
		});

		// Show error.
		it('should show error when required', function() {
			AddTravelService.setShowAddTravelAlert(true);
			expect(AddTravelService.getShowAddTravelAlert()).toBeTruthy();
		});
	});
	

	describe('Service: UpdateTravelService', function() {
		
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
			expect(UpdateTravelService.getShowUpdateTravelAlert()).toBeFalsy();
		});

		// Show error.
		it('should show error when required', function() {
			UpdateTravelService.setShowUpdateTravelAlert(true);
			expect(UpdateTravelService.getShowUpdateTravelAlert()).toBeTruthy();
		});
	});


	describe('Service: DeleteTravelService', function() {
		
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
			expect(DeleteTravelService.getShowDeleteTravelAlert()).toBeFalsy();
		});

		// Show error.
		it('should show error when required', function() {
			DeleteTravelService.setShowDeleteTravelAlert(true);
			expect(DeleteTravelService.getShowDeleteTravelAlert()).toBeTruthy();
		});
	});
});
