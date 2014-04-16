angular.module('ratethisclass', ['restModule' ,'ratethisclass.services' ]).config(
		[ '$routeProvider', function($routeProvider) {
			$routeProvider.when('/classes', {
				templateUrl : 'partials/classList.html',
				controller : ClassListCtrl
			}).when('/class/:classId', {
				templateUrl : 'partials/classItem.html',
				controller : ClassItemCtrl
			}).when('/new', {
				templateUrl : 'partials/classNew.html',
				controller : ClassNewCtrl
			}).otherwise({
				redirectTo : '/classes'
			});
		} ]); 