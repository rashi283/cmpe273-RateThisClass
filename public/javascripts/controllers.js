// Managing the class list
function ClassListCtrl($scope, Class) {
	$scope.classes = Class.query();
}
// View a class
function ClassItemCtrl($scope, $routeParams) {
	$scope.thisclass = {};
	$scope.vote = function() {
	};
}
// Creating a new class
function ClassNewCtrl($scope, $location, Class) {
	$scope.thisclass = {
		//Rashi
		className : '',
		professor : '',
		session : '',
		category : '',
		//Rashi
		choices : [ {
			text : ''
		}, {
			text : ''
		}, {
			text : ''
		} ]
	};
	$scope.addChoice = function() {
		$scope.thisclass.choices.push({
			text : ''
		});
	};
	$scope.createClass = function() {
		var thisclass = $scope.thisclass;
		if (thisclass.question.length > 0) {
			var choiceCount = 0;
			for ( var i = 0, ln = thisclass.choices.length; i < ln; i++) {
				var choice = thisclass.choices[i];
				if (choice.text.length > 0) {
					choiceCount++;
				}
			}
			if (choiceCount > 1) {
				var newClass = new Class(thisclass);
				newClass.$save(function(p, resp) {
					if (!p.error) {
						$location.path('classes');
					} else {
						alert('Could not create class');
					}
				});
			} else {
				alert('You must enter at least two choices');
			}
		} else {
			alert('You must enter a question');
		}
	};
}