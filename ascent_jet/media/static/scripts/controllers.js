angular.module('ascentApp')
.controller('AccountController', function ($scope, $http, $cookies, $window, $routeParams, $compile, $filter, Account, Country, AccountActivate, localStorageService) {
  $scope.account = {}
  $scope.fake = {};
  Country.query(function(data) {
    $scope.countries = data.countries;
  })

  $scope.create = function(isValid) {
    if(isValid) {
      localStorageService.set('email', $scope.account.userInfo.userName);
      Account.create($scope.account, function(data) {
        $window.location.href = '/account/#/activate/';
      });
    }
  }
});

angular.module('ascentApp')
  .controller('AccountActivateController', function ($scope, $http, $cookies, $window, $routeParams, $compile, $filter, AccountActivate, localStorageService) {
    $scope.account = {}
    $scope.email = localStorageService.get('email');
  });

angular.module('ascentApp')
  .controller('AccountActivationController', function ($scope, $http, $cookies, $window, $routeParams, $compile, $filter, AccountActivate, localStorageService) {
    $scope.account = {
      "code": $routeParams.code,
      "email": $routeParams.email
    }
    AccountActivate.activate($scope.account, function(data) {
      $window.location.href = '/profile/#/edit';
    });
  });

angular.module('ascentApp')
  .controller('BookingController', function ($scope, $http, $cookies, $cookieStore, $window, $routeParams, $compile, $filter, Baggage, Category, UpdateTrip, Flight) {
    Flight.query(function(data) {
      $scope.flights = data.requests;
      $scope.details = $filter('filter')($scope.flights, { status: '!' + 'BOOKED' }, true)[0]
      $scope.selected = $scope.details.id
    });

    $scope.show = function(id) {
      Flight.get({ id: id }, function(data) {
        $scope.selected = id;
        $scope.details = data;
      })
    }
  });

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

angular.module('ascentApp')
  .controller('FinishController', function ($scope, $http, $cookies, $window, $routeParams, $compile, $filter, Offer, Flight) {
    Offer.save({id: $routeParams.id}, function(data) {
      $scope.offer = data;
      $scope.flightNO = data.tripRequestId;
      Flight.query({id: data.tripRequestId}, function(flight) {
        $scope.flight = flight;
      });
    });
  });

angular.module('ascentApp')
.controller('LoginController', function ($scope, $http, $log, $rootScope, $cookies, $cookieStore, $window, $routeParams, $compile, $filter, Login, Account, cookieStore, Logout) {
  $reloadRoot = $window.location.href;
  $scope.account = {}
  $scope.login = {
    userName: "",
    password: "",
  }

  $scope.$watch(function() { return cookieStore.get('userMail'); }, function() {
    $scope.userMail = cookieStore.get('userMail');
  });

  $scope.$watch(function() { return $cookieStore.get('logged-in'); }, function() {
      // $log.log('Index cookie watch: ' + $cookieStore.get('logged-in'))
      if($cookieStore.get('logged-in') == true) {
        $scope.showLogin = false;
      } else {
        $scope.showLogin = true;
      }
    });

  $scope.create = function() {
    if ($scope.loginForm.$valid) {
      Login.login($scope.login, function(data, headers) {
        cookieStore.put('logged-in', true, { path: "/" });
        cookieStore.put('JSESSIONID', headers('SESSIONID'), { path: "/" });
        cookieStore.put('user', data.userId, { path: "/" });
        $scope.user = {
          email: data.userName,
          id: data.userId,
        }
        Account.get({id: cookieStore.get('user')}, function(data) {
          cookieStore.put('userMail', data.firstName + " " + data.lastName, { path: "/" });
          // $window.location.href = '/';
          $window.location.href = $reloadRoot;
        });
      });
    }
  }

  $scope.logout = function() {
    Logout.logout({}, function(data, headers) {
      cookieStore.put('logged-in', false, { path: "/" });
      cookieStore.remove('JSESSIONID', false, { path: "/" });
      cookieStore.remove('user', false, { path: "/" });
      cookieStore.remove('userMail', false, { path: "/" });
      $window.location.href = '/';
    });
  }
})

angular.module('ascentApp')
  .controller('LogoutController', function ($scope, $http, $cookies, $cookieStore, $window, $routeParams, $compile, $filter, Logout, cookieStore) {

    Logout.logout({}, function(data, headers) {
      cookieStore.put('logged-in', false, { path: "/" });
      cookieStore.remove('JSESSIONID', false, { path: "/" });
      cookieStore.remove('user', false, { path: "/" });
      $window.location.href = '/';
    });

  });

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

