// in the controllers, we can get the current user by deferring to authentication service

(function () {
    'use strict';
    var controllerId = 'sales';
    
    angular.module('app')
        .controller(controllerId, ['$q', 'common', 'authentication', sales]);
    
    function sales($q, common, authentication)
    {
      // ...
       
    // each controller has a call to getUser(), which defers to the authentication service for auth status
    var vm = this;
    vm.user = {};
    
    activate();

        function activate() {
            
            // call the getUser promise
             common.activateController([getUser()], controllerId)
                .then(function () {  });
        }
        function getUser() {
            return authentication.login().then(function(data) {
                vm.user = data;
                return $q.when(data);
            });
        }
        
        // ...
        
    }
})();