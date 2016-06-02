angular.module('ascentApp')
  .factory("Password", function($resource) {
    return $resource("http://ascentjet.com/rest/security/password/forgot/:id");
  });
