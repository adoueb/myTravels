'use strict';

/* jasmine specs for services go here */

describe('Service: common services', function() {

	describe('Service: AlertService', function() {
		
		// Load the common-services module, which contains the service
		beforeEach(module('common-services'));
	 
		var AlertService, $log, $rootScope;
		beforeEach(inject(function(_AlertService_,_$rootScope_, _$log_) {
			AlertService = _AlertService_;
			$rootScope = _$rootScope_;
			$log = _$log_;
		}));

		it('should set no alert by default', function() {
			AlertService.initAlerts("main");
			expect(AlertService).toBeDefined();
			expect(AlertService.getAlerts("main")).toEqual([]);
		});

		it('should store alert when addAlert is called', function() {
			AlertService.addAlert("main","error", "error1");
			var alerts = AlertService.getAlerts("main");
			expect(alerts).toBeDefined();
			expect(alerts.length).toEqual(1);
			var alert = alerts[0];
			expect(alert).toBeDefined();
			expect(alert.type).toEqual("error");
			expect(alert.message).toEqual("error1");
		});

		it('should store several alerts when addAlert is called several times', function() {
			AlertService.addAlert("main","error", "error1");
			AlertService.addAlert("main","error", "error2");
			
			// Alerts
			var alerts = AlertService.getAlerts("main");
			expect(alerts).toBeDefined();
			expect(alerts.length).toEqual(2);
			
			// Alert 1
			var alert = alerts[0];
			expect(alert).toBeDefined();
			expect(alert.type).toEqual("error");
			expect(alert.message).toEqual("error1");
			
			// Alert 2
			alert = alerts[1];
			expect(alert).toBeDefined();
			expect(alert.type).toEqual("error");
			expect(alert.message).toEqual("error2");
		});

		it('should store several alerts with different keys when required', function() {
			AlertService.addAlert("main","error", "error1");
			AlertService.addAlert("addTravel","warning", "warningTravel1");
			
			// main alerts
			var alerts = AlertService.getAlerts("main");
			expect(alerts).toBeDefined();
			expect(alerts.length).toEqual(1);
			
			// Alert 1
			var alert = alerts[0];
			expect(alert).toBeDefined();
			expect(alert.type).toEqual("error");
			expect(alert.message).toEqual("error1");
			
			// addTravel alerts
			alerts = AlertService.getAlerts("addTravel");
			expect(alerts).toBeDefined();
			expect(alerts.length).toEqual(1);
			
			// Alert 1
			var alert = alerts[0];
			expect(alert).toBeDefined();
			expect(alert.type).toEqual("warning");
			expect(alert.message).toEqual("warningTravel1");
		});

		it('should remove alert when closeAlert is called', function() {
			AlertService.addAlert("main","error", "error1");
			AlertService.addAlert("main","error", "error2");
			AlertService.addAlert("addTravel","error", "errorTravel1");
			
			AlertService.closeAlert("main", 0);
			
			// main alerts
			var alerts = AlertService.getAlerts("main");
			expect(alerts).toBeDefined();
			expect(alerts.length).toEqual(1);
			
			// Alert 1
			var alert = alerts[0];
			expect(alert).toBeDefined();
			expect(alert.type).toEqual("error");
			expect(alert.message).toEqual("error2");
			
			AlertService.closeAlert("addTravel", 0);
			
			// addTravel alerts
			var alerts = AlertService.getAlerts("addTravel");
			expect(alerts).toBeDefined();
			expect(alerts.length).toEqual(0);
		});
	});
});
