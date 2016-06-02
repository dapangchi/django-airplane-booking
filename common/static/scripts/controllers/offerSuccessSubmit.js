angular.module('ascentApp')
  .controller('OfferSuccessSubmitController', function ($scope, $http, $cookies, $cookieStore, $window, $routeParams, $compile, $filter, localStorageService, Baggage, Category, UpdateTrip, Flight) {

    $scope.charter = {};
    $scope.charter.id = $routeParams.id;

    // Flight.get({ id: $scope.charter.id }, function(data) {
    //   $scope.flight = data;
    // });
    //
    // Category.get({id: $scope.charter.id }, function(data) {
    //   $scope.categories = data.categories;
    // });

    $scope.submit = function() {
      UpdateTrip.update($scope.additional, function(done) {
        $window.location.href = '/request-for-offer/';
      });
    }

  });
