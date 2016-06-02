angular.module('ascentApp')
  .controller('FinishController', function ($scope, $http, $cookies, $window, $routeParams, $compile, $filter, Offer, Flight) {
    Offer.save({id: $routeParams.id}, function(data) {
      $scope.offer = data;
      $scope.flightNO = data.tripRequestId;
      Flight.query({id: data.tripRequestId}, function(flight) {
        $scope.flight = flight;
      });
    });
  });
