angular.module('ascentApp')
  .factory("Login", function($resource) {
    return $resource("http://ascentjet.com/rest/security/:id", {}, {
      login: {
        method: 'PUT',
        isArray: false,
      }
    });
  });
