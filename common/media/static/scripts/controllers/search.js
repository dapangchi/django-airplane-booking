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
