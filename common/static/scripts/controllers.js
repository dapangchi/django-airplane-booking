angular.module('ascentApp')
    .controller('AccountController', function($scope, $http, $cookies, $window, $routeParams, $compile, $filter, Account, Country, AccountActivate, localStorageService) {
        $scope.account = {}
        $scope.fake = {};
        Country.query(function(data) {
            $scope.countries = data.countries;
        })

        $scope.create = function(isValid) {
            if (isValid) {
                localStorageService.set('email', $scope.account.userInfo.userName);
                Account.create($scope.account, function(data) {
                    $window.location.href = '/account/#/activate/';
                });
            }
        }
    });

angular.module('ascentApp')
    .controller('AccountActivateController', function($scope, $http, $cookies, $window, $routeParams, $compile, $filter, AccountActivate, localStorageService) {
        $scope.account = {}
        $scope.email = localStorageService.get('email');
    });

angular.module('ascentApp')
    .controller('AccountActivationController', function($scope, $http, $cookies, $window, $routeParams, $compile, $filter, AccountActivate, localStorageService) {
        $scope.account = {
            "code": $routeParams.code,
            "email": $routeParams.email
        }
        AccountActivate.activate($scope.account, function(data) {
            $window.location.href = '/profile/#/edit';
        });
    });

angular.module('ascentApp')
    .controller('BookingController', function($scope, $http, $cookies, $cookieStore, $window, $routeParams, $compile, $filter, Baggage, Category, UpdateTrip, Flight) {
        Flight.query(function(data) {
            $scope.flights = data.requests;
            $scope.details = $filter('filter')($scope.flights, {
                status: '!' + 'BOOKED'
            }, true)[0]
            $scope.selected = $scope.details.id
        });

        $scope.show = function(id) {
            Flight.get({
                id: id
            }, function(data) {
                $scope.selected = id;
                $scope.details = data;
            })
        }
    });

