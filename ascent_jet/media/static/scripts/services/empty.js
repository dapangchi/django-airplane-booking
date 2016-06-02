angular.module('ascentApp')
  .factory("Empty", function($resource) {
    return $resource("http://ascentjet.com/rest/emptyleg/:reserve/:id", { id: '@id', path: '@path' }, {
      request : {
        method: "POST",
        isArray: false
      }
    });
  });
