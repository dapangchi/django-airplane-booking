angular.module('ascentApp')
  .factory("Baggage", function($resource) {
    return $resource("http://ascentjet.com/rest/reference/baggage/types/:id", {}, {
      query: {
        method: 'GET',
        isArray: false
      }
    });
  });
