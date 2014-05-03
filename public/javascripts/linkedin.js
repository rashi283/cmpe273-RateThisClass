/**
 * Functions related to linkedin integration
 */

//on load profile 
function onLinkedInLoad() {
	
	IN.Event.on(IN, "auth", function() {
		angular.element(document.getElementById("listClass")).scope().$apply(
				function($scope) {
					$scope.getLinkedInUserDetails();
				}
			);
	});
	IN.Event.on(IN, "logout", function() {
		onLinkedInLogout();
	});
}

//on logout 
function onLinkedInLogout() {
	angular.element(document.getElementById("listClass")).scope().$apply(
			function($scope) {
				$scope.logoutLinkedIn();
			}
		);
}

