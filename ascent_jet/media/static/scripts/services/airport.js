angular.module('ascentApp')
  .factory("Airport", function($resource) {
    return $resource("http://ascentjet.com/rest/airport/search/:id", {}, {
      search: {
        method: 'PUT',
        isArray: false,
      }
    });
  });
