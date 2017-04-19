// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})


angular.module('todo', ['ionic'])
    /**
     * The Projects factory handles saving and loading projects
     * from local storage, and also lets us save and load the
     * last active project index.
     */
    .factory('Calc', function($location) {
        return {
            // all: function() {
            //     var projectString = window.localStorage['projects'];
            //     if (projectString) {
            //         return angular.fromJson(projectString);
            //     }
            //     return [];
            // },
            // save: function(projects) {
            //     window.localStorage['projects'] = angular.toJson(projects);
            // },
            // newProject: function(projectTitle) {
            //     // Add a new project
            //     return {
            //         title: projectTitle,
            //         tasks: []
            //     };
            // },
            // getLastActiveIndex: function() {
            //     return parseInt(window.localStorage['lastActiveProject']) || 0;
            // },
            // setLastActiveIndex: function(index) {
            //     window.localStorage['lastActiveProject'] = index;
            // }

            save: function(numWrong) {
                window.localStorage['numWrong'] = numWrong;
            },

            load: function() {
                return window.localStorage['numWrong'];
            }
        }
    })

.config(function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('tabs', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html"
            })
            .state('tabs.home', {
                url: "/home",
                views: {
                    'home-tab': {
                        templateUrl: "templates/home.html",
                        controller: 'MainCtrl'
                    }
                }
            })
            .state('settings', {
                url: "/settings",
                templateUrl: "templates/settings.html"

            })
            .state('user', {
                url: "/user",
                templateUrl: "templates/user.html"

            })
            .state('results', {
                url: "/results",
                templateUrl: "templates/results.html"

            })
            .state('calcView', {
                url: "/calcView",
                templateUrl: "templates/calcView.html",
                controller: 'CalcCtrl'

            });
        $urlRouterProvider.otherwise("/tab/home");

    })
    .controller('MainCtrl', function($scope, $timeout, $ionicModal, $location, Calc, $ionicSideMenuDelegate) {
        $scope.changeView = function(view) {
            console.log('changeView: ' + view);
            $location.path(view);
        }
    })
    .controller('ResultsCtrl', function($scope, $timeout, $ionicModal, $location, Calc, $ionicSideMenuDelegate) {
        $scope.changeView = function(view) {
            console.log('changeView: ' + view);
            $location.path(view);
        }
    })
    .controller('CalcCtrl', function($scope, $timeout, $ionicModal, $location, Calc, $ionicSideMenuDelegate) {

        // Enable back button
        // $scope.$on('$ionicView.beforeEnter', function(event, viewData) {
        //     viewData.enableBack = true;
        // });

        // Change view
        $scope.changeView = function(view) {
            console.log('changeView: ' + view);
            $location.path(view);
        }


        //Calculator
        $scope.calcValueString = '';
        $scope.calcQuestionString = '';
        $scope.calcQuestionAnswer = 0;
        $scope.calcQuestionNumberTotal = 2;
        $scope.calcQuestionNumberCurrent = 0;

        $scope.calcQuestionNumberWrong = 0;

        calcQuestionStringConstruction();

        function calcQuestionStringConstruction() {
            var n1 = Math.floor(Math.random() * 100) + 1;
            var n2 = Math.floor(Math.random() * 100) + 1;
            var op = ['+', '-'];
            var idx = Math.floor(Math.random() * op.length);


            // If doing substraction ensure first number 
            // is larger than second number to avoid
            // negative answers
            if (n1 < n2 && op[idx] == '-') {
                var temp = n1;
                n1 = n2;
                n2 = temp;
            }

            if (idx == 0) {
                $scope.calcQuestionAnswer = n1 + n2;
            } else if (idx == 1) {
                $scope.calcQuestionAnswer = n1 - n2;
            }
            console.log('calcQuestionAnswer: ' + $scope.calcQuestionAnswer);
            $scope.calcQuestionString = n1 + ' ' + op[idx] + ' ' + n2;
        };

        console.log('Initial calcValueString' + $scope.calcValueString);

        $scope.calcDisplayUpdate = function(digit) {
            if (digit == 'clear') {
                $scope.calcValueString = '';
            } else if (digit == 'submit') {
                var currentValue = parseInt($scope.calcValueString);

                $scope.calcValueString = '';

                if (currentValue == $scope.calcQuestionAnswer) {
                    console.log('Correct Answer');
                    $scope.calcQuestionNumberCurrent += 1;
                    if ($scope.calcQuestionNumberCurrent == $scope.calcQuestionNumberTotal) {
                        console.log($scope.calcQuestionNumberTotal + ' correct!');
                        console.log('Changing to Results View');
                        $scope.changeView('results');
                    } else {
                        calcQuestionStringConstruction();
                    }

                } else {
                    $scope.calcQuestionNumberWrong += 1;
                    console.log('Incorrect Answer');
                }
            } else if ($scope.calcValueString.length < 5) {
                $scope.calcValueString += digit.toString();
                console.log('After update: ' + $scope.calcValueString);
            }
        }

    })
