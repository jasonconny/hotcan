var hotcan = angular.module('hotcan', ['ngRoute']);


// ROUTES
hotcan.config(function ($routeProvider) {
    $routeProvider
        .when('/',
        {
            templateUrl: "_res/views/episode.html"
        })
        .when('/about', {
            templateUrl: "_res/views/about.html"
        })
        .when('/contact', {
            templateUrl: "_res/views/contact.html"
        })
});

// CONTROLLERS
hotcan.controller('EpisodeController', ['$scope', 'Episodes', function($scope, Episode) {
    Episodes.getEpisodes().success(function(data) {
        $scope.episodes = data;
    });
}]);

// SERVICES
hotcan.factory('Episodes', ['$http', function($http) {
    var url = '_res/json/hotcan.json';

    return {
        getEpisodes: function() {
            return $http.get(url);
        }
    }
}]);

// DIRECTIVES
//hotcan.directive('episode', function() {
//   return {
//       restrict: "E",
//       replace: true,
//       templateUrl: "_res/views/episode.html"
//   }
//});