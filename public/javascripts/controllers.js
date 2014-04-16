
// Managing the class list
function ClassListCtrl($scope, Class) {
	$scope.classes = Class.query();
}
// View a class
function ClassItemCtrl($scope, $routeParams, socket, Class,ClassFactory) { 
    $scope.thisclass = Class.get({classId: $routeParams.classId});
    socket.on('myrate', function(data) {
      console.dir(data);
      if(data._id === $routeParams.classId) {
        $scope.thisclass = data;
      }
    });
    socket.on('rate', function(data) {
      console.dir(data);
      if(data._id === $routeParams.classId) {
        $scope.thisclass.items = data.items;
        $scope.thisclass.totalRating = data.totalRating;
      }   
    });
    $scope.rate = function() {
      var classId = $scope.thisclass._id,
          itemId = $scope.thisclass.userRate;
      if(itemId) {
        var rateObj = { class_id: classId, item: itemId };
        socket.emit('send:rate', rateObj);
      } else {
        alert('You must select an option to rate for');
      }
    };
$scope.addItem = function() {
		
		var category=$scope.thisclass.items.category;
		var text=$scope.thisclass.items.text;
		if(category!=null && text!=null){
			var item={
					category : category,
					text :text
				}; 
			$scope.thisclass.items.push(item);
			ClassFactory.update({ classId :$routeParams.classId},item);
		
	}else{
		alert('Category and Text cannot be blank');
	}
	
	};	
  }



// Creating a new class
function ClassNewCtrl($scope, $location, Class) {
	$scope.thisclass = {
		//Rashi
		className : '',
		professor : '',
		session : '',
		//Anne
		//Shaji
		items : [ {
			category:'',
			text : ''
		},
		{
			category:'',
			text : ''
		},
		{
			category:'',
			text : ''
		}
		]
	};
	//Shaji
	$scope.addItem = function() {
		$scope.thisclass.items.push({
			category:'',
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