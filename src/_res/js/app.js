var hotcan = angular.module('hotcan', ['ui.router']);

// ROUTES
hotcan.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    // URL rewrite exceptions for legacy URLs that don't conform to the pattern
    $urlRouterProvider.when('/', ['$state', function($state) {
        $state.go('episode', {'episodeName':'beginnings'});
    }]).when('/category/podcast/', ['$state', function($state) {
        $state.go('all');
    }]).when('/podcast/the-hot-can-all-vinyl-power-hour-episode-1', ['$state', function($state) {
        $state.go('episode', {'episodeName':'beginnings'});
    }]).when('/podcast/the-hot-can-all-vinyl-power-hour-episode-2', ['$state', function($state) {
        $state.go('episode', {'episodeName':'groove-and-move'});
    }]).when('/podcast/the-hot-can-all-vinyl-power-hour-episode-4', ['$state', function($state) {
        $state.go('episode', {'episodeName':'y-sharp'});
    }]).when('/podcast/the-hot-can-all-vinyl-power-hour-episode-7', ['$state', function($state) {
        $state.go('episode', {'episodeName':'funky-doo'});
    }]).when('/podcast/the-hot-can-all-vinyl-power-hour-episode-10', ['$state', function($state) {
        $state.go('episode', {'episodeName':'lotus-flower'});
    }]).when('/podcast/the-hot-can-all-vinyl-power-hour-episode-11', ['$state', function($state) {
        $state.go('episode', {'episodeName':'do-your-thing'});
    }]).when('/podcast/the-hot-can-all-vinyl-power-hour-episode-12', ['$state', function($state) {
        $state.go('episode', {'episodeName':'open-country-joy'});
    }]).when('/podcast/the-hot-can-all-vinyl-power-hour-episode-35', ['$state', function($state) {
        $state.go('episode', {'episodeName':'cold-duck-time'});
    }]).when('/podcast/the-hot-can-all-vinyl-power-hour-episode-100--never-ending-melody', ['$state', function($state) {
        $state.go('episode', {'episodeName':'never-ending-melody'});
    }]);


    // General URL rewrite rule for legacy URLs
    $urlRouterProvider.rule(function($injector, $location) {
        var path = $location.path();
        if (path.indexOf('/podcast/') > -1) {
            var newRoute,
                key = path.split('/')[2].split('-')[8];

            if(key > 9) {
                newRoute = path.split('/')[2].slice(44);
            } else {
                newRoute = path.split('/')[2].slice(43);
            }

            $location.replace().path(newRoute);
        }
    });

    $stateProvider.state('main', {
        url: '',
        abstract: true,
        views: {
            main: {}
        }
    }).state('all', {
        url: '/all',
        parent: 'main',
        views: {
            content: {templateUrl: "_res/views/all.html"}
        }
    }).state('about', {
        url: '/about',
        views: {
            content: {templateUrl: "_res/views/about.html"}
        }
    }).state('contact', {
        url: '/contact',
        views: {
            content: {templateUrl: "_res/views/contact.html"}
        }
    }).state('forContentOwners', {
        url: '/for-content-owners',
        views: {
            content: {templateUrl: "_res/views/forContentOwners.html"}
        }
    }).state('notfound', {
        url: '/uhoh',
        views: {
            content: {templateUrl: "_res/views/notfound.html"}
        }
    }).state('episode', {
        url: '/:episodeName',
        parent: 'main',
        views: {
            content: {templateUrl: "_res/views/episode.html"}
        }
    });

}]);

hotcan.run(['$state', '$anchorScroll', '$window', function($state, $anchorScroll, $window) {
    // hack to scroll to top when navigating to new URLS but not back/forward
    var wrap = function(method) {
        var orig = $window.window.history[method];
        $window.window.history[method] = function() {
            var retval = orig.apply(this, Array.prototype.slice.call(arguments));
            $anchorScroll();
            return retval;
        };
    };
    wrap('pushState');
    wrap('replaceState');
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
    if (!episode.key) {
        // if there's no episode key it's likely because a matching route name wasn't found for the current view name
        // in this case redirect to not found view
        $state.go('notfound');
    }
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
                console.log('data retrieved');
                return response;
            });
    };

    episodes.getIntro = function(intro) {
        switch(intro) {
            case "Linus And Lucy":
                intro = {
                    "artist" : "The Vince Guaraldi Trio",
                    "title" : "Linus And Lucy",
                    "album" : "A Charlie Brown Christmas",
                    "albumURL" : "http://www.allmusic.com/album/a-charlie-brown-christmas-mw0000649547",
                    "label" : "Fantasy",
                    "year" : "1965"
                };
                break;
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
                    "artist" : "Booker T & The M.G.s",
                    "title" : "Hip Hug-Her",
                    "album" : "Hip Hug-Her",
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

hotcan.service('UtilityService', function() {

    var utility = {};

    utility.transformStringToParameter = function (str) {

        function parameterize(str) {
            str = str.toLowerCase().replace(/ /g, "-");
            str = str.replace(/[^a-z-,0-9]/gi,"");
            return str;
        }


        if (angular.isString(str)) {
            return parameterize(str);
        } else if (angular.isArray(str)) {
            return _.map(str, function (i) {
                return parameterize(i);
            });
        } else {
            return str;
        }
    };

    return utility;

});