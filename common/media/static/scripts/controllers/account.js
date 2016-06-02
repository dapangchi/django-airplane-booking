angular.module('ascentApp')
.controller('AccountController', function ($scope, $http, $cookies, $window, $routeParams, $compile, $filter, Account, Country, AccountActivate, localStorageService) {
  $scope.account = {}
  $scope.fake = {};
  Country.query(function(data) {
    $scope.countries = data.countries;
  })

  $scope.create = function(isValid) {
    if(isValid) {
      localStorageService.set('email', $scope.account.userInfo.userName);
      Account.create($scope.account, function(data) {
        $window.location.href = '/account/#/activate/';
      });
    }
  }
});
