var scripts = document.getElementsByTagName("script");
var tmplPath = scripts[scripts.length-1].src.replace('js/main.js', 'tmpl/');

var hotCan = angular.module('hotCan', []);

hotCan.factory('Episode', ['$http', function($http) {
    var url = '_res/json/001.json'; // this needs to be passed in when service is called

    return {
        getEpisode: function() {
            return $http.get(url);
        }
    }
}]);

hotCan.controller('EpisodeController', ['$scope', 'Episode', function($scope, Episode) {
    Episode.getEpisode().success(function(data) {
        $scope.episode = data;
    });
}]);

hotCan.directive('episode', function() {
   return {
       restrict: "E",
       replace: true,
       templateUrl: tmplPath + "episode.html"
   }
});