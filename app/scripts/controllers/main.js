/// <reference path="../app.ts" />
'use strict';
var tdmApp;
(function (tdmApp) {
    var MainCtrl = (function () {
        function MainCtrl($scope) {
            this.$scope = $scope;
            $scope.onPlaceOrder = function () {
                console.log($scope.pizza);
                console.log($scope.cold);
            };
            $scope.onReset = function () {
                $scope.pizza = "";
                $scope.cold = "";
            };
        }
        return MainCtrl;
    }());
    tdmApp.MainCtrl = MainCtrl;
})(tdmApp || (tdmApp = {}));
var partyApp = angular.module('tdmApp', ["ngRoute"])
    .controller('MainCtrl', tdmApp.MainCtrl);
partyApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/all-orders', {
            templateUrl: '../../views/all-orders.html',
            controller: 'MainCtrl'
        }).
            when('/change-order', {
            templateUrl: '../../views/change-order.html',
            controller: 'MainCtrl'
        }).
            when('/order-now', {
            templateUrl: '../../views/main.html',
            controller: 'MainCtrl'
        }).
            otherwise({
            redirectTo: '/order-now'
        });
    }]);
