angular.module('ascentApp')
  .factory("Country", function($resource) {
    return $resource("http://ascentjet.com/rest/reference/countries/:id", {}, {
      query: {
        method: 'GET',
        isArray: false
      }
    });
  });
