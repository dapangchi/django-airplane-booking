angular.module('ascentApp')
  .factory("UpdateTrip", function($resource) {
    return $resource("http://ascentjet.com/rest/secured/request/additional/:id", {}, {
      update: {
        method: 'POST',
        isArray: false,
      }
    });
  });
