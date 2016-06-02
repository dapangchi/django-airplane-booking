angular.module('ascentApp')
  .factory("Account", function($resource) {
    return $resource("http://ascentjet.com/rest/customer/:id", {}, {
      create: {
        method: 'PUT',
        isArray: false,
      }
    });
  });

angular.module('ascentApp')
  .factory("AccountActivate", function($resource) {
    return $resource("http://ascentjet.com/rest/customer/activate/:id", {}, {
      activate: {
        method: 'POST',
        isArray: false,
      }
    });
  });

angular.module('ascentApp')
  .factory("Airport", function($resource) {
    return $resource("http://ascentjet.com/rest/airport/search/:id", {}, {
      search: {
        method: 'PUT',
        isArray: false
      }
    });
  });

angular.module('ascentApp')
  .factory("Baggage", function($resource) {
    return $resource("http://ascentjet.com/rest/reference/baggage/types/:id", {}, {
      query: {
        method: 'GET',
        isArray: false
      }
    });
  });

angular.module('ascentApp')
  .factory("Category", function($resource) {
    return $resource("http://ascentjet.com/rest/categories/request/:id", {}, {
      query: {
        method: 'GET',
        isArray: false
      }
    });
  });

angular.module('ascentApp')
  .factory("Country", function($resource) {
    return $resource("http://ascentjet.com/rest/reference/countries/:id", {}, {
      query: {
        method: 'GET',
        isArray: false
      }
    });
  });

angular.module('ascentApp')
  .factory("Empty", function($resource) {
    return $resource("http://ascentjet.com/rest/emptyleg/:reserve/:id", { id: '@id', path: '@path' }, {
      request : {
        method: "POST",
        isArray: false
      }
    });
  });

angular.module('ascentApp')
  .factory("EmptyReserve", function($resource) {
    return $resource("http://ascentjet.com/rest/emptyleg/reserve/:id", { id: '@id' }, {
      request : {
        method: "POST",
        isArray: false
      }
    });
  });

angular.module('ascentApp')
  .factory("Flight", function($resource) {
    return $resource("http://ascentjet.com/rest/secured/request/:id", {}, {
      query: {
        method: 'GET',
        isArray: false
      }
    });
  });

angular.module('ascentApp')
  .factory("Login", function($resource) {
    return $resource("http://ascentjet.com/rest/security/:id", {}, {
      login: {
        method: 'PUT',
        isArray: false
      }
    });
  });

angular.module('ascentApp')
  .factory("Logout", function($resource) {
    return $resource("http://ascentjet.com/rest/security/logout/:id", {}, {
      logout: {
        method: 'PUT',
        isArray: false,
      }
    });
  });

// angular.module('ascentApp')
//   .factory('responseObserver',
//     function responseObserver($q, $window) {
//       return function (promise) {
//         return promise.then(function (successResponse) {
//           return successResponse;
//         }, function (errorResponse) {
//
//           switch (errorResponse.status) {
//             case 401:
//             $window.location = $window.location;
//             break;
//             case 403:
//             $window.location = '/';
//             break;
//             case 500:
//             $window.location = '/';
//           }
//
//           return $q.reject(errorResponse);
//         });
//       };
//     }
//   );

angular.module('ascentApp')
  .factory("Offer", function($resource) {
    return $resource("http://ascentjet.com/rest/secured/request/:id", { id: '@id'});
  });

angular.module('ascentApp')
  .factory("OfferSave", function($resource) {
    return $resource("http://ascentjet.com/rest/secured/request/submit/:id", { id: '@id' }, {
      save : {
        method: "POST",
        isArray: false
      }
    });
  });

angular.module('ascentApp')
  .factory("OfferSubmit", function($resource) {
    return $resource("http://ascentjet.com/rest/secured/request/:id", { id: '@id' }, {
      save : {
        method: "POST",
        isArray: false
      }
    });
  });

angular.module('ascentApp')
  .factory("Passanger", function($resource) {
    return $resource("http://ascentjet.com/rest/secured/request/passengers/:id", {}, {
      create: {
        method: 'POST',
        isArray: false
      }
    });
  });

angular.module('ascentApp')
  .factory("Password", function($resource) {
    return $resource("http://ascentjet.com/rest/security/password/forgot/:id");
  });

angular.module('ascentApp')
  .factory("Quote", function($resource) {
    return $resource("http://ascentjet.com/rest/request/:id");
  });

angular.module('ascentApp')
  .factory("UpdateTrip", function($resource) {
    return $resource("http://ascentjet.com/rest/secured/request/additional/:id", {}, {
      update: {
        method: 'POST',
        isArray: false
      }
    });
  });

angular.module('ascentApp')
  .service('myAppServices', function($http, $q, uiGmapGoogleMapApi){
    this.getCurrentLocation = function(){
        var deferred = $q.defer();
        navigator.geolocation.getCurrentPosition(function(position) {
    		var myCurrentLocation = {
                latitude : position.coords.latitude,
                longitude : position.coords.longitude
            };
            deferred.resolve(myCurrentLocation);
        });
        return deferred.promise;
    };
  });

angular.module('ascentApp')
  .service('ieVersion', function($http,$q){
     this.getIEversion = function() {
         var sAgent = window.navigator.userAgent;
         var Idx = sAgent.indexOf("MSIE");

         if (Idx > 0) {
             return parseInt(sAgent.substring(Idx + 5, sAgent.indexOf(".", Idx)));
         } else if (!!navigator.userAgent.match(/Trident\/7\./)) {
             return 11;
         } else if (navigator.userAgent.indexOf('Edge/') > 0) {
             return 12;
         }
         else
             return 0;
     }
  });
