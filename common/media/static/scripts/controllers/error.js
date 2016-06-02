angular.module('ascentApp')
  .controller('ErrorController', function ($scope, $http, $cookies, $window, $routeParams, $compile, $filter, Passanger) {
    $scope.request = {};
    $scope.request.offerId = $routeParams.id;
    $scope.request.passengers = [{
      title: 'Mr',
      firstName: '',
      lastName: '',
      passport: '',
      validMonth: '',
      validYear: ''
    }];

    $scope.addRow = function() {
      $scope.request.passengers.push(
        {
          title: 'Mr',
          firstName: '',
          lastName: '',
          passport: '',
          validMonth: '',
          validYear: ''
        }
      );
    }

    $scope.submit = function() {
      Passanger.create($scope.request, function(data) {
        $window.location.href = '/flights/booking/#/finish/' + $routeParams.id;
      });
    }
  });
