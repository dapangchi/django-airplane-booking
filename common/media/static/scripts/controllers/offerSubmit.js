angular.module('ascentApp')
  .controller('OfferSubmitController', function ($scope, $http, $cookies, $cookieStore, $window, $routeParams, $compile, $filter, localStorageService, Baggage, Category, UpdateTrip, Flight, OfferSave) {

    $window.scrollTo(0,0); 

    $scope.charter = localStorageService.get('quote');

    Flight.get({ id: $routeParams.id }, function(data) {
      $scope.flight = data;
      Category.get({id: $scope.flight.id }, function(data) {
        $scope.categories = data.categories;
      });
    });

    $scope.save = function() {
      OfferSave.save({id: $routeParams.id}, function(data) {
        $window.location.href = '/request/#/success/' + $routeParams.id;
      });
    }

  });
