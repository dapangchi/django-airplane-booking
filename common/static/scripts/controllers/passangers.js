angular.module('ascentApp')
  .controller('PassangersController', function ($scope, $http, $cookies, $window, $routeParams, $compile, $filter, Passanger) {
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

    $scope.remove=function(item){
      var index=$scope.request.passengers.indexOf(item)
      $scope.request.passengers.splice(index,1);
    }

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

    $scope.submit = function(valid) {
      if(valid) {
        Passanger.create($scope.request, function(data) {
          $window.location.href = '/flights/booking/#/finish/' + $routeParams.id;
        });
      }
    }
  });
