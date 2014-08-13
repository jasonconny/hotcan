var hotCan = angular.module('hotCan', []);

hotCan.controller('EpisodeController', ['$scope', '$http', function($scope, $http) {
    $scope.url = '_res/json/001.json';


    $http({method: 'GET', url: $scope.url}).
        success(function(data, status) {

            $scope.data = data;

            $scope.episodeNumber = data.number;
            $scope.episodeTitle = data.title;

            $scope.introArtist = data.intro.artist;
            $scope.introTitle = data.intro.title;
            $scope.introAlbum = data.intro.album;
            $scope.introAlbumURL = data.intro.albumURL;
            $scope.introLabel = data.intro.label;
            $scope.introYear = data.intro.year;

        }).
        error(function(data, status) {
            console.log('get error: ' + status);
        });

}]);



