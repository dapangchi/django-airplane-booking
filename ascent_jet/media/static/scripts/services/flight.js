angular.module('ascentApp')
  .factory("Flight", function($resource) {
    return $resource("http://ascentjet.com/rest/secured/request/:id", {}, {
      query: {
        method: 'GET',
        isArray: false
      }
    });
  });
