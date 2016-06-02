angular.module('ascentApp')
  .factory("OfferSave", function($resource) {
    return $resource("http://ascentjet.com/rest/secured/request/submit/:id", { id: '@id' }, {
      save : {
        method: "POST",
        isArray: false
      }
    });
  });
