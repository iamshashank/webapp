'use strict';

(function() {

    angular
        .module('app')
        .controller('AddCreativityController', [
            '$scope',
            '$sce',
            '$timeout',
            '$mdDialog',
            'allDataService',
            'tokenService',
            '$state',
            'Upload',
            '$rootScope',
            'creativityCategories',
            'addItemService',
            '$mdBottomSheet',
            AddCreativityController
        ]);

    function AddCreativityController($scope, $sce, $timeout, $mdDialog, allDataService, tokenService, $state, Upload, $rootScope, creativityCategories, addItemService, $mdBottomSheet) {
        // 22 june
        $scope.publishable = false;
        $scope.compulsaryP = [1, 2, 17, 18, 19, 20, 21];
        $scope.onlyText = [1, 2];
        $scope.addMenu = false;
        $scope.publishFromDir = false;
        //
        // Functions
        $scope.showMenu = function() {
            if ($scope.addMenu) {
                $scope.addMenu = false;
            } else {
                $scope.addMenu = true;
            }
        };
        //
        var body = {};
        $scope.progress = 0;
        $scope.isOpen = false;
        $scope.selectedMode = 'md-scale';

        $rootScope.currentPageBackground = '#fff';
        $rootScope.title = "New Creativity";

        $scope.creativity = {};
        $scope.coverStatus = false;
        $scope.creativity.items = [];
        $scope.mediumEditor = "";
        $scope.trix = "";
        body.mediaType = "text";
        body.text = "";
        $scope.creativity.items[0] = body;
        $scope.loading = false;
        $scope.title = "";

        //imagefilter varaibles 
        $scope.filterVisible = false;
        //$scope.currentFilterId = 0;
        // $scope.filters = [
        //     { 'id': 0, 'type': 'Rotate', 'value': 0 },
        //     { 'id': 1, 'type': 'Greyscale', 'value': 0 },
        //     { 'id': 2, 'type': 'Opacity', 'value': 100 }
        // ];
        $scope.filter = {};
        $scope.filter.rotate = 0;
        $scope.filter.saturation = 100;
        $scope.filter.contrast = 100;
        $scope.filter.brightness = 100;

        $scope.css = {
            'transform': 'rotate(' + ($scope.filter.rotate) + 'deg)',
            'filter': 'saturate(' + ($scope.filter.saturation) + '%) brightness(' + ($scope.filter.brightness) + '%) contrast(' + ($scope.filter.contrast) + '%)'
        };
        $scope.$watch('filter', function(newValue, oldValue) {
            //console.log(newValue);
            $scope.css = {
                'transform': 'rotate(' + ($scope.filter.rotate) + 'deg)',
                'filter': 'saturate(' + ($scope.filter.saturation) + '%) brightness(' + ($scope.filter.brightness) + '%) contrast(' + ($scope.filter.contrast) + '%)'
            };
            // $scope.creativity.items.css = JSON.stringify($scope.css);
        }, true);


        $scope.filterToggle = function() {
            if ($scope.filterVisible)
                $scope.filterVisible = false;
            else
                $scope.filterVisible = true;
        };


        if (!localStorage.getItem('seenTutorial') || !parseInt(localStorage.getItem('tutorial'))) {
            localStorage.setItem('seenTutorial', true);
            localStorage.setItem('tutorial', 1);

            $mdDialog.show({
                controller: 'AddItemController',
                heading: 'Tutorial',
                templateUrl: 'app/views/partials/addBlogTutorial.html',
                parent: angular.element(document.body),
                locals: {
                    title: "tutorial"
                },
                clickOutsideToClose: true,
                escapeToClose: true

            }).then(function() {
                    localStorage.setItem('tutorial', parseInt(localStorage.getItem('tutorial')) + 1);
                }, function() {
                    localStorage.setItem('tutorial', parseInt(localStorage.getItem('tutorial')) + 1);
                }

            );

        } else if (parseInt(localStorage.getItem('tutorial')) < 4) {
            console.log('notlessthan3');

            $mdDialog.show({
                controller: 'AddItemController',
                heading: 'Tutorial',
                templateUrl: 'app/views/partials/addBlogTutorial.html',
                parent: angular.element(document.body),
                locals: {
                    title: "tutorial"
                },
                clickOutsideToClose: true,
                escapeToClose: true

            }).then(function() {
                    localStorage.setItem('tutorial', parseInt(localStorage.getItem('tutorial')) + 1);
                }, function() {
                    localStorage.setItem('tutorial', parseInt(localStorage.getItem('tutorial')) + 1);
                }

            );
        }
        $scope.url = "";
        $scope.media = {};
        $scope.media.embedUrl = "";
        $scope.media.mediaType = "";
        $scope.linkPreview = {};
        $scope.types = creativityCategories.types;
        $scope.items = creativityCategories.items;
        $scope.itemsMobile = creativityCategories.itemsMobile;






        $scope.contents = [

            // { 'title': 'Link', 'icon': 'link-variant' },
            // { 'title': 'Embed', 'icon': 'code-tags' },
            { 'title': 'Soundcloud', 'icon': 'soundcloud', 'style': '{fill: "#ff7700"}' },
            { 'title': 'Youtube', 'icon': 'youtube-play', 'style': '{fill: "#bb0000"}' },
            { 'title': 'Vimeo', 'icon': 'vimeo', 'style': '{fill: "#4EBBFF"}' }
        ];

        $scope.selectType = function(type) {
            $scope.progress = 1;
            $scope.creativity.type = type.id;
            $scope.categoryName = $scope.types[$scope.creativity.type - 1].title;
        };
        $scope.uploadFiles = function(files, abc) {
            $rootScope.$emit("ImagesAdded");
            $scope.files = files;
            if (files && files.length) {
                $scope.progress = 2;
                angular.forEach(files, function(file) {
                    Upload.dataUrl(file, true).then(function(url) {
                            var media = {};
                            media.mediaType = 'image';
                            media.image = url;
                            $scope.creativity.items.push(media);

                    });
                });
                $scope.addMenu = false;
            }
        };

        function tutorialController($scope, $mdDialog) {
            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };
        }

        $scope.removeCover = function() {
            for (var i = $scope.creativity.items.length - 1; i >= 0; i--) {
                if ($scope.creativity.items[i].mediaType == 'cover') {

                    console.log(i);
                    $scope.creativity.items.splice(i, 1)
                    $scope.coverStatus = false;
                }
            }

        };

        $scope.uploadCover = function(file) {
            if (file) {
                $scope.coverStatus = true;
                Upload.dataUrl(file, true).then(function(url) {
                    var cover = {};
                    cover.mediaType = 'cover';
                    cover.image = url;
                    $scope.creativity.items.push(cover);
                });
                $scope.addMenu = false;

            }
        };
        $scope.error = '';
        $rootScope.$on("returnedItem", function(event, response, error) {
            if (error) {
                $scope.error = response;
            } else {
                $scope.error = '';
                $scope.returnedItem = response;
                $scope.progress = 2;
                if (response.mediaType == 'tech') {
                    $scope.creativity.items[1] = response;
                } else if (response.mediaType == 'sourceCodeUrl') {
                    $scope.creativity.items[2] = response;
                } else {
                    $scope.creativity.items.push(response);
                }
                $scope.addMenu = false;
            }
            console.log($scope.creativity.items);

        });
        $scope.isAllowed = function(allowed, id) {
            if (id != undefined) {
                return allowed.indexOf(id) !== -1;
            }
        }

        $scope.$on("publishable", function(event, state, error) {
            $scope.error = error;
            // Set variable when confirmed from respective directives 
            $scope.publishFromDir = state;
        });
        $scope.checkPublish = function() {
            if ($scope.isAllowed($scope.compulsaryP, $scope.creativity.type)) {
                // If a category only text as compulsion we have to check weather min text is added or not
                $scope.textAdded = (($scope.mediumEditor || $scope.trix) && ($scope.mediumEditor.length > 20 || $scope.trix.length > 20));
                if ($scope.isAllowed($scope.onlyText, $scope.creativity.type)) {
                    // If a category has only text as compulsion it wont have publishFromDir
                    $scope.publishable = $scope.textAdded;
                } else {
                    $scope.publishable = $scope.textAdded && ($scope.publishFromDir);
                }
            } else {
                $scope.publishable = ($scope.publishFromDir);
            }
            var abc = (!($scope.title && $scope.publishable) || $scope.loading);
            return abc;
        }
        $scope.checkEditor = function() {
            console.log('checkEditor called');
            if ($scope.mediumEditor > $scope.trix) {
                $scope.creativity.items[0].text = $scope.mediumEditor;
                console.log($scope.creativity.items[0]);
            } else if ($scope.mediumEditor < $scope.trix) {
                $scope.creativity.items[0].text = $scope.trix;
                console.log($scope.creativity.items[0]);
            } else {
                console.log('else');
                $scope.creativity.items[0].text = '';
            }
        };


        $scope.publish = function() {
            $scope.checkEditor();
            $scope.loading = true;
            $scope.image = {};
            $scope.creativity.tags = $scope.tags;
            $scope.creativity.title = $scope.title;
            console.log($scope.creativity);
            tokenService.post("addContent", $scope.creativity)
                .then(function(status) {
                    alert(status.message);
                    if (status.status) {

                        $state.go('home.dashboard');
                    }
                    $state.go('home.dashboard');
                }).catch(function(status) {
                    alert(status.message);
                    $state.go('home.dashboard');
                    if (status.status) {

                        $state.go('home.dashboard');
                    }
                });

        };


        // Add tags shit staeted
        $scope.readonly = false;
        $scope.removable = true;
        $scope.selectedItem = null;
        $scope.searchText = null;
        $scope.querySearch = querySearch;
        $scope.vegetables = loadVegetables();
        $scope.tags = [];

        /**
         * Return the proper object when the append is called.
         */
        function transformChip(chip) {
            // If it is an object, it's already a known chip
            if (angular.isObject(chip)) {
                return chip;
            }
            // Otherwise, create a new one
            return { name: chip };
        }

        /**
         * Search for vegetables.
         */
        function querySearch(query) {
            console.log('query funciton called');
            var results = query ? $scope.vegetables.filter(createFilterFor(query)) : [];
            return results;
        }
        var numberChips = [];
        var numberChips2 = [];
        var numberBuffer = '';
        $scope.autocompleteDemoRequireMatch = false;
        $scope.transformChip = transformChip;

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
            var veggies = [];

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
