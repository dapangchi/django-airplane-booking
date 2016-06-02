angular.module('ascentApp')
  .factory("AccountActivate", function($resource) {
    return $resource("http://ascentjet.com/rest/customer/activate/:id", {}, {
      activate: {
        method: 'POST',
        isArray: false,
      }
    });
  });
