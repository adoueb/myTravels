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
		
});
