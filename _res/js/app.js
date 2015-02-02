var hotcan = angular.module('hotcan', ['ngRoute', 'ngResource']);


// ROUTES
hotcan.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: "EpisodeController",
            templateUrl: "_res/views/episode.html",
            resolve: {
                episodes: ['EpisodeLoader', function(EpisodeLoader) {
                    return EpisodeLoader.query();
                }],
                index: ['EpisodeIndex', function(EpisodeIndex) {
                    return EpisodeIndex.index;
                }]
            }
        })
        .when('/all', {
            templateUrl: "_res/views/all.html"
        })
        .when('/about', {
            templateUrl: "_res/views/about.html"
        })
        .when('/contact', {
            templateUrl: "_res/views/contact.html"
        })
        .when('/podcast/:deeplink', {
            redirectTo: "/:deeplink"
        })
        .when('/:deeplink', {
            controller: "EpisodeController",
            templateUrl: "_res/views/episode.html",
            resolve: {

            }
        })
});

// CONTROLLERS
hotcan.controller('EpisodeController', ['$scope', 'episodes', 'index', function($scope, episodes, index) {
    $scope.episodes = episodes;
    $scope.index = index;
    $scope.postDate = new Date($scope.episodes[$scope.index].date);

    $scope.decrementIndex = function() {
        console.log('decrement index');
    };
    $scope.incrementIndex = function() {
        console.log('increment index');
    };
}]);


// SERVICES
hotcan.factory('EpisodeIndex', function() {
    return {
        index: 0
    };
});

hotcan.factory('EpisodeLoader', ['$resource', function($resource) {
    return $resource('_res/json/hotcan.json', {}, {
        query: {method:'GET', isArray:true}
    });
}]);


// DIRECTIVES
// episode-nav directive