// angular.module('ascentApp')
//   .factory('responseObserver',
//     function responseObserver($q, $window) {
//       return function (promise) {
//         return promise.then(function (successResponse) {
//           return successResponse;
//         }, function (errorResponse) {
//
//           switch (errorResponse.status) {
//             case 401:
//             $window.location = $window.location;
//             break;
//             case 403:
//             $window.location = '/';
//             break;
//             case 500:
//             $window.location = '/';
//           }
//
//           return $q.reject(errorResponse);
//         });
//       };
//     }
//   );
