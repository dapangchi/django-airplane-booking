angular.module('ascentApp')
  .factory("Passanger", function($resource) {
    return $resource("http://ascentjet.com/rest/secured/request/passengers/:id", {}, {
      create: {
        method: 'POST',
        isArray: false,
      }
    });
  });
