angular.module('ascentApp')
  .factory("Quote", function($resource) {
    return $resource("http://ascentjet.com/rest/request/:id");
  });
