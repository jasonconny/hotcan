// hack to get root path during local development without running a web server
var scripts = document.getElementsByTagName("script");
var tmplPath = scripts[scripts.length-1].src.replace('js/main.js', 'tmpl/');

var hotCan = angular.module('hotCan', []);

//hotCan.config(function ($routeProvider) {
//    $routeProvider.when('/about/',
//        {
//            templateUrl: tmplPath + "about.html",
//            controller: "aboutController"
//        }
//    )
//});

hotCan.factory('Episode', ['$http', function($http) {
    var url = '_res/json/001.json'; // this needs to be passed in when service is called

    return {
        getEpisode: function() {
            return $http.get(url);
        }
    }
}]);

hotCan.controller('AboutController', ['$scope', function($scope) {
    $scope.model = {
        aboutText: "Two DJ’s and four turntables. Available for art openings, loft parties, club dates and bar mitzvahs. Hot Can is Jason Conny and Xavier Jimenez. Xavier Jimenez and Jason Conny are Hot Can. "
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