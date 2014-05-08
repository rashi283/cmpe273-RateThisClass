/**
 * 
 */
var services = angular.module('ratethisclass.services', [ 'ngResource' ]);

services.factory('ClassFactory', function($resource) {
	return $resource('classes/:classId/items', {}, {

		update : {
			method : 'PUT',
			params : {
				classId : 'classes'
			}
		}

	});
});

services.factory('ClassFactoryDel', function($resource) {
	return $resource('classes/:classId', {}, {
		del : {
			method : 'DELETE'
		},
		addComment : {
			method : 'PUT'
		}
	});
});
