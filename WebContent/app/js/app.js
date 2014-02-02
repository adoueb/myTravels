'use strict';


// Declare app level module which depends on filters, and services
angular.module('travelApp', [
  'ngRoute',
  'travelApp.filters',
  'travelApp.services',
  'travelApp.directives',
  'travelApp.controllers',
  'restangular'
]).
config(function($routeProvider, RestangularProvider) {
	RestangularProvider.setBaseUrl('http://localhost:8080/MyTravels-0.0.1-SNAPSHOT');
	RestangularProvider.setRestangularFields({
	      id: '_id.$oid'
	    });
    RestangularProvider.setRequestInterceptor(function(elem, operation, what) {
        
        if (operation === 'put') {
          elem._id = undefined;
          return elem;
        }
        return elem;
      });
    RestangularProvider.setDefaultHeaders({'Content-Type': 'application/json'});
});










angular.module('project', ['restangular', 'ngRoute']).
config(function($routeProvider, RestangularProvider) {
  $routeProvider.
    when('/', {
      controller:ListCtrl, 
      templateUrl:'list.html'
    }).
    when('/edit/:projectId', {
      controller:EditCtrl, 
      templateUrl:'detail.html',
      resolve: {
        project: function(Restangular, $route){
          return Restangular.one('projects', $route.current.params.projectId).get();
        }
      }
    }).
    when('/new', {controller:CreateCtrl, templateUrl:'detail.html'}).
    otherwise({redirectTo:'/'});
    
    RestangularProvider.setBaseUrl('https://api.mongolab.com/api/1/databases/angularjs/collections');
    RestangularProvider.setDefaultRequestParams({ apiKey: '4f847ad3e4b08a2eed5f3b54' })
    RestangularProvider.setRestangularFields({
      id: '_id.$oid'
    });
    
    RestangularProvider.setRequestInterceptor(function(elem, operation, what) {
      
      if (operation === 'put') {
        elem._id = undefined;
        return elem;
      }
      return elem;
    })
});


function ListCtrl($scope, Restangular) {
 $scope.projects = Restangular.all("projects").getList().$object;
}


function CreateCtrl($scope, $location, Restangular) {
$scope.save = function() {
  Restangular.all('projects').post($scope.project).then(function(project) {
    $location.path('/list');
  });
}
}

function EditCtrl($scope, $location, Restangular, project) {
var original = project;
$scope.project = Restangular.copy(original);


$scope.isClean = function() {
  return angular.equals(original, $scope.project);
}

$scope.destroy = function() {
  original.remove().then(function() {
    $location.path('/list');
  });
};

$scope.save = function() {
  $scope.project.put().then(function() {
    $location.path('/');
  });
};
}
