var hotcan = angular.module('hotcan', ['ui.router', 'ngResource']);

// ROUTES
hotcan.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $urlRouterProvider.when('/', ['$state', function($state) {
        $state.go('episode', {'slug':'beginnings'});
    }]);

    $stateProvider.state('app', {
        abstract: true,
        views: {
            app: {}
        }
    }).state('all', {
        url: '/all',
        views: {
            main: {templateUrl: "_res/views/all.html"}
        }
    }).state('about', {
        url: '/about',
        parent: 'app',
        views: {
            main: {templateUrl: "_res/views/about.html"}
        }
    }).state('contact', {
        url: '/contact',
        parent: 'app',
        views: {
            main: {templateUrl: "_res/views/contact.html"}
        }
    }).state('episode', {
        url: '/:slug',
        parent: 'app',
        views: {
            main: {templateUrl: "_res/views/episode.html"}
        }
    });

}]);

// CONTROLLERS
hotcan.controller('EpisodeController', ['$scope', function($scope) {
    $scope.episodes = episodes;
    $scope.index = 0;
    //$scope.postDate = new Date($scope.episodes[$scope.index].date);

/*
    $scope.decrementIndex = function() {
        console.log('decrement index');
    };
    $scope.incrementIndex = function() {
        $scope.index = $scope.index++;
        return $scope.index;
    };
*/
}]);


// SERVICES
hotcan.service('EpisodeService', ['$rootScope', '$http', function($rootScope, $http) {

    var episodes = this;

    this.getIndex = function() {
        return 0;
    };

    this.getEpisodes = function() {
        return $resource('_res/json/hotcan.json', {}, {
            query: {method:'GET', isArray:true}
        });
    }

}]);

hotcan.service('EpisodeIndex', ['$rootScope', function($rootScope) {
    this.getIndex = function() {
        return 0;
    };
}]);

hotcan.factory('EpisodeLoader', ['$resource', function($resource) {
    return $resource('_res/json/hotcan.json', {}, {
        query: {method:'GET', isArray:true}
    });
}]);


// DIRECTIVES
hotcan.directive('episodeNav', [function() {
    return {
        restrict: "E",
        templateUrl: "_res/views/_episode-nav.html",
        link: function(scope, element) {

        }
    }
}]);