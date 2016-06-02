angular.module('ascentApp')
.controller('CharterRequestController', function ($scope, $http, $timeout, $cookies, $cookieStore, $window, $location, $routeParams, $routeParams, $compile, $filter, Login, ngDialog, FancyboxService, cookieStore, localStorageService, Baggage, Category, UpdateTrip, Flight, Account) {
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

  $scope.tooltipShown = false;

  $scope.showTooltip = function() {
    $scope.tooltipShown = true;
  }

  $scope.hideTooltip = function() {
    $scope.tooltipShown = false;
  }

  $scope.signed = cookieStore.get('logged-in');

  $scope.login = {
    userName: "",
    password: ""
  };

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

  $scope.changePrice = function(item, model) {
    $scope.priceSwitch = model;
  }

  $scope.loginPopup = function(phone) {
    if ($scope.updateQuote.$valid == true) {
      $scope.dialog = ngDialog.open({ template: viewsPath + 'views/account/modal.html', scope: $scope });
    }
  }

  $scope.popupInfo = {
    title: 'Title...',
    content: 'Contents....',
    placement: 'left',
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

  AscentJet.switchSmallGallery();

  $scope.showGalleryContainer = function(elm, cont) {
    elm.target.closest('div.images').hide();
    elm.target.closest('div.images').find(cont).show();
  }





});
