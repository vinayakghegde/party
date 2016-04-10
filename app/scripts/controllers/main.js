/// <reference path="../app.ts" />
'use strict';
var tdmApp;
(function (tdmApp) {
    var MainCtrl = (function () {
        function MainCtrl($scope, $http, $location) {
            this.$scope = $scope;
            this.$http = $http;
            this.$location = $location;
            $http.get("/api/products").then(function (response) {
                $scope.myOrder = response.data;
                if ($scope.myOrder) {
                    $location.path('/confirmation');
                }
            });
            $scope.onPlaceOrder = function () {
                if ($scope.pizza && $scope.cold) {
                    $http.post("/api/products", {
                        pizza: $scope.pizza,
                        cold: $scope.cold,
                        name: $scope.name,
                        id: $scope.id
                    }, { headers: { 'Content-Type': 'application/json; charset=utf-8' } }).success(function (res) {
                    }).error(function () {
                    });
                }
            };
            $scope.onReset = function () {
                $scope.pizza = "";
                $scope.cold = "";
            };
        }
        return MainCtrl;
    }());
    tdmApp.MainCtrl = MainCtrl;
    var AllOrderCtrl = (function () {
        function AllOrderCtrl($scope, $http) {
            this.$scope = $scope;
            this.$http = $http;
            $http.get("/api/products").then(function (response) {
                $scope.order = response.data;
            });
        }
        return AllOrderCtrl;
    }());
    tdmApp.AllOrderCtrl = AllOrderCtrl;
    var ChangeOrderCtrl = (function () {
        function ChangeOrderCtrl($scope, $http) {
            this.$scope = $scope;
            this.$http = $http;
            $http.get("/api/products").then(function (response) {
                // TODO: change this
                $scope.pizza = response.data[0].pizza;
                $scope.cold = response.data[0].cold;
            });
            $scope.onChangeOrder = function () {
                if ($scope.pizza && $scope.cold) {
                    $http.post("/api/products", {
                        pizza: $scope.pizza,
                        cold: $scope.cold,
                        name: $scope.name,
                        id: $scope.id
                    }, { headers: { 'Content-Type': 'application/json; charset=utf-8' } }).success(function (res) {
                    }).error(function () {
                    });
                }
            };
        }
        return ChangeOrderCtrl;
    }());
    tdmApp.ChangeOrderCtrl = ChangeOrderCtrl;
})(tdmApp || (tdmApp = {}));
var partyApp = angular.module('tdmApp', ["ngRoute"])
    .controller('MainCtrl', tdmApp.MainCtrl);
partyApp.controller('allOrderCtrl', tdmApp.AllOrderCtrl);
partyApp.controller('changeOrderCtrl', tdmApp.ChangeOrderCtrl);
partyApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/all-orders', {
            templateUrl: '../../views/all-orders.html',
            controller: 'allOrderCtrl'
        }).
            when('/change-order', {
            templateUrl: '../../views/change-order.html',
            controller: 'changeOrderCtrl'
        }).
            when('/order-now', {
            templateUrl: '../../views/main.html',
            controller: 'MainCtrl'
        }).
            when('/confirmation', {
            templateUrl: '../../views/confirmation.html',
            controller: 'MainCtrl'
        }).
            otherwise({
            redirectTo: '/order-now'
        });
    }]);
partyApp.factory("authentication", ["$http", "$q", "$window", authentication]);
function authentication($http, $q, $window) {
    var user;
    function login() {
        // check if the user already exists for this session
        if (user) {
            return $q.when(user); // resolve with given value, necessary because calling function expects a promise.
        }
        var url = 'api/users/current/';
        return $http.get(url).then(function (result) {
            var result = result.data;
            user = {
                id: result.UserId,
                displayName: result.DisplayName,
                guid: result.ADGuid,
                isAdmin: result.IsAdmin
            };
            addUserToStorage();
            console.log("user created.");
            return $q.when(user);
        });
    }
    function addUserToStorage() {
        $window.sessionStorage["user"] = JSON.stringify(user);
    }
    function getUser() {
        return user;
    }
    function init() {
        if ($window.sessionStorage["user"]) {
            user = JSON.parse($window.sessionStorage["user"]);
        }
    }
    init();
    return {
        user: user,
        init: init,
        addUserToStorage: addUserToStorage,
        login: login,
        getUser: getUser
    };
}
;
