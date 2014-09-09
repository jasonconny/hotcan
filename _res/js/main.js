var hotcan = angular.module('hotcan', ['ngRoute']);


// ROUTES
hotcan.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: "EpisodeController",
            templateUrl: "_res/views/episode.html"
        })
        .when('/podcast/:deeplink', {
            controller: "EpisodeController",
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
hotcan.controller('EpisodeController', ['$scope', 'EpisodeLoader', function($scope, EpisodeLoader) {
    EpisodeLoader.success(function(data) {
        var index = 0;
        episodes = data;
        $scope.currentEpisode = episodes[index];
        $scope.previousEpisode = episodes[index - 1];
        $scope.nextEpisode = episodes[index + 1];
    });
}]);

// SERVICES
hotcan.factory('EpisodeLoader', ['$http', function($http) {
    return $http.get('_res/json/hotcan.json');
}]);

// DIRECTIVES
// episode-nav directive