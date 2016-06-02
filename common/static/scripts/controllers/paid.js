angular.module('ascentApp')
  .controller('PaidController', function ($scope, $http, $cookies, $window, $routeParams, $compile, $filter, Passanger, OfferSubmit) {
    $scope.offer = {};
    $scope.offer.id = $routeParams.id;
    OfferSubmit.save({id: $scope.offer.id}, function(data) {
    	$scope.requestId = data.tripRequestId;
      // $window.location.href = '/flights/requests/' + data.tripRequestId + '/';
    })
  });
