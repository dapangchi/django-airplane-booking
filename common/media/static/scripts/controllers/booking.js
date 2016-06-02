angular.module('ascentApp')
  .controller('BookingController', function ($scope, $http, $cookies, $cookieStore, $window, $routeParams, $compile, $filter, Baggage, Category, UpdateTrip, Flight) {
    Flight.query(function(data) {
      $scope.flights = data.requests;
      $scope.details = $filter('filter')($scope.flights, { status: '!' + 'BOOKED' }, true)[0]
      $scope.selected = $scope.details.id
    });

    $scope.show = function(id) {
      Flight.get({ id: id }, function(data) {
        $scope.selected = id;
        $scope.details = data;
      })
    }
  });
