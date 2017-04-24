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

            save: function(calcData) {
                window.localStorage['calcData'] = calcData;
            },

            load: function() {
                return window.localStorage['calcData'];
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
                templateUrl: "templates/results.html",
                controller: 'ResultsCtrl'

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
        };
    })
    .controller('ResultsCtrl', function($scope, $timeout, $ionicModal, $location, Calc, $ionicSideMenuDelegate) {
        // $scope.changeView = function(view) {
        //     console.log('changeView: ' + view);
        //     $location.path(view);
        // }

        // No promise so .then doesn't work
        // Calc.load().then(function(data) {
        //     $scope.calcData = JSON.parse(data);
        //     console.log($scope.calcData);
        // }).error(function(error) {
        //     $scope.status = "ResultsCtrl Calc load error: " + error;
        //     console.log($scope.status);
        // });

        $scope.calcData = JSON.parse(Calc.load());
        console.log('ResultsCtrl calcData');
        console.log($scope.calcData);

    })
    .controller('CalcCtrl', function($scope, $state, $timeout, $ionicModal, $location, Calc, $ionicSideMenuDelegate) {

        // Enable back button
        // $scope.$on('$ionicView.beforeEnter', function(event, viewData) {
        //     viewData.enableBack = true;
        // });


        //Calculator
        $scope.calcValueString = '';
        $scope.calcQuestionString = '';
        $scope.calcQuestionAnswer = 0;

        $scope.calcQuestionNumberTotal = 2;
        $scope.calcQuestionNumberCurrent = 0;
        $scope.calcQuestionMistakes = 0;

        // Change view
        $scope.changeView = function(view) {
            console.log('changeView: ' + view);
            $location.path(view);
        };


        // Timer, based off http://www.devblogrbmz.com/building-a-very-simple-timer-in-angularjs/
        $scope.counter = 0;
        var mytimeout = null;

        if ($scope.counter === 0) {
            console.log('$scope.counter is 0');
        }

        $scope.onTimeout = function() {
            if ($scope.counter === 20) {
                $scope.$broadcast('timer-stopped', $scope.counter);
                $timeout.cancel(mytimeout);
                return;
            }
            $scope.counter++;
            mytimeout = $timeout($scope.onTimeout, 1000);
        };

        $scope.startTimer = function() {
            mytimeout = $timeout($scope.onTimeout, 1000);
        };

        // stop and reset current timer
        $scope.stopTimer = function() {
            $scope.$broadcast('timer-stopped', $scope.counter);
            $scope.counter = 0;
            $timeout.cancel(mytimeout);
        };
        // triggered, when the timer stops, you can do something here, maybe show a visual indicator or vibrate the device
        $scope.$on('timer-stopped', function(event, elapsed) {
            console.log(event, elapsed);
            // console.log('You\'ve spent way too long on your questions!');

        });

        // Create arithmetic questions
        function calcQuestionStringConstruction() {
            var n1 = Math.floor(Math.random() * 100) + 1;
            var n2 = Math.floor(Math.random() * 100) + 1;
            var op = ['+', '-'];
            var idx = Math.floor(Math.random() * op.length);


            // If doing substraction ensure first number 
            // is larger than second number to avoid
            // negative answers
            // if (n1 < n2 && op[idx] == '-') {
            //     var temp = n1;
            //     n1 = n2;
            //     n2 = temp;
            // }

            if (idx == 0) {
                $scope.calcQuestionAnswer = n1 + n2;
            } else if (idx == 1) {
                $scope.calcQuestionAnswer = n1 - n2;
            }
            console.log('Current calcQuestionAnswer: ' + $scope.calcQuestionAnswer);
            $scope.calcQuestionString = n1 + ' ' + op[idx] + ' ' + n2;
        };

        console.log('Initial calcValueString' + $scope.calcValueString);

        $scope.calcDisplayUpdate = function(digit) {
            // Clear button pressed - clear number
            if (digit == 'clear') {
                $scope.calcValueString = '';
            } else if (digit == 'negativeToggle') {
                if ($scope.calcValueString[0] == '-') {
                    $scope.calcValueString = $scope.calcValueString.substring(1);
                } else {
                    $scope.calcValueString = '-' + $scope.calcValueString;
                }
                console.log('After negativeToggle: ' + $scope.calcValueString);

            } else if (digit == 'decimal') {
                console.log('Decimal not yet implemented');
            }
            // Submit button pressed - submit number
            else if (digit == 'submit') {
                var currentValue = parseInt($scope.calcValueString);
                console.log('currentValue: ' + currentValue);

                if (currentValue == $scope.calcQuestionAnswer) {
                    console.log('Correct Answer');
                    $scope.calcQuestionNumberCurrent += 1;
                    if ($scope.calcQuestionNumberCurrent == $scope.calcQuestionNumberTotal) {
                        console.log('All ' + $scope.calcQuestionNumberTotal + ' correct!');

                        // Data transfer to Results view
                        console.log($scope.counter);
                        var calcData = {
                            time: $scope.counter,
                            questionsTotal: $scope.calcQuestionNumberTotal,
                            mistakes: $scope.calcQuestionMistakes
                        };
                        // Reset Calc
                        // $scope.calcQuestionNumberCurrent = 0;
                        $scope.stopTimer();
                        mytimeout = null;

                        // Todo write on-success callback
                        Calc.save(JSON.stringify(calcData));

                        console.log('Changing to Results View');
                        // $scope.changeView('results');
                        $state.reload();
                        $state.go('results');
                    } else {
                        calcQuestionStringConstruction();
                    }

                } else {
                    $scope.calcQuestionMistakes += 1;
                    console.log('Incorrect Answer');
                }

                $scope.calcValueString = '';

            }
            // Digit pressed - add digit to end of current number
            else if ($scope.calcValueString.length < 5 && (typeof digit === 'number') && Math.floor(digit) === digit) {
                $scope.calcValueString += digit.toString();
                console.log('After update: ' + $scope.calcValueString);
            }
            // else if ($scope.calcValueString.length  5)
            // Unexpected behavior check
            else {
                console.log('Error: CalcCtrl controller calcDisplayUpdate no actions triggered');
            }
        };




        $scope.startTimer();
        calcQuestionStringConstruction();



    });
