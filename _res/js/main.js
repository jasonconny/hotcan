var hotCan = angular.module('hotCan', ['ngRoute']);


// ROUTES
hotCan.config(function ($routeProvider) {
    $routeProvider.when('/',
        {
            templateUrl: "_res/views/episode.html"
        }
    )
});

// CONTROLLERS
hotCan.controller('EpisodeController', ['$scope', 'Episode', function($scope, Episode) {
    Episode.getEpisode().success(function(data) {
        $scope.episode = data;
    });
}]);

// SERVICES
hotCan.factory('Episode', ['$http', function($http) {
    var url = '_res/json/001.json'; // this needs to be passed in when service is called

    return {
        getEpisode: function() {
            return $http.get(url);
        }
    }
}]);

// DIRECTIVES
//hotCan.directive('episode', function() {
//   return {
//       restrict: "E",
//       replace: true,
//       templateUrl: "_res/views/episode.html"
//   }
//});