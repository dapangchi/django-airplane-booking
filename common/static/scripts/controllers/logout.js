angular.module('ascentApp')
  .controller('LogoutController', function ($scope, $http, $cookies, $cookieStore, $window, $routeParams, $compile, $filter, Logout, cookieStore) {

    Logout.logout({}, function(data, headers) {
      cookieStore.put('logged-in', false, { path: "/" });
      cookieStore.remove('JSESSIONID', false, { path: "/" });
      cookieStore.remove('user', false, { path: "/" });
      $window.location.href = '/';
    });

  });
