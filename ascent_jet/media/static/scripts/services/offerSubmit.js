angular.module('ascentApp')
  .factory("OfferSubmit", function($resource) {
    return $resource("http://ascentjet.com/rest/secured/request/:id", { id: '@id' }, {
      save : {
        method: "POST",
        isArray: false
      }
    });
  });
