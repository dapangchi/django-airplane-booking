angular.module('ascentApp')
  .factory("Logout", function($resource) {
    return $resource("http://ascentjet.com/rest/security/logout/:id", {}, {
      logout: {
        method: 'PUT',
        isArray: false,
      }
    });
  });
