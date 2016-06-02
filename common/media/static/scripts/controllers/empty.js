angular.module('ascentApp')
  .controller('EmptyController', function ($scope, $http, $cookies, $cookieStore, $window, $routeParams, $compile, $filter, Empty, Quote, Airport, Login) {
    $scope.query = {
      legs: [
        {
          from: '',
          to: '',
          date: null,
          time: null,
          passengers: ''
        }
      ]
    }
    $scope.return = [
      {
        leg: false
      }
    ];

    $scope.addRow = function() {
      $scope.query.legs.push(
        {
          from: '',
          to: '',
          date: null,
          time: null,
          passengers: ''
        }
      );
      $scope.return.push(
        {
          leg: false
        }
      )
    }

    $scope.delete = function(index) {
      $scope.query.legs.splice($scope.query.legs.indexOf(index));
      $scope.return.splice($scope.return.indexOf(index));
    }

    $scope.request = function() {
      request = {};
      request.legs = [];
      angular.forEach($scope.query.legs, function(v,i) {
        request.legs.push({
          from: v.from,
          to: v.to,
          date: $filter('date')(v.date, 'dd/MM/yyyy'),
          time: $filter('date')(v.time, 'HH:mm'),
          passengers: v.passengers
        });
      });
      Quote.save(request, function(data) {
        if(data.id !== null) {
          $cookieStore.put('quote', data);
          $window.location.href = '/charter-request/';
        } else {
          $scope.noCharter = true;
        }
      });
    }

    $scope.airportOptions = {
      options: {
        html: true,
        focusOpen: false,
        onlySelectValid: true,
        source: function (request, response) {
          var result = '';
          Airport.search(
            {
              "searchString": request.term
            }, function(data) {
              result = data;
            }
          );
          data = $scope.airportOptions.methods.filter(result, request.term);
          response(data);
        }
      },
      methods: {}
    };

    $scope.activeTab = 'quote';
    $scope.switchTabTo = function (tabId) {
      $scope.activeTab = tabId;
    };
  });
