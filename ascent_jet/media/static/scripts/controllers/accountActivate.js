angular.module('ascentApp')
  .controller('AccountActivateController', function ($scope, $http, $cookies, $window, $routeParams, $compile, $filter, AccountActivate, localStorageService) {
    $scope.account = {}
    $scope.email = localStorageService.get('email');
  });