angular.module('ascentApp')
  .controller('PaidController', function ($scope, $http, $cookies, $window, $routeParams, $compile, $filter, Passanger, OfferSubmit) {
    $scope.offer = {};
    $scope.offer.id = $routeParams.id;
    OfferSubmit.save({id: $scope.offer.id}, function(data) {
    	$scope.requestId = data.tripRequestId;
      // $window.location.href = '/flights/requests/' + data.tripRequestId + '/';
    })
  });

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

angular.module('ascentApp')
  .controller('PasswordController', function ($scope, $http, $cookies, $window, $routeParams, $compile, $filter, Password) {
    $scope.account = {}
    $scope.send = function(isValid) {
      if(isValid) {
        Password.save($scope.account, function(data) {
          $scope.response = data;
          $window.location.href = '/account/#/password-changed';
        });
      }
    }
  });

angular.module('ascentApp')
  .controller('SearchController', function ($scope, $http, $cookies, $cookieStore, cookieStore, $timeout, $window, $routeParams, $compile, $filter, $location, localStorageService, Empty, EmptyReserve, Quote, Airport, uiGmapGoogleMapApi, uiGmapIsReady, Country) {

    var path = $location.path();
    var url = $window.location.pathname;

    $scope.cleared = true;

    if(url == '/') {
      $scope.home = true;
    }
    else {
      $scope.home = false;
    }

    $scope.empty = {
      airportFrom: '',
      airportTo: '',
      airportFromF: '',
      airportToF: '',
      flightStart: null,
      time: null,
      passengers: null,
      page: 1,
      pageSize: 5
    }
    if(url == '/get-a-quote/') {
      $scope.empty = localStorageService.get('emptyLegQueryInfo') != null ? localStorageService.get('emptyLegQueryInfo') : $scope.empty;
      if (request = localStorageService.get('emptyLegQuery') != null) {
        request = localStorageService.get('emptyLegQuery');
        $scope.cleared = false;
      } else {
        request = { page: 1, pageSize: 10 };
      };

      Empty.save(request, function(data) {
        localStorageService.set('emptyLegQuery', null);
        localStorageService.set('emptyLegQueryInfo', null);
        $scope.emptyResults = {};
        $scope.emptyResults.count = data.count;
        $scope.emptyResults.legs = [];
        // uiGmapIsReady.promise().then(function() {
          angular.forEach(data.legs, function(i, v) {
            var bound = new google.maps.LatLngBounds();
            bound.extend( new google.maps.LatLng(i.airportFromObj.latitude, i.airportFromObj.longitude) );
            bound.extend( new google.maps.LatLng(i.airportToObj.latitude, i.airportToObj.longitude) );
            center = bound.getCenter();
            obj = i;
            obj.markers = [];
            obj.bounds = {};
            obj.line = {};
            obj.bounds.northeast = {
              longitude: i.airportFromObj.longitude,
              latitude: i.airportFromObj.latitude
            };
            obj.bounds.southwest = {
              longitude: i.airportToObj.longitude,
              latitude: i.airportToObj.latitude
            };
            obj.markers.push({
              longitude: i.airportFromObj.longitude,
              latitude: i.airportFromObj.latitude,
              id: 0,
              icon: '/media/static/images/marker.png',
            });
            obj.markers.push({
              longitude: i.airportToObj.longitude,
              latitude: i.airportToObj.latitude,
              id: 1,
              icon: '/media/static/images/marker.png',
            });
            obj.marker = {
              icon: {
                url: '/media/static/images/marker.png',
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(12, 12)
              },
            }
            obj.map = {
              center: {
                latitude: center.lat(),
                longitude: center.lng()
              },
              zoom: 14,
              control: {},
              bounds: {},
              visible: false,
              pan: true
            };
            obj.line = {
              id: 1,
              path: [
                {
                  latitude: i.airportFromObj.latitude ,
                  longitude: i.airportFromObj.longitude,
                },
                {
                  longitude: i.airportToObj.longitude,
                  latitude: i.airportToObj.latitude,
                }
              ],
              stroke: {
                color: '#323a45',
                weight: 3
              },
              visible: true,
            },
            $scope.emptyResults.legs.push(obj);
          });
        // });
      });
    }

    $scope.emptyLegSearch = function() {
      localStorageService.set('emptyLegQuery', null);
      localStorageService.set('emptyLegQueryInfo', null);
      $window.location.href = '/get-a-quote/#/empty';
    };

    $scope.clearSearch = function() {
        $('#empty-legs-form').removeClass('ng-submitted');
        $scope.cleared = true;
        $scope.empty = {};
        Empty.save({ page: 1, pageSize: 10 }, function(data) {
          $scope.emptyResults = {};
          $scope.emptyResults.count = data.count;
          $scope.emptyResults.legs = [];
          angular.forEach(data.legs, function(i, v) {
            var bound = new google.maps.LatLngBounds();
            bound.extend( new google.maps.LatLng(i.airportFromObj.latitude, i.airportFromObj.longitude) );
            bound.extend( new google.maps.LatLng(i.airportToObj.latitude, i.airportToObj.longitude) );
            center = bound.getCenter();
            obj = i;
            obj.markers = [];
            obj.bounds = {};
            obj.line = {};
            obj.bounds.northeast = {
              longitude: i.airportFromObj.longitude,
              latitude: i.airportFromObj.latitude
            };
            obj.bounds.southwest = {
              longitude: i.airportToObj.longitude,
              latitude: i.airportToObj.latitude
            };
            obj.markers.push({
              longitude: i.airportFromObj.longitude,
              latitude: i.airportFromObj.latitude,
              id: 0,
              icon: '/media/static/images/marker.png',
            });
            obj.markers.push({
              longitude: i.airportToObj.longitude,
              latitude: i.airportToObj.latitude,
              id: 1,
              icon: '/media/static/images/marker.png',
            });
            obj.marker = {
              icon: {
                url: '/media/static/images/marker.png',
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(12, 12)
              },
            }
            obj.map = {
              center: {
                latitude: center.lat(),
                longitude: center.lng()
              },
              zoom: 14,
              control: {},
              bounds: {},
              visible: false,
              pan: true
            };
            obj.line = {
              id: 1,
              path: [
                {
                  latitude: i.airportFromObj.latitude ,
                  longitude: i.airportFromObj.longitude,
                },
                {
                  longitude: i.airportToObj.longitude,
                  latitude: i.airportToObj.latitude,
                }
              ],
              stroke: {
                color: '#323a45',
                weight: 3
              },
              visible: true,
            },
            $scope.emptyResults.legs.push(obj);
          });
        });
    }

    $scope.url = url;

    $scope.dateOptions = {
      minDate: 0,
      firstDay: 1,
      dateFormat: 'dd-mm-yy',
    }

    $scope.query = {
      returnFlight: false,
      legs: [
        {
          from: '',
          to: '',
          fromF: '',
          toF: '',
          date: null,
          time: null,
          passengers: null
        }
      ]
    
    }

    $scope.return = [
      {
        leg: false
      }
    ];

    $scope.addRow = function() {
      $('#charter-quote-form').removeClass('ng-submitted');
      $scope.query.legs.push(
        {
          from: '',
          to: '',
          fromF: '',
          toF: '',
          date: null,
          time: null,
          passengers: ''
        }
      );
    }

    $scope.remove=function(item){
      var index=$scope.query.legs.indexOf(item)
      $scope.query.legs.splice(index,1);
      if($scope.query.returnFlight == true && index == 1) {
        $scope.query.returnFlight = false;
      }
    }

    $scope.request = function(valid) {
      if(valid) {
        request = {};
        request.legs = [];
        request.returnFlight = $scope.query.returnFlight;
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
            //localStorageService.set('quote', data);
            $window.location.href = '/request/#/charter/' + data.id;
          } else {
            $scope.noCharter = true;
          }
        });
      }
    }

    $scope.returnFlight = function() {
      $scope.query.legs[1].from = $scope.query.legs[0].to;
      $scope.query.legs[1].to = $scope.query.legs[0].from;
    }

    $scope.$watch('query.returnFlight', function(val) {
      if(val == true && $scope.query.legs.length > 2) {
        $scope.query.legs.splice(2,5);
      }
    });

    $scope.emptyRequest = function(flight) {
      EmptyReserve.request({ id: flight.id }, {}, function(data) {
        $window.location.href = '/request/#/empty-leg/' + data.tripRequestId;
      });
    }

    $scope.emptySearch = function(valid) {
      if(valid) {
          $scope.cleared = false;
          request = {
            airportFrom: $scope.empty.airportFrom,
            airportTo: $scope.empty.airportTo,
            flightStart: $filter('date')($scope.empty.flightStart, 'yyyy-MM-dd'),
            page: 1,
            pageSize: 10
          };
          if (url == '/') {
            localStorageService.set('emptyLegQuery', request);
            localStorageService.set('emptyLegQueryInfo', $scope.empty);
            $window.location.href = '/get-a-quote/#/empty';
          } else {
            Empty.save(request, function(data) {
              $scope.emptyResults = {};
              $scope.emptyResults.count = data.count;
              $scope.emptyResults.legs = [];
              //uiGmapIsReady.promise().then(function() {
              angular.forEach(data.legs, function(i, v) {
                var bound = new google.maps.LatLngBounds();
                bound.extend( new google.maps.LatLng(i.airportFromObj.latitude, i.airportFromObj.longitude) );
                bound.extend( new google.maps.LatLng(i.airportToObj.latitude, i.airportToObj.longitude) );
                center = bound.getCenter();
                obj = i;
                obj.markers = [];
                obj.bounds = {};
                obj.line = {};
                obj.bounds.northeast = {
                  longitude: i.airportFromObj.longitude,
                  latitude: i.airportFromObj.latitude
                };
                obj.bounds.southwest = {
                  longitude: i.airportToObj.longitude,
                  latitude: i.airportToObj.latitude
                };
                obj.markers.push({
                  longitude: i.airportFromObj.longitude,
                  latitude: i.airportFromObj.latitude,
                  id: 0,
                  icon: '/media/static/images/marker.png',
                });
                obj.markers.push({
                  longitude: i.airportToObj.longitude,
                  latitude: i.airportToObj.latitude,
                  id: 1,
                  icon: '/media/static/images/marker.png',
                });
                obj.marker = {
                  icon: {
                    url: '/media/static/images/marker.png',
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(12, 12)
                  },
                }
                obj.map = {
                  center: {
                    latitude: center.lat(),
                    longitude: center.lng()
                  },
                  zoom: 14,
                  control: {},
                  bounds: {},
                  visible: false,
                  pan: true
                };
                obj.line = {
                  id: 1,
                  path: [
                    {
                      latitude: i.airportFromObj.latitude ,
                      longitude: i.airportFromObj.longitude,
                    },
                    {
                      longitude: i.airportToObj.longitude,
                      latitude: i.airportToObj.latitude,
                    }
                  ],
                  stroke: {
                    color: '#323a45',
                    weight: 3
                  },
                  visible: true,
                },
                $scope.emptyResults.legs.push(obj);
              });
              //});
            });
          }
      }
    }

    $scope.airportOptions = {
      options: {
        html: true,
        focusOpen: true,
        onlySelectValid: true,
        source: function (request, response) {
          var result = '';
          Airport.search(
            {
              "searchString": request.term
            }, function(data) {
              result = data.airports;
              result = [];
              angular.forEach(data.airports, function(i) {
                var code = [];
                if (i.airportName.trim() != "") {
                  code.push(i.airportName);
                }
                if (i.iataCode.trim() != "") {
                  code.push(i.iataCode);
                }
                result.push({
                  label: i.city + ", " + i.country + " (" + code.join('/') + ")",
                  value: i.city + ", " + i.country + " (" + code.join('/') + ")",
                  code: i.code
                });
              });
              response(result);
            }
          );
        },
        select: function(ui, label) {
          var el = $(ui.target);
          var index = el.data('index');
          if(el.data('target') == "from") {
            $scope.query.legs[index].from = label.item.code;
          } else if(el.data('target') == "to") {
            $scope.query.legs[index].to = label.item.code;
          } else if(el.data('target') == "airportFrom") {
            $scope.empty.airportFrom = label.item.code;
          } else if(el.data('target') == "airportTo") {
            $scope.empty.airportTo = label.item.code;
          }
        }
      },
      methods: {}
    };

    if(url == '/get-a-quote/') {
      $scope.class = 'blue';
    }

    $scope.activeTab = path == '/empty' ? 'empty' : 'quote';

    $scope.switchTabTo = function (tabId) {
      $scope.activeTab = tabId;
    };

    $scope.selected = "-1";
    $scope.select = function(index){
      $scope.selected = index;
    };

    $timeout(function () {
      $scope.map = {
        center: {
          latitude: 51.219053,
          longitude: 4.404418
        },
        zoom: 14,
        control: {},
        bounds: {},
        window: {
          marker: {},
          show: false,
          closeClick: function() {
            this.show = false;
          },
          options: {} // define when map is ready
        },
        infoWindowWithCustomClass: {
          coords: {
            latitude: 51.219053,
            longitude: 4.404418
          },
          options: {
            boxClass: 'custom-info-window',
            closeBoxDiv: '<div" class="pull-right" style="position: relative; cursor: pointer; margin: -20px -15px;">X</div>',
            disableAutoPan: true,
            visible: true
          },
          show: true,
        }
      };
    }, 100);


    $scope.options = { scrollwheel: false, maxZoom: 12};

    $scope.windowOptions = {
      visible: true
    };

    $scope.onClick = function() {
      $scope.windowOptions.visible = !$scope.windowOptions.visible;
    };

    $scope.closeClick = function() {
      $scope.windowOptions.visible = false;
    };

    $scope.aircraftSearch = {};

    $timeout(function () {
      uiGmapGoogleMapApi.then(function(maps) {
        // offset to fit the custom icon
        $scope.map.window.options.pixelOffset = new google.maps.Size(100, 100, 'px', 'px');
      });
    }, 100);


    $scope.countries = [];

    $scope.countryConfig = {
      sortField: 'name',
      maxItems: 1,
      allowEmptyOption: true,
      valueField: 'id',
      labelField: 'name',
    }

    $scope.addresses = [];
    $scope.refreshCountries = function(country) {
      Country.query(function(data) {
        $scope.countries = data.countries;
      });
    };



    $scope.markers = [];

    $scope.airportSearch = function() {
      Airport.search($scope.aircraftSearch, function(data) {
        $scope.markers = [];
        angular.forEach(data.airports, function(i, v) {
          $scope.markers.push(
            {
              longitude: i.longitude,
              latitude: i.latitude,
              id: v,
              title: i.city + ', ' + i.country + '(' + i.code + ')',
              icon: '/media/static/images/marker.png'
            }
          )
        });
        if($scope.markers.length == 1) {
          $scope.map.zoom = 14;
        }
      });
    }

    $scope.showDetails = function($event, obj) {
      $this = $($event.target);
      $this.closest('tr').toggleClass('expanded');
      $this.closest('tr').find('div.btn').toggle();
      $scope.emptyResults.legs[obj].map.visible = true;
      $this.parents('tr').next().find('div.expander').slideToggle(function() {
        $this.parents('tr').next().find('div.map').css({ display: 'block' });
        $this.parents('tr').next().find('div.expander').find('slick').get(0).slick.setPosition();
      });
      AscentJet.switchGallery();
    }
    $scope.showDetailsMobile = function($event, obj) {
      $this = $($event.target);
      $this.prev('div.extra').slideToggle();
      AscentJet.switchMobileGallery();
      $this.prev('div.extra').find('slick').get(0).slick.setPosition();
      $this.parent().toggleClass('active');
      if($this.parent().hasClass('active')) {
        $this.text($this.data('close'));
      } else {
        $this.text($this.data('details'));
      }
    }


    $scope.single = null;

    $scope.singleConfig = {
      options: [{value: 1, text: '1'}, {value: 2, text:'2'}, {value: 3, text:'3'}, {value: 4, text:'4'}],
      sortField: 'text',
      maxItems: 1,
    }
  })

  // scroll to top
  .directive('scrollTo', ['ScrollTo', function(ScrollTo){
    return {
      restrict : "AC",
      compile : function(){

        return function(scope, element, attr) {
          element.bind("click", function(event){
            ScrollTo.idOrName(attr.scrollTo, attr.offset);
          });
        };
      }
    };
  }])
  .service('ScrollTo', ['$window', 'ngScrollToOptions',
    function($window, ngScrollToOptions) {
      this.idOrName = function (idOrName, offset, focus) {
        //check if an element can be found with id attribute
        var document = $window.document;
        var el = document.getElementById(idOrName);

        if(el) {
          //if an element is found, scroll to the element
          if (focus) {
            el.focus();
          }
          ngScrollToOptions.handler(el, offset);
        }
        //otherwise, ignore
      }
    }])
  .provider("ngScrollToOptions", function() {
    this.options = {
      handler : function(el, offset) {
        if (offset) {
          var top = $(el).offset().top - offset;
          window.scrollTo(0, top);
        }
        else {
          el.scrollIntoView();
        }
      }
    };
    this.$get = function() {
      return this.options;
    };
    this.extend = function(options) {
      this.options = angular.extend(this.options, options);
    };
  })

  .directive('resize', function ($window, $timeout) {
    return function (scope, element) {
      var w = angular.element($window);
      scope.getWindowDimensions = function () {
        return {
          'h': w.height(),
          'w': w.width()
        };
      };
      scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
        scope.windowHeight = newValue.h;
        scope.windowWidth = newValue.w;
        scope.style = function () {
          return {
            'height': (newValue.h - 100) + 'px',
            'width': (newValue.w - 100) + 'px'
          };
        };

      }, true);

      w.bind('resize', function () {
        scope.$apply();
      });
      // $timeout(function(){ w.triggerHandler('resize') });

    }
    // $timeout(function(){ w.triggerHandler('resize') });

  })
