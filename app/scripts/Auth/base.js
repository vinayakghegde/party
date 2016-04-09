(function () {
    'use strict';
    var controllerId = 'base';

    angular.module('app')
        .controller(controllerId, ['common', 'authentication', base]);

    function base(common, authentication) {

        var vm = this;

        // local vm.user object for use with topnav.html to display logged in user name
        vm.user = { displayName: "..." };

        activate();

        function activate() {
            common.activateController([login()], controllerId);
        }

        function login() {
          
            return authentication.login().then(function (data) {
                vm.user = data;
            });
        }
    }
})();