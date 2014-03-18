// Managing the class list
function ClassListCtrl($scope, Class) {
	$scope.classes = Class.query();
}
// View a class
function ClassItemCtrl($scope, $routeParams, Class) {
	$scope.thisclass = Class.get({classId: $routeParams.classId});
	$scope.rate = function() {
	};
	$scope.addItem = function() {
		$scope.thisclass.items.push({
			text : ''
		});
	};
}
// Creating a new class
function ClassNewCtrl($scope, $location, Class) {
	$scope.thisclass = {
		//Rashi
		className : '',
		professor : '',
		session : '',
		
		//Shaji
		items : [ {
			text : ''
		}, {
			text : ''
		}, {
			text : ''
		} ]
	};
	//Shaji
	$scope.addItem = function() {
		$scope.thisclass.items.push({
			text : ''
		});
	};
	$scope.createClass = function() {
		var thisclass = $scope.thisclass;
		if (thisclass.className.length > 0) {
			var itemCount = 0;
			for ( var i = 0, ln = thisclass.items.length; i < ln; i++) {
				var item = thisclass.items[i];
				if (item.text.length > 0) {
					itemCount++;
				}
			}
			if (itemCount > 0) {
				var newClass = new Class(thisclass);
				newClass.$save(function(p, resp) {
					if (!p.error) {
						$location.path('classes');
					} else {
						alert('Could not create class');
					}
				});
			} else {
				alert('You must enter at least one item');
			}
		} else {
			alert('You must enter a name for the class');
		}
	};
}