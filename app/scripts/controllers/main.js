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
                $scope.Isvisible = true;
                $scope.myOrder = response.data;
                if ($scope.myOrder && $scope.myOrder.length) {
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
                        $location.path('/confirmation');
                    }).error(function () {
                        $location.path('/error');
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
                $scope.order = shuffle(response.data);
            });
            $scope.checkVeg = function (order) {
                var s = order.pizza.split("_")[0] || "";
                return (s === "v");
            };
        }
        return AllOrderCtrl;
    }());
    tdmApp.AllOrderCtrl = AllOrderCtrl;
    var GroupOrderCtrl = (function () {
        function GroupOrderCtrl($scope, $http) {
            this.$scope = $scope;
            this.$http = $http;
            $http.get("/api/products").then(function (response) {
                $scope.order = response.data;
                $scope.order.sort();
            });
            $scope.checkVeg = function (order) {
                var s = order.pizza.split("_")[0] || "";
                return (s === "v");
            };
        }
        return GroupOrderCtrl;
    }());
    tdmApp.GroupOrderCtrl = GroupOrderCtrl;
    var ChangeOrderCtrl = (function () {
        function ChangeOrderCtrl($scope, $http, $location) {
            this.$scope = $scope;
            this.$http = $http;
            this.$location = $location;
            $http.get("/api/products").then(function (response) {
                $scope.myOrder = response.data;
                if (!($scope.myOrder && $scope.myOrder.length)) {
                    $location.path('/oreder-now');
                }
                else {
                    $scope.pizza = response.data[0].pizza;
                    $scope.cold = response.data[0].cold;
                }
            });
            $scope.onChangeOrder = function () {
                if ($scope.pizza && $scope.cold) {
                    $http.post("/api/products", {
                        pizza: $scope.pizza,
                        cold: $scope.cold,
                        name: $scope.name,
                        id: $scope.id
                    }, { headers: { 'Content-Type': 'application/json; charset=utf-8' } }).success(function (res) {
                        $location.path('/confirmation');
                    }).error(function () {
                        $location.path('/error');
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
partyApp.controller('groupOrderCtrl', tdmApp.GroupOrderCtrl);
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
            when('/error', {
            templateUrl: '../../views/error.html',
            controller: 'MainCtrl'
        }).
            when('/grouped-orders', {
            templateUrl: '../../views/grouped-orders.html',
            controller: 'groupOrderCtrl'
        }).
            otherwise({
            redirectTo: '/order-now'
        });
    }]);
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
partyApp.filter("formatstring", function () {
    return function (input) { return input.split("_")[1]; };
});
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
