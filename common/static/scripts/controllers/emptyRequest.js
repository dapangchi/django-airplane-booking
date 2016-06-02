angular.module('ascentApp')
.controller('EmptyRequestController', function ($scope, $http, $timeout, $cookies, $cookieStore, $window, $routeParams, $compile, $filter, ngDialog, Login, FancyboxService, cookieStore, localStorageService, Baggage, Category, UpdateTrip, Flight, Account) {
  Flight.get({id: $routeParams.id}, function(data) {
    $scope.charter = data;
    $scope.additional = {}
    $scope.additional.id = $scope.charter.id;

    $scope.priceSwitch = $scope.priceDrop[0].code;

    Category.get({id: $scope.charter.id }, function(data) {
      $scope.categories = data.categories;
    })

    Baggage.query(function(data) {
      $scope.baggage = data.baggageTypes;
    })
  });

  $scope.signed = cookieStore.get('logged-in');

  $scope.login = {
    userName: "",
    password: "",
  }

  $scope.gallery = true;
  $scope.floorplan = false;

  $scope.switchGallery = function(value) {
    if(value == 'gallery') {
      $scope.gallery = true;
      $scope.floorplan = false;
    } else {
      $scope.gallery = false;
      $scope.floorplan = true;
    }
  }

  $scope.priceDrop = [
  {
    code: 'CHF',
    name: 'Price (CHF)'
  },
  {
    code: 'EUR',
    name: 'Price (€)'
  },
  {
    code: 'USD',
    name: 'Price ($)'
  },
  {
    code: 'GBP',
    name: 'Price (£)'
  }
  ];

  $scope.loginPopup = function(phone) {
  }

  $scope.loginPopup = function(phone) {
    if ($scope.updateQuote.$valid == true) {
      $scope.dialog = ngDialog.open({ template: viewsPath + 'views/account/modal.html', scope: $scope });
    }
  }


  $scope.processLogin = function(valid) {
    if (valid) {
      Login.login($scope.login, function(data, headers) {
        cookieStore.put('logged-in', true, { path: "/" });
        cookieStore.put('JSESSIONID', headers('SESSIONID'), { path: "/" });
        cookieStore.put('user', data.userId, { path: "/" });
        $scope.user = {
          email: data.userName,
          id: data.userId,
        }
        ngDialog.close($scope.dialog.id);

        $timeout(function () {
          Account.get({id: data.userId}, function(data) {
            cookieStore.put('userMail', data.firstName + " " + data.lastName, { path: "/" });
            // $window.location.reload();

            $timeout(function (){
              $scope.submit();
            }, 500);
            
          });
        }, 500);
      });
    }
  }

  $scope.submit = function() {
    if ($scope.updateQuote.$valid == true && $cookieStore.get('logged-in') == true) {
      UpdateTrip.update($scope.additional, function(done) {
        $window.location.replace('/request/#/overview/' + $scope.charter.id);
      });
    }
  }


  $scope.tooltipShown = false;

  $scope.showTooltip = function() {
    $scope.tooltipShown = true;
  }

  $scope.hideTooltip = function() {
    $scope.tooltipShown = false;
  }

});
