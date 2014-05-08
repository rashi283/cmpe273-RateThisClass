/**
 * New node file
 */

angular.module('restModule', ['ngResource']).
factory('Class', function($resource) {
  return $resource('classes/:classId', {}, {
    query: { method: 'GET', params: { classId: 'classes' }, isArray: true }
  })
}).
factory('socket', function($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

angular.module('restModule') .directive('starRating',
		function() {
	return {
		restrict : 'A',
		template : '<ul class="rating">'
				 + '	<li ng-repeat="star in stars" ng-class="star" ng-click="change($index)">'
				 + '\u2605'
				 + '</li>'
				 + '</ul>',
		
			scope : {
				ratingValue : '=',
				max : '=',
				onRatingSelected : '&',
				readonly: '@',
				avgRatingValue:'='
			
		},
		link : function(scope, element, attrs) {
		
			var updateStarRating = function() {
				scope.stars = [];
				for ( var i = 0; i < scope.max; i++) {
					scope.stars.push({
						filled : i < scope.ratingValue
					});
				}
			};
			
			
			
			scope.change = function(index) {
				if (scope.readonly && scope.readonly === 'true') {
		            return;
		          }
				scope.ratingValue = index + 1;
				scope.onRatingSelected({
					rating : index + 1
				});
			};
			
                var updateAverageStars=function(){
				scope.stars = [];
				for ( var i = 0; i < 5; i++) {
					scope.stars.push({
						filled : i < scope.avgRatingValue-1
					});
				}
			
		};
			
			scope.$watch('ratingValue',
				function(oldValue, newValue) {
					if (newValue) {
						updateStarRating();
					}
				}
			);
			
			scope.$watch('avgRatingValue',
					function(oldValue, newValue) {
						if (newValue) {
							updateAverageStars();
						}
					}
				);
		}
	};
}
);

