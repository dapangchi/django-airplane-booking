angular.module('ascentApp')
  .factory("Offer", function($resource) {
    return $resource("http://ascentjet.com/rest/secured/request/:id", { id: '@id'});
  });
