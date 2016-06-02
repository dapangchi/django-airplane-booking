angular.module('ascentApp')
  .controller('PasswordController', function ($scope, $http, $cookies, $window, $routeParams, $compile, $filter, Password) {
    $scope.account = {}
    $scope.send = function(isValid) {
      if(isValid) {
        Password.save($scope.account, function(data) {
          $scope.response = data;
          $window.location.href = '/account/#/password-changed';
        });
      }
    }
  });
