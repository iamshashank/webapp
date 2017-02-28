(function() {

    angular
        .module('app')
        .controller('EventsController', [
            '$mdDialog',
            '$scope',
            '$element',
            'tokenService',
            'Upload',
            '$timeout',
            EventsController
        ]);

    function EventsController($mdDialog, $scope, $element, tokenService, Upload, $timeout) {
        var vm = this;
        $scope.grid = true;
        $scope.width = 18;
        $scope.events = [{
            "id": -1,
            "name": " ",
            "description": " ",
            "venue": " ",
            "date": " ",
            "time": " ",
            "cost": " ",
            "societyid": 1,
            "short_description": null,
            "image": "grey.png"
        }, {
            "id": -1,
            "name": " ",
            "description": " ",
            "venue": " ",
            "date": " ",
            "time": " ",
            "cost": " ",
            "societyid": 1,
            "short_description": null,
            "image": "grey.png"
        }, {
            "id": -1,
            "name": " ",
            "description": " ",
            "venue": " ",
            "date": " ",
            "time": " ",
            "cost": " ",
            "societyid": 1,
            "short_description": null,
            "image": "grey.png"
        }, {
            "id": -1,
            "name": " ",
            "description": " ",
            "venue": " ",
            "date": " ",
            "time": " ",
            "cost": " ",
            "societyid": 1,
            "short_description": null,
            "image": "grey.png"
        }];
        $scope.showReport = function(ev) {
            $mdDialog.show({
                    controller: 'DialogController',
                    templateUrl: 'app/views/partials/showReport.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: false,
                    fullscreen: false // Only for -xs, -sm breakpoints.
                })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
        };
        $scope.showEvent = function(ev, index) {
            console.log(index);
            console.log('showEvent called');
            $mdDialog.show({
                    controller: 'SingleEventController',
                    templateUrl: 'app/views/partials/singleEvent.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    locals: {
                        events: $scope.events,
                        index: index
                    },
                    closeTo: '#left',
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: true // Only for -xs, -sm breakpoints.
                })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
        };
        $scope.showAdvanced = function(ev) {
            $mdDialog.show({
                    controller: 'DialogController',
                    templateUrl: 'app/views/partials/addEvent.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: true // Only for -xs, -sm breakpoints.
                })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
        };

        $scope.showUpdates = function(ev) {
            $mdDialog.show({
                    controller: 'DialogController',
                    templateUrl: 'app/views/partials/addEvent.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: true // Only for -xs, -sm breakpoints.
                })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
        };
        $scope.addUpdate = function(ev) {
            $mdDialog.show({
                    controller: 'DialogController',
                    templateUrl: 'app/views/partials/addUpdate.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: true // Only for -xs, -sm breakpoints.
                })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
        };

        $scope.report = function() {
            console.log('testing report function');
        }
        $scope.showParticipants = function(ev) {
            $mdDialog.show({
                    controller: 'DialogController',
                    templateUrl: 'app/views/partials/showParticipants.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: true // Only for -xs, -sm breakpoints.
                })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
        };
        $scope.heart = function(event, $index) {
            $scope.events[$index].Actions.Bookmarked.status = !$scope.events[$index].Actions.Bookmarked.status;
            if ($scope.events[$index].Actions.Bookmarked.status) {
                $scope.events[$index].Actions.Bookmarked.total += 1;
            } else {
                $scope.events[$index].Actions.Bookmarked.total -= 1;
            }
        }
        $scope.update = function(event, $index) {
            $scope.events[$index].Actions.Participants.status = !$scope.events[$index].Actions.Participants.status;
        }

        tokenService.get("events")
            .then(function(tableData) {
                vm.tableData = [].concat(tableData.data);
                vm.activated = false;
                $scope.events = vm.tableData;
                console.log($scope.events);
            });
        $scope.searchTerm;
        $scope.clearSearchTerm = function() {
            $scope.searchTerm = '';
        };
        // The md-select directive eats keydown events for some quick select
        // logic. Since we have a search input here, we don't need that logic.
        $element.find('input').on('keydown', function(ev) {
            ev.stopPropagation();
        });
        vm.activated = true;
    }

})();
