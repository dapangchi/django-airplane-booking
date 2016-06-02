angular.module('ascentApp')
  .controller('EditAccountController', function ($scope, $http, $cookies, $window, $routeParams, $compile, $filter, cookieStore, Account, Country) {
    $scope.account = {}
    $scope.saved = false;

    Country.query(function(data) {
      $scope.countries = data.countries;
    });

    Account.get({id: cookieStore.get('user')}, function(data) {
      $scope.account = {
        "customerId": parseInt(cookieStore.get('user')),
        "customerInfo" : {
          "title": data.title,
          "firstName" : data.firstName,
          "lastName": data.lastName,
          "countryId": data.countryId,
          "address" : data.address,
          "address2": data.address2,
          "city": data.city,
          "zipCode" : data.zipCode
        }
      }
    });

    $scope.update = function() {
      if ($scope.updateAccount.$valid == true) {
        Account.save($scope.account, function(data) {
          Account.get({id: cookieStore.get('user')}, function(data) {
            cookieStore.put('userMail', data.firstName + " " + data.lastName, { path: "/" });
          });
          $scope.saved = true;
        });
      }
    }
  });
