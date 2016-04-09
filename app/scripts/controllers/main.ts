/// <reference path="../app.ts" />

'use strict';

module tdmApp {
  export interface IMainScope extends ng.IScope {
    onPlaceOrder: Function;
    onReset: Function;
    pizza: string;
    cold: string;
   
  }

  export class MainCtrl {

    constructor (private $scope: IMainScope) {
  
      $scope.onPlaceOrder = function() {
        console.log($scope.pizza);
        console.log($scope.cold);
    }
     $scope.onReset = function() {
        $scope.pizza = "";
        $scope.cold = "";
    }
    
    }
   
  }
}

var partyApp = angular.module('tdmApp',["ngRoute"])
  .controller('MainCtrl', tdmApp.MainCtrl);

partyApp.config(['$routeProvider',
  function($routeProvider) {
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
};