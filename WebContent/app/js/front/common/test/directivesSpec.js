describe('Directive: common directives', function() {
  var $compile,
      $rootScope;

	// Load the common-services module, which contains the service
	beforeEach(module('common-directives'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));
//
//  it('Replaces the element with the appropriate content', function() {
//    // Compile a piece of HTML containing the directive
//    var element = $compile('<click-to-edit value="my value" bold="true" tooltip="Edit title"></click-to-edit>')($rootScope);
//    // fire all the watches
//    $rootScope.$digest();
//    // Check that the compiled element contains the templated content
//    expect(element.html()).toContain("my value");
//  });
});