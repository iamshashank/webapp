(function() {
    'use strict';

    angular.module('app').
    directive('addDrawing', function() {
        return {
            restrict: "E",
            replace: true,
            templateUrl: 'app/components/addCreativity/itemCards/addDrawing.html',
            controller: function($scope, addItemService, $sce) {
                //Define Variables
                $scope.allowedDrawing = [4, 5];
                $scope.musicAdded = false;
                $scope.enterUrl = true;
                //End Defining variables

                $scope.checkVideo = function() {
                    if ($scope.creativity.items[0] == undefined || $scope.musicAdded) {
                        $scope.musicAdded = false;
                    } else {
                        $scope.musicAdded = true;

                    }
                }
                $scope.instagram = function() {
                    var url = 'https://www.instagram.com/p/BVpn4AfHqXJ/?r=wa1';
                    // var result = url.replace(/(^\w+:|^)\/\//, '');
                    url = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "");
                    url = 'https://' + url;
                }
                $scope.removeItem = function(index) {
                    $scope.creativity.items.splice(index, 1);
                    $scope.musicAdded = false;
                }
                $scope.addDrawing = function(url) {
                    if ($scope.validateYoutube(url)) {
                        if ($scope.creativity.items.length > 1) {
                            $scope.creativity.items.pop();
                        }
                        $scope.setNoembed(url);
                        $scope.checkVideo();
                        addItemService.youtube(url);
                    } else if ($scope.validateSoundcloud(url)) {
                        if ($scope.creativity.items.length > 1) {
                            $scope.creativity.items.pop();
                        }
                        addItemService.soundcloud(url);
                        $scope.setNoembed(url);
                        $scope.checkVideo();
                    } else if ($scope.validateVimeo(url)) {
                        if ($scope.creativity.items.length > 1) {
                            $scope.creativity.items.pop();
                        }
                        addItemService.vimeo(url);
                        $scope.setNoembed(url);
                        $scope.checkVideo();
                    } else {
                        $scope.error = 'Enter a valid Youtube, Soundcloud or Vimeo url.'
                    }
                };
            }
        };
    });

})();
