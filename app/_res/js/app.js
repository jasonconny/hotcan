var hotcan = angular.module('hotcan', ['ui.router']);

// ROUTES
hotcan.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $urlRouterProvider.when('/', ['$state', function($state) {
        $state.go('episode', {'episodeName':'beginnings'});
    }]);

    $stateProvider.state('all', {
        url: '/all',
        views: {
            main: {templateUrl: "_res/views/all.html"}
        }
    }).state('about', {
        url: '/about',
        views: {
            main: {templateUrl: "_res/views/about.html"}
        }
    }).state('contact', {
        url: '/contact',
        views: {
            main: {templateUrl: "_res/views/contact.html"}
        }
    }).state('forContentOwners', {
        url: '/for-content-owners',
        views: {
            main: {templateUrl: "_res/views/forContentOwners.html"}
        }
    }).state('episode', {
        url: '/:episodeName',
        //resolve: {
        //    episodes: function(EpisodeService) {
        //        return EpisodeService.getEpisodes();
        //    }
        //},
        views: {
            main: {templateUrl: "_res/views/episode.html"}
        }
    });

}]);

// CONTROLLERS
hotcan.controller('MainController', [
    '$scope'
    , '$state'
    , 'EpisodeService'
    , 'UtilityService'
    , function(
        $scope
        , $state
        , EpisodeService
        , UtilityService) {

        var main = this;

        this.getData = function() {
            EpisodeService.getData().then(function(response) {
                main.episodes = response.data;
                angular.forEach(main.episodes, function(k) {
                    var routename = k.title;
                    k.routename = UtilityService.transformStringToParameter(routename);
                    k.mp3Path = "/_res/audio/mp3/" + k.filename + '.mp3';
                    k.oggPath = "/_res/audio/ogg/" + k.filename + '.ogg';

                    k.intro = EpisodeService.getIntro(k.intro);
                })
            });
        };

        main.getData();

        $scope.MainController = this;
        return $scope.MainController;

    }]);

hotcan.controller('EpisodeController', ['$scope', '$state', function($scope, $state) {

    var episode = this;

    episode.viewName = $state.params.episodeName;
    episode.key = _.findKey($scope.main.episodes, function(thisEpisode) {
        return thisEpisode.routename == episode.viewName;
    });
    episode.data = $scope.main.episodes[episode.key];
    $scope.postDate = new Date($scope.main.episodes[episode.key].date);

    $scope.index = parseInt(episode.key);

    $scope.DetailController = this;
    return $scope.DetailController;
}]);


// SERVICES
hotcan.service('EpisodeService', ['$http', function($http) {

    var episodes = {};

    episodes.getData = function() {
        return $http
            .get('./_res/json/hotcan.json')
            .success(function(response) {
                return response;
            });
    };

    episodes.getIntro = function(intro) {
        switch(intro) {
            case "If You're Ready Come Go With Me":
                intro = {
                    "artist" : "Jimmy McGriff",
                    "title" : "If You're Ready Come Go With Me",
                    "album" : "If You're Ready Come Go With Me: The Super Funk Collection",
                    "albumURL" : "http://www.allmusic.com/album/if-youre-ready-mw0000882187",
                    "label" : "Groove Merchant",
                    "year" : "1973"
                };
                break;
            case "Blind Man, Blind Man":
                intro = {
                    "artist" : "Herbie Hancock",
                    "title" : "Blind Man, Blind Man",
                    "album" : "My Point Of View",
                    "albumURL" : "http://www.allmusic.com/album/my-point-of-view-mw0000247492",
                    "label" : "Blue Note",
                    "year" : "1963"
                };
                break;
            default:
                intro = {
                    "artist" : "Booker T and the MG's",
                    "title" : "Hip-Hug Her",
                    "album" : "Hip-Hug Her",
                    "albumURL" : "http://www.allmusic.com/album/hip-hug-her-r2306",
                    "label" : "Stax",
                    "year" : "1967"
                };
                break;

        }

        return intro;
    };

    return episodes;

}]);

hotcan.service('UtilityService', [
    '$rootScope'
    , function(
        $rootScope) {

        var utility = {};

        utility.transformStringToParameter = function (str) {
            var rex = /[\W^,]/g;

            function parameterize(str) {
                str = str.toLowerCase().replace(/ /g, "-");
                str = str.replace(/[^a-z-,0-9]/gi,"");
                //str = str.replace(rex, "-");
                return str;
            }


            if (angular.isString(str)) {
                return parameterize(str);
            } else if (angular.isArray(str)) {
                //        return str;
                return _.map(str, function (i) {
                    return parameterize(i);
                });
            } else {
                return str;
            }
        };

        return utility;

    }]);