angular.module('ascentApp')
  .factory("EmptyReserve", function($resource) {
    return $resource("http://ascentjet.com/rest/emptyleg/reserve/:id", { id: '@id' }, {
      request : {
        method: "POST",
        isArray: false
      }
    });
  });
