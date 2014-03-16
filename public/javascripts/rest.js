/**
 * New node file
 */
angular.module('restModule', [ 'ngResource' ]).factory('Class',
		function($resource) {
			return $resource('classes/:classId', {}, {
				query : {
					method : 'GET',
					params : {
						classId : 'classes'
					},
					isArray : true
				}
			})
		});