angular.module('ascentApp')
    .controller('CharterRequestController', function($scope, $http, $timeout, $cookies, $cookieStore, $window, $location, $routeParams, $routeParams, $compile, $filter, Login, ngDialog, FancyboxService, cookieStore, localStorageService, Baggage, Category, UpdateTrip, Flight, Account) {
        Flight.get({
            id: $routeParams.id
        }, function(data) {
            $scope.charter = data;
            $scope.additional = {}
            $scope.additional.id = $scope.charter.id;

            $scope.priceSwitch = $scope.priceDrop[0].code;

            Category.get({
                id: $scope.charter.id
            }, function(data) {
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

        $scope.priceDrop = [{
            code: 'CHF',
            name: 'Price (CHF)'
        }, {
            code: 'EUR',
            name: 'Price (EUR)'
        }, {
            code: 'USD',
            name: 'Price (USD)'
        }, {
            code: 'GBP',
            name: 'Price (GBP)'
        }];

        $scope.changePrice = function(item, model) {
            $scope.priceSwitch = model;
        }

        $scope.loginPopup = function(phone) {
            if ($scope.updateQuote.$valid == true) {
                $scope.dialog = ngDialog.open({
                    template: viewsPath + 'views/account/modal.html',
                    scope: $scope
                });
            }
        }

        $scope.popupInfo = {
            title: 'Title...',
            content: 'Contents....',
            placement: 'left'
        }

        $scope.loginModalFailed = false;

        $scope.processLogin = function(valid) {
            if (valid) {
                Login.login($scope.login, function(data, headers) {
                    if (data.userId != null && headers('SESSIONID') != '') {
                        cookieStore.put('logged-in', true, {
                            path: "/"
                        });
                        cookieStore.put('JSESSIONID', headers('SESSIONID'), {
                            path: "/"
                        });
                        cookieStore.put('user', data.userId, {
                            path: "/"
                        });
                        $scope.user = {
                            email: data.userName,
                            id: data.userId,
                        }

                        ngDialog.close($scope.dialog.id);

                        $timeout(function() {
                            Account.get({
                                id: data.userId
                            }, function(data) {
                                cookieStore.put('userMail', data.firstName + " " + data.lastName, {
                                    path: "/"
                                });
                                // $window.location.reload();

                                $timeout(function() {
                                    $scope.submit();
                                }, 500);

                            });
                        }, 500);
                    }
                    else {
                        $scope.loginModalFailed = true;
                        angular.element(document).find('form[name="loginModal"] input[name="userName"]').addClass('ng-dirty ng-invalid-required');
                        angular.element(document).find('form[name="loginModal"] input[name="password"]').addClass('ng-dirty ng-invalid-required');
                    }
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
    .controller('EditAccountController', function($scope, $http, $cookies, $window, $routeParams, $compile, $filter, cookieStore, Account, Country) {
        $scope.account = {}
        $scope.saved = false;

        Country.query(function(data) {
            $scope.countries = data.countries;
        });

        Account.get({
            id: cookieStore.get('user')
        }, function(data) {
            $scope.account = {
                "customerId": parseInt(cookieStore.get('user')),
                "customerInfo": {
                    "title": data.title,
                    "firstName": data.firstName,
                    "lastName": data.lastName,
                    "countryId": data.countryId,
                    "address": data.address,
                    "address2": data.address2,
                    "city": data.city,
                    "zipCode": data.zipCode
                }
            }
        });

        $scope.update = function() {
            if ($scope.updateAccount.$valid == true) {
                Account.save($scope.account, function(data) {
                    Account.get({
                        id: cookieStore.get('user')
                    }, function(data) {
                        cookieStore.put('userMail', data.firstName + " " + data.lastName, {
                            path: "/"
                        });
                    });
                    $scope.saved = true;
                });
            }
        }
    });

angular.module('ascentApp')
    .controller('EmptyController', function($scope, $http, $cookies, $cookieStore, $window, $routeParams, $compile, $filter, Empty, Quote, Airport, Login) {
        $scope.query = {
            legs: [{
                from: '',
                to: '',
                date: null,
                time: null,
                passengers: ''
            }]
        }
        $scope.return = [{
            leg: false
        }];

        $scope.addRow = function() {
            $scope.query.legs.push({
                from: '',
                to: '',
                date: null,
                time: null,
                passengers: ''
            });
            $scope.return.push({
                leg: false
            })
        }

        $scope.delete = function(index) {
            $scope.query.legs.splice($scope.query.legs.indexOf(index));
            $scope.return.splice($scope.return.indexOf(index));
        }

        $scope.request = function() {
            request = {};
            request.legs = [];
            angular.forEach($scope.query.legs, function(v, i) {
                request.legs.push({
                    from: v.from,
                    to: v.to,
                    date: $filter('date')(v.date, 'dd/MM/yyyy'),
                    time: $filter('date')(v.time, 'HH:mm'),
                    passengers: v.passengers
                });
            });
            Quote.save(request, function(data) {
                if (data.id !== null) {
                    $cookieStore.put('quote', data);
                    $window.location.href = '/charter-request/';
                }
                else {
                    $scope.noCharter = true;
                }
            });
        }

        $scope.airportOptions = {
            options: {
                html: true,
                focusOpen: false,
                onlySelectValid: true,
                source: function(request, response) {
                    var result = '';
                    Airport.search({
                        "searchString": request.term
                    }, function(data) {
                        result = data;
                    });
                    data = $scope.airportOptions.methods.filter(result, request.term);
                    response(data);
                }
            },
            methods: {}
        };

        $scope.activeTab = 'quote';
        $scope.switchTabTo = function(tabId) {
            $scope.activeTab = tabId;
        };
    });

angular.module('ascentApp')
    .controller('EmptyRequestController', function($scope, $http, $timeout, $cookies, $cookieStore, $window, $routeParams, $compile, $filter, ngDialog, Login, FancyboxService, cookieStore, localStorageService, Baggage, Category, UpdateTrip, Flight, Account) {
        Flight.get({
            id: $routeParams.id
        }, function(data) {
            $scope.charter = data;
            $scope.additional = {}
            $scope.additional.id = $scope.charter.id;

            $scope.priceSwitch = $scope.priceDrop[0].code;

            Category.get({
                id: $scope.charter.id
            }, function(data) {
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
            if (value == 'gallery') {
                $scope.gallery = true;
                $scope.floorplan = false;
            }
            else {
                $scope.gallery = false;
                $scope.floorplan = true;
            }
        }

        $scope.priceDrop = [{
            code: 'CHF',
            name: 'Price (CHF)'
        }, {
            code: 'EUR',
            name: 'Price (€)'
        }, {
            code: 'USD',
            name: 'Price ($)'
        }, {
            code: 'GBP',
            name: 'Price (£)'
        }];

        $scope.loginPopup = function(phone) {}

        $scope.loginPopup = function(phone) {
            if ($scope.updateQuote.$valid == true) {
                $scope.dialog = ngDialog.open({
                    template: viewsPath + 'views/account/modal.html',
                    scope: $scope
                });
            }
        }

        $scope.processLogin = function(valid) {
            if (valid) {
                Login.login($scope.login, function(data, headers) {
                    cookieStore.put('logged-in', true, {
                        path: "/"
                    });
                    cookieStore.put('JSESSIONID', headers('SESSIONID'), {
                        path: "/"
                    });
                    cookieStore.put('user', data.userId, {
                        path: "/"
                    });
                    $scope.user = {
                        email: data.userName,
                        id: data.userId,
                    }
                    ngDialog.close($scope.dialog.id);

                    $timeout(function() {
                        Account.get({
                            id: data.userId
                        }, function(data) {
                            cookieStore.put('userMail', data.firstName + " " + data.lastName, {
                                path: "/"
                            });
                            // $window.location.reload();

                            $timeout(function() {
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
    .controller('ErrorController', function($scope, $http, $cookies, $window, $routeParams, $compile, $filter, Passanger) {
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
            $scope.request.passengers.push({
                title: 'Mr',
                firstName: '',
                lastName: '',
                passport: '',
                validMonth: '',
                validYear: ''
            });
        }

        $scope.submit = function() {
            Passanger.create($scope.request, function(data) {
                $window.location.href = '/flights/booking/#/finish/' + $routeParams.id;
            });
        }
    });

angular.module('ascentApp')
    .controller('FinishController', function($scope, $http, $cookies, $window, $routeParams, $compile, $filter, Offer, Flight) {
        Offer.save({
            id: $routeParams.id
        }, function(data) {
            $scope.offer = data;
            $scope.flightNO = data.tripRequestId;
            Flight.query({
                id: data.tripRequestId
            }, function(flight) {
                $scope.flight = flight;
            });
        });
    });

angular.module('ascentApp')
    .controller('LoginController', function($scope, $http, $log, $rootScope, $cookies, $cookieStore, $window, $routeParams, $compile, $filter, Login, Account, cookieStore, Logout) {
        $reloadRoot = $window.location.href;
        $scope.loginFailed = false;
        //$scope.loginForm.userName.$error.loginFailed = false;
        //$scope.loginForm.password.$error.loginFailed = false;
        $scope.account = {}
        $scope.login = {
            userName: "",
            password: ""
        }

        $scope.$watch(function() {
            return cookieStore.get('userMail');
        }, function() {
            $scope.userMail = cookieStore.get('userMail');
        });

        $scope.$watch(function() {
            return $cookieStore.get('logged-in');
        }, function() {
            // $log.log('Index cookie watch: ' + $cookieStore.get('logged-in'))
            if ($cookieStore.get('logged-in') == true) {
                $scope.showLogin = false;
            }
            else {
                $scope.showLogin = true;
            }
        });

        $scope.create = function() {
            if ($scope.loginForm.$valid) {
                Login.login($scope.login, function(data, headers) {
                    if (data.userId != null && headers('SESSIONID') != '') {
                        cookieStore.put('logged-in', true, {
                            path: "/"
                        });
                        cookieStore.put('JSESSIONID', headers('SESSIONID'), {
                            path: "/"
                        });
                        cookieStore.put('user', data.userId, {
                            path: "/"
                        });
                        $scope.user = {
                            email: data.userName,
                            id: data.userId
                        }
                        Account.get({
                            id: cookieStore.get('user')
                        }, function(data) {
                            cookieStore.put('userMail', data.firstName + " " + data.lastName, {
                                path: "/"
                            });
                            // $window.location.href = '/';
                            $window.location.href = $reloadRoot;
                        });
                    }
                    else {
                        /* if login is failed */
                        $scope.loginFailed = true;
                        angular.element(document).find('input[name="userName"]').addClass('ng-dirty ng-invalid ng-invalid-required');
                        angular.element(document).find('input[name="password"]').addClass('ng-dirty ng-invalid ng-invalid-required');
                    }
                });
            }
        }

        $scope.logout = function() {
            Logout.logout({}, function(data, headers) {
                cookieStore.put('logged-in', false, {
                    path: "/"
                });
                cookieStore.remove('JSESSIONID', false, {
                    path: "/"
                });
                cookieStore.remove('user', false, {
                    path: "/"
                });
                cookieStore.remove('userMail', false, {
                    path: "/"
                });
                $window.location.href = '/';
            });
        }
    })

angular.module('ascentApp')
    .controller('LogoutController', function($scope, $http, $cookies, $cookieStore, $window, $routeParams, $compile, $filter, Logout, cookieStore) {

        Logout.logout({}, function(data, headers) {
            cookieStore.put('logged-in', false, {
                path: "/"
            });
            cookieStore.remove('JSESSIONID', false, {
                path: "/"
            });
            cookieStore.remove('user', false, {
                path: "/"
            });
            $window.location.href = '/';
        });

    });

angular.module('ascentApp')
    .controller('OfferSubmitController', function($scope, $http, $route, $location, $cookies, $cookieStore, $window, $routeParams, $compile, $filter, localStorageService, Baggage, Category, UpdateTrip, Flight, OfferSave) {

        $window.scrollTo(0, 0);

        $scope.charter = localStorageService.get('quote');

        Flight.get({
            id: $routeParams.id
        }, function(data) {
            $scope.flight = data;
            Category.get({
                id: $scope.flight.id
            }, function(data) {
                $scope.categories = data.categories;
            });
        });

        $scope.save = function() {
            OfferSave.save({
                id: $routeParams.id
            }, function(data) {
                /*$window.location.href = '/request/#/success/' + $routeParams.id;*/
                $window.location.href = '/request/#/success/' + $routeParams.id;
            });
        }
    });

angular.module('ascentApp')
    .controller('OfferSuccessSubmitController', function($scope, $http, $cookies, $cookieStore, $window, $routeParams, $compile, $filter, localStorageService, Baggage, Category, UpdateTrip, Flight) {

        $scope.charter = {};
        $scope.charter.id = $routeParams.id;

        $scope.init = function() {
            console.log($scope.charter.id);
            $http({
                method: 'GET',
                url: '/send_email?id='+$scope.charter.id
            }).then(function successCallback(response){
                var res = response;
            }, function errorCallback(){

            });
        };

        $scope.submit = function() {
            UpdateTrip.update($scope.additional, function(done) {
                $window.location.href = '/request-for-offer/';
            });
        }

    });

angular.module('ascentApp')
    .controller('PaidController', function($scope, $http, $cookies, $window, $routeParams, $compile, $filter, Passanger, OfferSubmit) {
        $scope.offer = {};
        $scope.offer.id = $routeParams.id;
        OfferSubmit.save({
            id: $scope.offer.id
        }, function(data) {
            $scope.requestId = data.tripRequestId;
            // $window.location.href = '/flights/requests/' + data.tripRequestId + '/';
        })
    });

angular.module('ascentApp')
    .controller('PassangersController', function($scope, $http, $cookies, $window, $routeParams, $compile, $filter, Passanger) {
        $scope.request = {};
        $scope.request.offerId = $routeParams.id.split('-')[0];
        $scope.offerNo = $routeParams.id.split('-')[1];
        $scope.request.passengers = [{
            title: 'Mr',
            firstName: '',
            lastName: '',
            passport: '',
            validMonth: '',
            validYear: ''
        }];

        $scope.remove = function(item) {
            var index = $scope.request.passengers.indexOf(item)
            $scope.request.passengers.splice(index, 1);
        }

        $scope.addRow = function() {
            $scope.request.passengers.push({
                title: 'Mr',
                firstName: '',
                lastName: '',
                passport: '',
                validMonth: '',
                validYear: ''
            });
        }

        $scope.submit = function(valid) {
            if (valid) {
                Passanger.create($scope.request, function(data) {
                    $window.location.href = '/flights/booking/#/finish/' + $routeParams.id.split('-')[0];
                });
            }
        }
    });

angular.module('ascentApp')
    .controller('PasswordController', function($scope, $http, $cookies, $window, $routeParams, $compile, $filter, Password) {
        $scope.account = {}
        $scope.send = function(isValid) {
            if (isValid) {
                Password.save($scope.account, function(data) {
                    $scope.response = data;
                    $window.location.href = '/account/#/password-changed';
                });
            }
        }
    });

angular.module('ascentApp')
    .controller('SearchController', function($rootScope, $scope, $http, $cookies, $cookieStore, cookieStore, $timeout, $window, $routeParams, $compile, $filter, $location, localStorageService, Empty, EmptyReserve, Quote, Airport, uiGmapGoogleMapApi, uiGmapIsReady, Country, myAppServices, ieVersion) {

        var path = $location.path();
        var url = $window.location.pathname;

        $scope.totalItems = 0;
        $scope.currentPage = 1;
        $scope.pagination = {
            current: 1,
            last: 0
        };

        $scope.iconArr = {};
        $scope.iebrowser = false;
        if( ieVersion.getIEversion() != 0 )
            $scope.iebrowser = true;

        $scope.iconShow = function($index) {
            if( !$scope.iebrowser )
                return;
            $scope.query.legs[$index].mousein = true;
        }
        $scope.iconHide = function($index) {
            if( !$scope.iebrowser )
                return;
            $scope.query.legs[$index].mousein = false;
        }
        $scope.upPax = function($index) {
            var pax = parseInt($scope.query.legs[$index].passengers);
            if( !isNaN(pax) )
                pax += 1;
            else
                pax = 1;
            $scope.query.legs[$index].passengers = pax;
        }
        $scope.downPax = function($index) {
            var pax = parseInt($scope.query.legs[$index].passengers);
            if( pax > 1 )
                pax -= 1;
            else
                pax = 1
            $scope.query.legs[$index].passengers = pax;
        }
        $scope.passengerChange = function($event) {
            var keyCode = $event.which ? $event.which : $event.keyCode
            var ret = ((keyCode >= 48 && keyCode <= 57) || specialKeys.indexOf(keyCode) != -1);
            return ret;
        }

        $scope.cleared = true;

        if (url == '/') {
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
            pageSize: 15
        }

        $scope.emptyLegGet = function(request) {
            Empty.save(request, function(data) {
                $scope.totalItems = 1 + parseInt(data.count / 15);
                $scope.pagination.last = 1 + parseInt(data.count / 15);
                $scope.pages = [];
                for (var j = 1; j < $scope.totalItems + 1; j++) {
                    $scope.pages.push(j);
                }

                localStorageService.set('emptyLegQuery', null);
                localStorageService.set('emptyLegQueryInfo', null);
                $scope.emptyResults = {};
                $scope.emptyResults.count = data.count;
                $scope.emptyResults.legs = [];
                angular.forEach(data.legs, function(i, v) {
                    var bound = new google.maps.LatLngBounds();
                    bound.extend(new google.maps.LatLng(i.airportFromObj.latitude, i.airportFromObj.longitude));
                    bound.extend(new google.maps.LatLng(i.airportToObj.latitude, i.airportToObj.longitude));
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
                        icon: '/media/static/images/marker.png'
                    });
                    obj.marker = {
                        icon: {
                            url: '/media/static/images/marker.png',
                            origin: new google.maps.Point(0, 0),
                            anchor: new google.maps.Point(12, 12)
                        }
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
                            path: [{
                                latitude: i.airportFromObj.latitude,
                                longitude: i.airportFromObj.longitude
                            }, {
                                longitude: i.airportToObj.longitude,
                                latitude: i.airportToObj.latitude
                            }],
                            stroke: {
                                color: '#323a45',
                                weight: 3
                            },
                            visible: true
                        },
                        $scope.emptyResults.legs.push(obj);
                });
                angular.element(document).find('.empty-legs-hide .table-wrap').css('opacity', '1');
                $scope.wait = false;
            });

        }

        if (url == '/get-a-quote/') {
            $scope.empty = localStorageService.get('emptyLegQueryInfo') != null ? localStorageService.get('emptyLegQueryInfo') : $scope.empty;
            if (request = localStorageService.get('emptyLegQuery') != null) {
                request = localStorageService.get('emptyLegQuery');
                $scope.cleared = false;
            }
            else {
                request = {
                    page: $scope.currentPage,
                    pageSize: 15
                };
                angular.element(document).find('.empty-legs-hide .table-wrap').css('opacity', '0.1');
                $scope.wait = true;
            };
            $scope.emptyLegGet(request);
        }

        $scope.setCurrent = function(pageNo) {
                if (pageNo <= $scope.pagination.last && pageNo > 0 && $scope.pagination.current != pageNo) {
                    angular.element(document).find('.empty-legs-hide .table-wrap').css('opacity', '0.1');
                    $scope.wait = true;
                    $scope.pageNumber = pageNo;
                    $scope.pagination.current = pageNo;
                    request = {
                        page: $scope.pageNumber,
                        pageSize: 15
                    };
                    $scope.emptyLegGet(request);
                }
            }
            /* pagination */

        $scope.emptyLegSearch = function() {
            localStorageService.set('emptyLegQuery', null);
            localStorageService.set('emptyLegQueryInfo', null);
            $window.location.href = '/get-a-quote/#/empty';
        };

        $scope.clearSearch = function() {
            $('#empty-legs-form').removeClass('ng-submitted');
            $scope.cleared = true;
            $scope.empty = {};
            Empty.save({
                page: 1,
                pageSize: 10
            }, function(data) {
                $scope.emptyResults = {};
                $scope.emptyResults.count = data.count;
                $scope.emptyResults.legs = [];
                angular.forEach(data.legs, function(i, v) {
                    var bound = new google.maps.LatLngBounds();
                    bound.extend(new google.maps.LatLng(i.airportFromObj.latitude, i.airportFromObj.longitude));
                    bound.extend(new google.maps.LatLng(i.airportToObj.latitude, i.airportToObj.longitude));
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
                        }
                    };
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
                            path: [{
                                latitude: i.airportFromObj.latitude,
                                longitude: i.airportFromObj.longitude,
                            }, {
                                longitude: i.airportToObj.longitude,
                                latitude: i.airportToObj.latitude,
                            }],
                            stroke: {
                                color: '#323a45',
                                weight: 3
                            },
                            visible: true
                        },
                        $scope.emptyResults.legs.push(obj);
                });
            });
        }


        $scope.url = url;

        $scope.dateOptions = [{
            minDate: new Date(),
            firstDay: 1,
            dateFormat: 'dd-mm-yy',
            onSelect: function(e) {
                $timeout(function() {
                    $rootScope.$broadcast('dateChanged');
                }, 50);

            },
            onRender: function() {

            }
        }];
        var datePicker = angular.module('ascentApp', []);
        datePicker.directive('jqdatepicker', function() {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, element, attrs, ngModelCtrl) {
                    element.datepicker({
                        dateFormat: 'DD, d  MM, yy',
                        onSelect: function(date) {
                            scope.date = date;
                            scope.$apply();
                        }
                    });
                }
            };
        });
        $scope.clickClander = function($index) {
            $scope.selectedIndex = $index;
        };
        $scope.dateChange = function($event) {
            $scope.dateOptions[1].minDate = new Date();
        }
        $scope.$on('dateChanged', function(event, args) {
            if ($scope.selectedIndex == $scope.query.legs.length - 1 || $scope.query.legs.length < 2) {
                return;
            }
            if ($scope.query.legs[$scope.selectedIndex].date == null) {
                return;
            }
            var tmpline = $scope.query.legs[$scope.selectedIndex];
            var tmparr = [];
            $scope.dateOptions[$scope.selectedIndex + 1].minDate = new Date($scope.query.legs[$scope.selectedIndex].date);
            for (var i = $scope.selectedIndex + 1; i <= $scope.query.legs.length - 1; i++) {
                tmparr.push({
                    from: $scope.query.legs[i].from,
                    to: $scope.query.legs[i].to,
                    fromF: $scope.query.legs[i].fromF,
                    toF: $scope.query.legs[i].toF,
                    date: $scope.query.legs[i].date,
                    time: $scope.query.legs[i].time,
                    passengers: $scope.query.legs[i].passengers
                });
                $scope.query.legs.splice(i, 1);
            }

            $scope.query.legs.push({
                from: '',
                to: '',
                fromF: '',
                toF: '',
                date: null,
                time: null,
                passengers: null
            });

            for (var i = 1; i < tmparr.length; i++) {
                $scope.query.legs.push({
                    from: tmparr[i].from,
                    to: tmparr[i].to,
                    fromF: tmparr[i].fromF,
                    toF: tmparr[i].toF,
                    date: tmparr[i].date,
                    time: tmparr[i].time,
                    passengers: tmparr[i].passengers
                });
            }
        });

        $scope.query = {
            returnFlight: false,
            legs: [{
                from: '',
                to: '',
                fromF: '',
                toF: '',
                date: null,
                time: null,
                passengers: null
            }]
        }

        $scope.return = [{
            leg: false
        }];

        $scope.addRow = function() {
            $('#charter-quote-form').removeClass('ng-submitted');
            var prevDate = $scope.query.legs[$scope.query.legs.length - 1].date;
            $scope.dateOptions.push({
                minDate: prevDate ? new Date(prevDate) : new Date(),
                firstDay: 1,
                dateFormat: 'dd-mm-yy',
                onSelect: function(e) {
                    $rootScope.$broadcast('dateChanged');
                },
                onRender: function() {

                }
            });
            $scope.query.legs.push({
                from: '',
                to: '',
                fromF: '',
                toF: '',
                date: '',
                time: null,
                passengers: '',
                mousein: false
            });
        }

        $scope.remove = function(item) {
            var index = $scope.query.legs.indexOf(item)
            $scope.query.legs.splice(index, 1);
            if ($scope.query.returnFlight == true && index == 1) {
                $scope.query.returnFlight = false;
            }
        }

        $scope.request = function(valid) {
            if (valid) {
                request = {};
                request.legs = [];
                request.returnFlight = $scope.query.returnFlight;
                angular.forEach($scope.query.legs, function(v, i) {
                    request.legs.push({
                        from: v.from,
                        to: v.to,
                        date: $filter('date')(v.date, 'dd/MM/yyyy'),
                        time: $filter('date')(v.time, 'HH:mm'),
                        passengers: v.passengers
                    });
                });
                Quote.save(request, function(data) {
                    if (data.id !== null) {
                        //localStorageService.set('quote', data);
                        $window.location.href = '/request/#/charter/' + data.id;
                    }
                    else {
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
            if (val == true && $scope.query.legs.length > 2) {
                $scope.query.legs.splice(2, 5);
            }
        });

        $scope.emptyRequest = function(flight) {
            EmptyReserve.request({
                id: flight.id
            }, {}, function(data) {
                $window.location.href = '/request/#/empty-leg/' + data.tripRequestId;
            });
        }

        $scope.emptySearch = function(valid) {
            if (valid) {
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
                }
                else {
                    Empty.save(request, function(data) {
                        $scope.emptyResults = {};
                        $scope.emptyResults.count = data.count;
                        $scope.emptyResults.legs = [];
                        //uiGmapIsReady.promise().then(function() {
                        angular.forEach(data.legs, function(i, v) {
                            var bound = new google.maps.LatLngBounds();
                            bound.extend(new google.maps.LatLng(i.airportFromObj.latitude, i.airportFromObj.longitude));
                            bound.extend(new google.maps.LatLng(i.airportToObj.latitude, i.airportToObj.longitude));
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
                                    path: [{
                                        latitude: i.airportFromObj.latitude,
                                        longitude: i.airportFromObj.longitude,
                                    }, {
                                        longitude: i.airportToObj.longitude,
                                        latitude: i.airportToObj.latitude,
                                    }],
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
                source: function(request, response) {
                    var result = '';
                    Airport.search({
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
                    });
                },
                select: function(ui, label) {
                    var el = $(ui.target);
                    var index = el.data('index');
                    if (el.data('target') == "from") {
                        $scope.query.legs[index].from = label.item.code;
                    }
                    else if (el.data('target') == "to") {
                        $scope.query.legs[index].to = label.item.code;
                    }
                    else if (el.data('target') == "airportFrom") {
                        $scope.empty.airportFrom = label.item.code;
                    }
                    else if (el.data('target') == "airportTo") {
                        $scope.empty.airportTo = label.item.code;
                    }
                }
            },
            methods: {}
        };

        if (url == '/get-a-quote/') {
            $scope.class = 'blue';
        }

        $scope.activeTab = path == '/empty' ? 'empty' : 'quote';

        $scope.initmap = function () {
            $timeout(function() {
                $scope.mapByAddress = true;
            }, 100);

        };
        $scope.switchTabTo = function(tabId) {
            $scope.activeTab = tabId;
            if(tabId != 'quote') {
                $scope.mapByAddress = false;
                $scope.mapByAirport = false;
            } else {
                // $scope.mapByAddress = true;
            }
        };

        $scope.selected = "-1";
        $scope.select = function(index) {
            $scope.selected = index;
        };

        var geoLocationOptions = {
            enableHighAccuracy: true
        };

        $scope.myCurrentLocation = {
            /*latitude: 51.219053,
            longitude: 4.404418*/
            latitude: 46.362093,
            longitude: 9.036255
        };
        var mapRef;

        $scope.mapInfo = '';
        myAppServices.getCurrentLocation().then(function (myCurrentLocation) {
            $scope.myCurrentLocation = myCurrentLocation;
        })
        .then(function () {
            return uiGmapGoogleMapApi;
        });
        uiGmapGoogleMapApi.then(function (maps) {
            $scope.map = {
                center: {
                    latitude: $scope.myCurrentLocation.latitude,
                    longitude: $scope.myCurrentLocation.longitude
                },
                zoom: 8,
                control: {},
                bounds: {},
                window: {
                    markers: {},
                    show: false,
                    closeClick: function () {
                        this.show = false;
                    },
                    options: {

                    }
                },
                markers: {},
                markersEvents: {
                    mouseover: function (marker, eventName, model, arguments) {
                        $scope.mapInfo = model.title;
                        model.show = !model.show;
                    },
                    mouseout: function (marker, eventName, model, argurments) {
                        model.show = !model.show;
                    }
                },
                events: {
                },
                infoWindowWithCustomClass: {
                    coords: {
                        latitude: $scope.myCurrentLocation.latitude,
                        longitude: $scope.myCurrentLocation.longitude
                    },
                    options: {
                        boxClass: 'custom-info-window',
                        closeBoxDiv: '<div" class="pull-right" style="position: relative; cursor: pointer; margin: -20px -15px;">X</div>',
                        disableAutoPan: true,
                        visible: true
                    },
                    show: true
                }
            };

            $scope.mapAirport = {
                center: {
                    latitude: $scope.myCurrentLocation.latitude,
                    longitude: $scope.myCurrentLocation.longitude
                },
                zoom: 8,
                control: {},
                bounds: {},
                window: {
                    show: false,
                    closeClick: function () {
                        this.show = false;
                    },
                    options: {

                    }
                },
                markers: {},
                markersEvents: {

                },
                events: {
                    bounds_changed: function (mapAirport) {
                        $scope.$apply(function () {
                            mapRef=mapAirport;
                        });
                    }
                },
                infoWindowWithCustomClass: {
                    coords: {
                        latitude: $scope.myCurrentLocation.latitude,
                        longitude: $scope.myCurrentLocation.longitude
                    },
                    options: {
                        boxClass: 'custom-info-window',
                        closeBoxDiv: '<div" class="pull-right" style="position: relative; cursor: pointer; margin: -20px -15px;">X</div>',
                        disableAutoPan: true,
                        visible: true
                    },
                    show: true
                }
            };
        });

        uiGmapIsReady.promise()
            .then(function (instances) {
                //var maps = instances[0].map;
                //$scope.myOnceOnlyFunction(maps);
                angular.forEach(instances, function (value, key) {
                    var maps = value.map;
                })
            });

        $scope.options = {
            scrollwheel: true,
            maxZoom: 20
        };
        $scope.optionsAirport = {
            scrollwheel: true,
            maxZoom: 20
        };

        $scope.windowOptions = {
            visible: true
        };

        $scope.onClick = function() {
            $scope.windowOptions.visible = !$scope.windowOptions.visible;
        };

        $scope.closeClick = function() {
            $scope.windowOptions.visible = false;
        };


        $scope.mapByAirport = false;
        $scope.markers = [];
        $scope.aircraftSearch = {};
        $scope.aircraftSearch.city = null;
        var iLat = '';
        var iLng = '';
        var curAddress = '';
        $scope.mapShow = function(sel) {
            if (sel == 'airport') {
                if ($scope.mapByAirport == false) {
                    $scope.mapByAirport = true;
                    $scope.mapByAddress = false;
                    if($scope.airportMarkers.length) {
                        $timeout(function(){
                            if($scope.mapByAirport == true) {
                                if($scope.mapAirport.zoom == 14)
                                    $scope.mapAirport.zoom = 13;
                                else if($scope.mapAirport.zoom == 13)
                                    $scope.mapAirport.zoom = 14;
                            }
                        }, 500);
                    }
                }
            }
            else {
                $scope.mapByAddress = true;
                $scope.mapByAirport = false;
            }
        };

        $scope.autocompleting = function(lng, lat, addr) {
            iLat = lat;
            iLng = lng;
            curAddress = addr;
            $.ajax({
                url: "https://www.ascentjet.com/public/getClosestAirports.action",
                dataType: "jsonp",
                contentType: "application/json",
                type: "GET",
                data: {
                    longitude: lng,
                    latitude: lat
                },
                async: false,
                success: function(res) {
                    if (res.error) {
                        alert("Sorry, we could not lookup the address at this time.");
                        return;
                    }
                    $scope.markers = [];
                    angular.forEach(res.airports, function(i, v) {
                        $scope.markers.push({
                            longitude: i.longitude,
                            latitude: i.latitude,
                            id: v,
                            title: i.airportName  + '(' + i.icaoCode + ')' + ', ' + i.countryName,
                            icon: 'http://maps.google.com/mapfiles/kml/pal2/icon48.png'
                        });
                    });
                    $scope.markers.push({
                        longitude: iLng,
                        latitude: iLat,
                        id: $scope.markers.length,
                        title: curAddress,
                        icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FE7569'
                    });
                    if ($scope.markers.length > 0) {
                        $scope.map.markers = $scope.markers;
                        $scope.map.zoom = 8;
                        $scope.$apply();
                    }
                },
                error: function(p1, p2, p3) {
                    alert(p2);
                    alert(p1.responseText);
                    alert(p3);
                }
            });
        }

        $scope.$on('g-places-autocomplete:select', function(event, param) {
            $scope.autocompleting(param.geometry.location.lng(), param.geometry.location.lat(), param.formatted_address);
        });

        $scope.airportMarkers = [];
        $scope.autocompletingByAirport = function(lng, lat) {
            iLat = lat;
            iLng = lng;
            $.ajax({
                url: "https://www.ascentjet.com/public/getClosestAirports.action",
                dataType: "jsonp",
                contentType: "application/json",
                type: "GET",
                data: {
                    longitude: lng,
                    latitude: lat
                },
                async: false,
                success: function(res) {
                    if (res.error) {
                        alert("Sorry, we could not lookup the address at this time.");
                        return;
                    }
                    var isFirst = 0;
                    $scope.airportMarkers = [];
                    angular.forEach(res.airports, function(i, v) {
                        if(isFirst == 0) {
                            $scope.airportMarkers.push({
                                longitude: i.longitude,
                                latitude: i.latitude,
                                coords: {
                                    latitude: i.latitude,
                                    longitude: i.longitude
                                },
                                id: v,
                                title: i.city + ', ' + i.country + '(' + i.code + ')',
                                options: {
                                    title: i.city + ', ' + i.country + '(' + i.code + ')'
                                },
                                icon: 'http://maps.google.com/mapfiles/kml/pal2/icon48.png'
                            });
                            isFirst = 5;
                        }else if(isFirst == 1) {
                            $scope.airportMarkers.push({
                                longitude: i.longitude,
                                latitude: i.latitude,
                                coords: {
                                    latitude: i.latitude,
                                    longitude: i.longitude
                                },
                                id: v,
                                title: i.city + ', ' + i.country + '(' + i.code + ')',
                                options: {
                                    title: i.city + ', ' + i.country + '(' + i.code + ')'
                                },
                                icon: ''
                            });
                            isFirst = 5;
                        }
                    });
                    /*$scope.airportMarkers.push({
                        longitude: iLng,
                        latitude: iLat,
                        coords: {
                            latitude: iLat,
                            longitude: iLng
                        },
                        id: $scope.airportMarkers.length,
                        icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FE7569'
                    })*/
                    if ($scope.airportMarkers.length > 0) {
                        $scope.mapAirport.zoom = 8;
                        $scope.$apply();
                    }
                },
                error: function(p1, p2, p3) {
                    alert(p2);
                    alert(p1.responseText);
                    alert(p3);
                }
            });
        }

        $scope.$watch('airportMarkers', function(val){
            $timeout(function(){
                if($scope.mapByAirport == true)
                    $scope.mapAirport.zoom = 13;
            }, 300)
        });

        $scope.airportSearchByCode = {
            options: {
                html: true,
                focusOpen: true,
                onlySelectValid: true,
                source: function(request, response) {
                    var result = '';
                    Airport.search({
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
                                code: i.code,
                                lat: i.latitude,
                                lng: i.longitude
                            });
                        });
                        response(result);
                    });
                },
                select: function(ui, label) {
                    $scope.autocompletingByAirport(label.item.lng, label.item.lat);
                }
            },
            methods: {}
        };

        $scope.countries = [];

        $scope.countryConfig = {
            sortField: 'name',
            maxItems: 1,
            allowEmptyOption: true,
            valueField: 'id',
            labelField: 'name'
        }

        $scope.addresses = [];
        $scope.refreshCountries = function(country) {
            Country.query(function(data) {
                $scope.countries = data.countries;
            });
        };

        $scope.showDetails = function($event, obj) {
            $this = $($event.target);
            $this.closest('tr').toggleClass('expanded');
            $this.closest('tr').find('div.btn').toggle();
            $scope.emptyResults.legs[obj].map.visible = true;
            $this.parents('tr').next().find('div.expander').slideToggle(function() {
                $this.parents('tr').next().find('div.map').css({
                    display: 'block'
                });
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
            if ($this.parent().hasClass('active')) {
                $this.text($this.data('close'));
            }
            else {
                $this.text($this.data('details'));
            }
        }

        $scope.single = null;

        $scope.singleConfig = {
            options: [{
                value: 1,
                text: '1'
            }, {
                value: 2,
                text: '2'
            }, {
                value: 3,
                text: '3'
            }, {
                value: 4,
                text: '4'
            }],
            sortField: 'text',
            maxItems: 1
        }
    })

// scroll to top
    .directive('scrollTo', ['ScrollTo', function(ScrollTo) {
        return {
            restrict: "AC",
            compile: function() {

                return function(scope, element, attr) {
                    element.bind("click", function(event) {
                        ScrollTo.idOrName(attr.scrollTo, attr.offset);
                    });
                };
            }
        };
    }])
    .service('ScrollTo', ['$window', 'ngScrollToOptions',
        function($window, ngScrollToOptions) {
            this.idOrName = function(idOrName, offset, focus) {
                //check if an element can be found with id attribute
                var document = $window.document;
                var el = document.getElementById(idOrName);

                if (el) {
                    //if an element is found, scroll to the element
                    if (focus) {
                        el.focus();
                    }
                    ngScrollToOptions.handler(el, offset);
                }
                //otherwise, ignore
            }
        }
    ])
    .provider("ngScrollToOptions", function() {
        this.options = {
            handler: function(el, offset) {
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

    .directive('resize', function($window, $timeout) {
        return function(scope, element) {
            var w = angular.element($window);
            scope.getWindowDimensions = function() {
                return {
                    'h': w.height(),
                    'w': w.width()
                };
            };
            scope.$watch(scope.getWindowDimensions, function(newValue, oldValue) {
                scope.windowHeight = newValue.h;
                scope.windowWidth = newValue.w;
                scope.style = function() {
                    return {
                        'height': (newValue.h - 100) + 'px',
                        'width': (newValue.w - 100) + 'px'
                    };
                };

            }, true);

            w.bind('resize', function() {
                scope.$apply();
            });
            // $timeout(function(){ w.triggerHandler('resize') });

        }
        // $timeout(function(){ w.triggerHandler('resize') });

})