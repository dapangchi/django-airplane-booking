angular.module('ascentApp')
  .factory("Category", function($resource) {
    return $resource("http://ascentjet.com/rest/categories/request/:id", {}, {
      query: {
        method: 'GET',
        isArray: false
      }
    });
  });
