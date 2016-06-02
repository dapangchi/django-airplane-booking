angular.module('ascentApp')
  .controller('AccountActivationController', function ($scope, $http, $cookies, $window, $routeParams, $compile, $filter, AccountActivate, localStorageService) {
    $scope.account = {
      "code": $routeParams.code,
      "email": $routeParams.email
    }
    AccountActivate.activate($scope.account, function(data) {
      $window.location.href = '/profile/#/edit';
    });
  });
