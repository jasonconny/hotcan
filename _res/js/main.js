var hotcan = angular.module('hotcan', ['ngRoute', 'ngResource']);


// ROUTES
hotcan.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: "EpisodeController",
            templateUrl: "_res/views/all.html",
            resolve: {
                episodes: ['EpisodeLoader', function(EpisodeLoader) {
                    return EpisodeLoader.query();
                }]
            }
        })
        .when('/about', {
            templateUrl: "_res/views/about.html"
        })
        .when('/contact', {
            templateUrl: "_res/views/contact.html"
        })
        .when('/podcast/:deeplink', {
            redirectTo: "/:id"
        })
        .when('/:deeplink', {
            controller: "EpisodeController",
            templateUrl: "_res/views/episode.html"
        })
});

// CONTROLLERS
hotcan.controller('EpisodeController', ['$scope', 'episodes', function($scope, episodes) {
    $scope.episodes = episodes;
//    console.log(currentEpisode);
//    var index = 0;
//    $scope.currentEpisode = episodes[index];
//    $scope.postDate = new Date($scope.currentEpisode.date);
}]);


// SERVICES
hotcan.factory('EpisodeLoader', ['$resource', function($resource) {
    return $resource('_res/json/hotcan.json', {}, {
        query: {method:'GET', isArray:true}
    });
}]);


// DIRECTIVES
// episode-nav directive