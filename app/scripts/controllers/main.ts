/// <reference path="../app.ts" />

'use strict';

module tdmApp {
  export interface IMainScope extends ng.IScope {
    onPlaceOrder: Function;
    onReset: Function;
    onChangeOrder: Function;
    checkVeg: Function;
    pizza: string;
    cold: string;
    name: string;
    id: string;
    getOrders: Function;
    order: any;
    myOrder: any;
    Isvisible: boolean;
  }

  export class MainCtrl {

    constructor (private $scope: IMainScope, private $http: ng.IHttpService, private $location: ng.ILocationService) {
       
       // TODO: JSONP
       // pass imgUrl $scope.ImgUrl = http://jdfgkdgk+firstName+lastName
       
        $http.get("/api/products").then(
              function(response){
                  $scope.Isvisible = true;
                  $scope.myOrder = response.data;
                  if($scope.myOrder && $scope.myOrder.length){
                      $location.path('/confirmation');
                  }
              }
          );
          
        
        
      $scope.onPlaceOrder = function() {
        
        if($scope.pizza && $scope.cold){
        $http.post("/api/products", {
            pizza: $scope.pizza,
            cold: $scope.cold,
            name: $scope.name,
            id: $scope.id         
        }, {headers: {'Content-Type':'application/json; charset=utf-8'}}).success(function(res){
            $location.path('/confirmation');
        }).error(function(){
            $location.path('/error');
        });
    }
    }
     $scope.onReset = function() {
        $scope.pizza = "";
        $scope.cold = "";
    }
    
    
    
    }
   
  }
  
  export class AllOrderCtrl{
      constructor(private $scope: IMainScope, private $http: ng.IHttpService){
           $http.get("/api/products").then(
              function(response){
                  $scope.order = shuffle(response.data);
              }
          );
            $scope.checkVeg = function(order){
        var s = order.pizza.split("_")[0] || "";
        return (s === "v");
    }
      }
      
  }
  
  export class GroupOrderCtrl{
      constructor(private $scope: IMainScope, private $http: ng.IHttpService){
           $http.get("/api/products").then(
              function(response){
                  $scope.order = response.data;
                  $scope.order.sort();
              });
            $scope.checkVeg = function(order){
        var s = order.pizza.split("_")[0] || "";
        return (s === "v");
    }
      }
      
  }
  
  export class ChangeOrderCtrl{
      constructor(private $scope: IMainScope, private $http: ng.IHttpService,private $location: ng.ILocationService) {
          $http.get("/api/products").then(
              function(response){
                  $scope.myOrder = response.data;
                  if(!($scope.myOrder && $scope.myOrder.length)){
                      $location.path('/oreder-now');
                  }else{
                        $scope.pizza = response.data[0].pizza;
                   $scope.cold = response.data[0].cold;
                  }
              }
          );
          
           $scope.onChangeOrder = function() {
        
        if($scope.pizza && $scope.cold){
        $http.post("/api/products", {
            pizza: $scope.pizza,
            cold: $scope.cold,
            name: $scope.name,
            id: $scope.id
        }, {headers: {'Content-Type':'application/json; charset=utf-8'}}).success(function(res){
             $location.path('/confirmation');
        }).error(function(){
            $location.path('/error');
        });
    }
    } }
  }
}

var partyApp = angular.module('tdmApp',["ngRoute"])
  .controller('MainCtrl', tdmApp.MainCtrl);
  
  partyApp.controller('allOrderCtrl', tdmApp.AllOrderCtrl);
  
  partyApp.controller('changeOrderCtrl', tdmApp.ChangeOrderCtrl);
  
  partyApp.controller('groupOrderCtrl', tdmApp.GroupOrderCtrl);

partyApp.config(['$routeProvider',
  function($routeProvider) {
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

 
  partyApp.filter("formatstring", function(){
      return function(input){ return input.split("_")[1];}
  });
  
   partyApp.filter("securityMessage", function(){
      return function(input){ return input.split("_")[1];} // compare iis user and ordered user
  });
  
  