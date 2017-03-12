(function() {

    angular
        .module('app')
        .controller('AddBlogController', [
            '$scope',
            'Upload',
            '$sce',
            '$timeout',
            '$mdDialog',
            'tokenService',
            AddBlogController
        ]);

    function AddBlogController($scope, Upload, $sce, $timeout, $mdDialog, tokenService) {
        var vm = this;
        $scope.progress = 0;
        $scope.content = {};
        $scope.title = "";
        $scope.body = {};
        $scope.body.text = "";
        $scope.url = "";
        $scope.media = {};
        $scope.media.embedUrl = "";
        $scope.media.mediaType = "";
        $scope.items = [];
        $scope.items[0] = [
            { 'title': 'Articles', 'id': 1, 'intrested': false },
            { 'title': 'Poetry', 'id': 1, 'intrested': false },
            { 'title': 'Drama', 'id': 1, 'intrested': false },
            { 'title': 'Painting', 'id': 1, 'intrested': false }
        ];
        $scope.items[1] = [
            { 'title': 'Sketching', 'id': 1, 'intrested': false },
            { 'title': 'Manga', 'id': 1, 'intrested': false },
            { 'title': 'Craft', 'id': 1, 'intrested': false },
            { 'title': 'Song Covers', 'id': 1, 'intrested': false },
            { 'title': 'Instrumental', 'id': 1, 'intrested': false }

        ];
        $scope.items[2] = [
            { 'title': 'Music Mixing', 'id': 1, 'intrested': false },
            { 'title': 'Photography', 'id': 1, 'intrested': false },
            { 'title': 'Apps', 'id': 1, 'intrested': false },
            { 'title': 'Apps', 'id': 1, 'intrested': false }

        ];
        $scope.items[3] = [
            { 'title': 'Apps', 'id': 1, 'intrested': false },
            { 'title': 'Apps', 'id': 1, 'intrested': false },
            { 'title': 'Film and Video', 'id': 1, 'intrested': false },
            { 'title': 'Animation', 'id': 1, 'intrested': false },
            { 'title': 'Graphics', 'id': 1, 'intrested': false }
        ];
        $scope.items[4] = [

            { 'title': 'UI and UX', 'id': 1, 'intrested': false },
            { 'title': 'Webites', 'id': 1, 'intrested': false },
            { 'title': 'Apps', 'id': 1, 'intrested': false }
        ];
        $scope.contents = [

            { 'title': 'Text', 'icon': 'comment-text' },
            { 'title': 'Image', 'icon': 'image' },
            { 'title': 'Link', 'icon': 'link-variant' },
            { 'title': 'Embed', 'icon': 'code-tags' },
            { 'title': 'Soundcloud', 'icon': 'soundcloud' },
            { 'title': 'Youtube', 'icon': 'youtube-play' },
            { 'title': 'Vimeo', 'icon': 'vimeo' }
        ];
        $scope.selectType = function(type) {
            $scope.progress = 1;
            $scope.content.type = type;
        };
        $scope.addItem = function(title) {
            if (title == "Text") {
                $scope.progress = 2;
            } else {
                $mdDialog.show({
                    controller: AddItemController,
                    templateUrl: 'app/views/partials/addItem.html',
                    parent: angular.element(document.body),
                    // targetEvent: ev,
                    locals: {
                        title: title
                    },
                    clickOutsideToClose: true,
                }).then(function(media) {

                    $scope.progress = 2;
                    $scope.media = media;
                }, function() {
                    console.log('else');
                });
            }
        };

        function AddItemController($mdDialog, $scope, Upload, $timeout, title) {
            $scope.error = '';
            $scope.url = '';
            $scope.mediaType = "";

            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.submitUrl = function(url) {
                $scope.url = url;
                console.log($scope.url)
                switch (title) {
                    case 'Youtube':
                        $scope.error = '';
                        $scope.item = {};
                        var videoid = $scope.url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
                        if (videoid != null) {
                            $scope.item.mediaType = "youtube";
                            $scope.item.embedUrl = "//www.youtube.com/embed/" + videoid[1];
                            $scope.item.embedUrlIframe = $sce.trustAsResourceUrl($scope.item.embedUrl);
                            $mdDialog.hide($scope.item);
                        } else {
                            $scope.error = 'Invalid youtube url';
                            console.log('Invalid youtube url');
                        }
                        break;
                    case 'Soundcloud':
                        $scope.error = '';
                        $scope.item = {};
                        if ($scope.validateSoundcloud($scope.url)) {
                            $scope.item.mediaType = "soundcloud";
                            $scope.item.embedUrl = "//w.soundcloud.com/player/?url=" + $scope.url;
                            $scope.item.embedUrlIframe = $sce.trustAsResourceUrl($scope.item.embedUrl);
                            var widgetIframe = document.getElementById('sc-widget'),
                                widget = SC.Widget(widgetIframe),
                                newSoundUrl = $scope.embedUrl;
                            widget.bind(SC.Widget.Events.READY, function() {
                                // load new widget
                                widget.bind(SC.Widget.Events.FINISH, function() {
                                    widget.load(newSoundUrl, {
                                        show_artwork: false
                                    });
                                });
                            });
                            $mdDialog.hide($scope.item);
                        } else {
                            $scope.error = 'Invalid soundcloud url';
                            console.log('Invalid soundcloud url');
                            $scope.mediaType = "";
                        }
                        break;
                    case 'Vimeo':
                        $scope.error = '';
                        var videoid = $scope.url.match(/https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/);
                        if (videoid != null) {
                            $scope.item = {};
                            $scope.item.mediaType = "vimeo";
                            $scope.item.embedUrl = "//player.vimeo.com/video/" + videoid[3];
                            $scope.item.embedUrlIframe = $sce.trustAsResourceUrl($scope.item.embedUrl);
                            $mdDialog.hide($scope.item);
                        } else {
                            $scope.error = 'Invalid vimeo url';
                            console.log("Invalid vimeo url");
                            $scope.mediaType = "";
                        }
                        break;
                    default:
                }
            }
            $scope.validateSoundcloud = function(url) {
                var regexp = /^https?:\/\/(soundcloud\.com|snd\.sc)\/(.*)$/;
                return url.match(regexp) && url.match(regexp)[2]
            }
        }

        $scope.upload = function(dataUrl, name) {
            Upload.upload({
                url: '//upload.campusbox.org/imageUpload.php',
                method: 'POST',
                file: Upload.dataUrltoBlob(dataUrl, name),
                data: {
                    'targetPath': './media/'
                },
            }).then(function(response) {
                $timeout(function() {
                    $scope.result = response.data;
                });
            }, function(response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function(evt) {
                $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
            });
        }
        $scope.uploadFiles = function(files, errFiles) {
            $scope.files = files;
            $scope.errFiles = errFiles;
            angular.forEach(files, function(file) {
                file.upload = Upload.upload({
                    url: 'http://upload.campusbox.org/imageUpload.php',
                    file: file,
                    data: {
                        'targetPath': './media/'
                    }
                });

                file.upload.then(function(response) {
                    $timeout(function() {
                        file.result = response.data;
                    });
                }, function(response) {
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                }, function(evt) {
                    file.progress = Math.min(100, parseInt(100.0 *
                        evt.loaded / evt.total));
                });
            });
        }

        $scope.publish = function() {
            $scope.content.items = [];
            $scope.content.items.push($scope.media);
            $scope.body.mediaType = "text";
            $scope.content.items.push($scope.body);
            $scope.content.tags = $scope.tags;
            $scope.content.title = $scope.title;
            $scope.content.body = $scope.body;
            console.log($scope.content);
            tokenService.post("addContent", $scope.content)
                .then(function(abc) {
                    console.log(abc);
                }).catch(function(abc) {
                    console.log(abc);
                });
        }

        // Add tags shit staeted
        $scope.readonly = false;
        $scope.removable = true;
        $scope.selectedItem = null;
        $scope.searchText = null;
        $scope.querySearch = querySearch;
        $scope.vegetables = loadVegetables();
        $scope.tags = [{
            'name': 'Broccoli'
        }, {
            'name': 'Cabbage'
        }];
        numberChips = [];
        numberChips2 = [];
        numberBuffer = '';
        $scope.autocompleteDemoRequireMatch = false;
        $scope.transformChip = transformChip;

        /**
         * Return the proper object when the append is called.
         */
        function transformChip(chip) {
            // If it is an object, it's already a known chip
            if (angular.isObject(chip)) {
                return chip;
            }

            // Otherwise, create a new one
            return { name: chip }
        }

        /**
         * Search for vegetables.
         */
        function querySearch(query) {
            console.log('query funciton called');
            var results = query ? $scope.vegetables.filter(createFilterFor(query)) : [];
            return results;
        }

        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(vegetable) {
                return (vegetable._lowername.indexOf(lowercaseQuery) === 0);
                // (vegetable._lowertype.indexOf(lowercaseQuery) === 0);
            };

        }

        function loadVegetables() {
            var veggies = [{
                'name': 'Broccoli'
            }, {
                'name': 'Cabbage'
            }, {
                'name': 'Carrot'
            }, {
                'name': 'Lettuce'
            }, {
                'name': 'Spinach'
            }];

            return veggies.map(function(veg) {
                veg._lowername = veg.name.toLowerCase();
                return veg;
            });
        }
        $scope.skillsEdit = function() {
            $scope.readonly = !$scope.readonly;
            $scope.removable = !$scope.removable;
        }

        // Add tags shit ended
    }

})();
