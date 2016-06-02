'use strict';

var viewsPath = '/media/static/'

angular
  .module('ascentApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.autocomplete',
    'ui.date',
    'checklist-model',
    'ngBiscuit',
    'uiGmapgoogle-maps',
    'LocalStorageModule',
    'ui.select',
    'ngMask',
    'ngDialog',
    'webUI',
    'equalModule',
    'slick',
    'ng.shims.placeholder',
    'google.places'
  ], function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
  })
  .config(function($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
  })
  .config(function ($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: viewsPath + 'views/search.html',
      controller: 'SearchController'
    })
    .when('/quote', {
      templateUrl: viewsPath + 'views/search.html',
      controller: 'SearchController'
    })
    .when('/empty', {
      templateUrl: viewsPath + 'views/search.html',
      controller: 'SearchController'
    })
    .when('/charter/:id', {
      templateUrl: viewsPath + 'views/charter/new.html',
      controller: 'CharterRequestController'
    })
    .when('/empty-leg/:id', {
      templateUrl: viewsPath + 'views/charter/empty.html',
      controller: 'EmptyRequestController'
    })
    .when('/overview/:id', {
      templateUrl: viewsPath + 'views/charter/request.html',
      controller: 'OfferSubmitController'
    })
    .when('/success/:id', {
      templateUrl: viewsPath + 'views/charter/success.html',
      controller: 'OfferSuccessSubmitController'
    })
    .when('/passangers/:id', {
      templateUrl: viewsPath + 'views/booking/passangers.html',
      controller: 'PassangersController'
    })
    .when('/error/:id', {
      templateUrl: viewsPath + 'views/booking/error.html',
      controller: 'ErrorController'
    })
    .when('/paid/:id', {
      templateUrl: viewsPath + 'views/booking/paid.html',
      controller: 'PaidController'
    })
    .when('/activation/:code/:email', {
      templateUrl: viewsPath + 'views/account/activation.html',
      controller: 'AccountActivationController'
    })
    .when('/edit', {
      templateUrl: viewsPath + 'views/account/edit.html',
      controller: 'EditAccountController'
    })
    .when('/new', {
      templateUrl: viewsPath + 'views/account/new.html',
      controller: 'AccountController'
    })
    .when('/activate', {
      templateUrl: viewsPath + 'views/account/activate.html',
      controller: 'AccountActivateController'
    })
    .when('/password', {
      templateUrl: viewsPath + 'views/account/password.html',
      controller: 'PasswordController'
    })
    .when('/booked', {
      templateUrl: viewsPath + 'views/booking/index.html',
      controller: 'BookingController'
    })
    .when('/password-changed', {
      templateUrl: viewsPath + 'views/account/password-changed.html'
    })
    .when('/finish/:id', {
      templateUrl: viewsPath + 'views/booking/finish.html',
      controller: 'FinishController'
    })
    .when('/logout', {
      // templateUrl: viewsPath + 'views/booking/finish.html',
      controller: 'LogoutController'
    })
  })
  .factory('FancyboxService', function() {
    return {
      open: function(selector) {
        $.fancybox.open($(selector).html());
      },
      close: function() {
        $.fancybox.close();
      }
    };
  })
  .config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
      /*key: 'AIzaSyA3cJ5T6MZEWtMiyelStmvig_qwxgKe10A',*/
      key: 'AIzaSyC65XA_7pW63F5p5Zk7k-mMbBoOSYsUNCY',
      v: '3.17',
      libraries: 'weather,geometry,visualization'
    });
  })
  .config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider, $cookieStore) {
    $httpProvider.interceptors.push(function($q, $window, cookieStore, $cookies) {
      return {
        'request': function(config){
            return config;
        },
        'response': function(response) {
            return response;
        },
        'responseError': function(response) {
          if(response.status == 403 || response.status == 401  || response.status == 405) {
            cookieStore.put('logged-in', false, { path: "/" });
            cookieStore.remove('JSESSIONID', false, { path: "/" });
            cookieStore.remove('user', false, { path: "/" });
            cookieStore.remove('userMail', false, { path: "/" });
            //$window.$scope.$broadcast('loginFailed');
            //$window.location = '/';
            return response;
          }
        }
      };
    });
    $httpProvider.defaults.withCredentials = true;
    /*$httpProvider.defaults.useXDomain = true;*/
    $httpProvider.defaults.headers['Access-Control-Allow-Origin'] = 'http://95.138.181.224:8000/';
    /*$httpProvider.defaults.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS, PUT';*/
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.post = {
        'Content-Type': 'application/json'
    }
    // $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    // $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    // $httpProvider.defaults.headers.patch = {
    //   'Content-Type': 'application/json;charset=utf-8'
    // };
    // $httpProvider.defaults.headers.post = {
    //   'Content-Type': 'application/json;charset=utf-8'
    // };
  }]);
