
// Managing the class list
function ClassListCtrl($scope, Class, $rootScope) {
	$scope.classes = Class.query();
	
	$scope.getLinkedInUserDetails = function() {
		if(!$scope.hasOwnProperty("userProfile")){
			
			IN.API.Profile("me").fields(
					[ "id", "firstName", "lastName", "pictureUrl",
							"publicProfileUrl" ]).result(function(data) {
				
				console.log(data);
				 $rootScope.$apply(function() {
					var userProfile = data.values[0];
					$rootScope.userProfile = userProfile;
					$rootScope.userLoggedIn = true;				
			    	
				});
			}).error(function(err) {
				$scope.error = err;
			});
		}
	};
 
	$scope.logoutLinkedIn = function() {
		console.log("inside logoutLinkedIn ");
		IN.User.logout();
		delete $rootScope.userProfile;
		$rootScope.userLoggedIn = false;
		
	};
}
// View a class
function ClassItemCtrl($scope, $routeParams, socket, Class,ClassFactory, ClassFactoryDel) { 
	 $scope.thisclass = Class.get({classId: $routeParams.classId});
 socket.on('self_rate', function(data) {
   console.dir(data);
   if(data._id === $routeParams.classId) {
     $scope.thisclass = data;
     $scope.thisclass.totalRating = data.totalRating;
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
 	
  var classId = $scope.thisclass._id, itemId = $scope.thisclass.userRate, rating = $scope.rating;
 	
   if(itemId) {
     var rateObj = { class_id: classId, item: itemId, rating: rating, user:$scope.userProfile.id};
     
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
//Rashi
	$scope.delItem = function() {
		var clsId = $scope.thisclass._id;
		ClassFactoryDel.del({ classId : clsId});
	};
//Rashi


$scope.addComment = function(){
	
	var comment=$scope.thisclass.comments.text;
	if(comment!=null){
		var commentObj={text:comment};
		/*$scope.thisclass.comments=commentObj;
		*/
		//$scope.thisclass.addComment({ classId :$routeParams.classId});
		$scope.thisclass.comments.push(commentObj);
		ClassFactoryDel.addComment({ classId :$routeParams.classId},commentObj);
		
	}else{
		alert('Add a comment');
	}
	
};

	$scope.clearContents=function(element){
	  element.value = '';
	};
	
	 $scope.rateFunction = function(rating) {
 	 $scope.rating=rating;
     alert('Rating selected - ' + rating);
     return rating;
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
		],
		comments:[{
			text:''
		},
		{text:''}
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