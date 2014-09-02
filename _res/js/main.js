var hotcan = angular.module('hotcan', ['ngRoute']);


// ROUTES
hotcan.config(function ($routeProvider) {
    $routeProvider
        .when('/',
        {
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
        episodes = data.episodes;
        $scope.episode = episodes[0];
    });
}]);

// SERVICES
hotcan.factory('EpisodeLoader', ['$http', function($http) {
    return $http.get('_res/json/hotcan.json');
}]);

// DIRECTIVES
// episode-nav directive