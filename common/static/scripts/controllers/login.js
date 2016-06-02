angular.module('ascentApp')
.controller('LoginController', function ($scope, $http, $log, $rootScope, $cookies, $cookieStore, $window, $routeParams, $compile, $filter, Login, Account, cookieStore, Logout) {
  $reloadRoot = $window.location.href;
  $scope.account = {}
  $scope.login = {
    userName: "",
    password: "",
  }

  $scope.$watch(function() { return cookieStore.get('userMail'); }, function() {
    $scope.userMail = cookieStore.get('userMail');
  });

  $scope.$watch(function() { return $cookieStore.get('logged-in'); }, function() {
      // $log.log('Index cookie watch: ' + $cookieStore.get('logged-in'))
      if($cookieStore.get('logged-in') == true) {
        $scope.showLogin = false;
      } else {
        $scope.showLogin = true;
      }
    });

  $scope.create = function() {
    if ($scope.loginForm.$valid) {
      Login.login($scope.login, function(data, headers) {
        cookieStore.put('logged-in', true, { path: "/" });
        cookieStore.put('JSESSIONID', headers('SESSIONID'), { path: "/" });
        cookieStore.put('user', data.userId, { path: "/" });
        $scope.user = {
          email: data.userName,
          id: data.userId,
        }
        Account.get({id: cookieStore.get('user')}, function(data) {
          cookieStore.put('userMail', data.firstName + " " + data.lastName, { path: "/" });
          // $window.location.href = '/';
          $window.location.href = $reloadRoot;
        });
      });
    }
  }

  $scope.logout = function() {
    Logout.logout({}, function(data, headers) {
      cookieStore.put('logged-in', false, { path: "/" });
      cookieStore.remove('JSESSIONID', false, { path: "/" });
      cookieStore.remove('user', false, { path: "/" });
      cookieStore.remove('userMail', false, { path: "/" });
      $window.location.href = '/';
    });
  }
})
