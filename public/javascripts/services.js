/**
 * 
 */
var services = angular.module('ratethisclass.services', ['ngResource']);

services.factory('ClassFactory', function ($resource) {
    return $resource('classes/:classId/items', {}, {
        
        update: { method: 'PUT', params :{
			classId : 'classes'}},
        del: { method: 'DELETE', params: {id: '@id'} }
    });
});
