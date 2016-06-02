angular.module('ascentApp')
  .factory("Account", function($resource) {
    return $resource("http://ascentjet.com/rest/customer/:id", {}, {
      create: {
        method: 'PUT',
        isArray: false,
      }
    });
  });
