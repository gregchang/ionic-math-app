// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('todo', ['ionic', 'firebase'])
    .constant('FirebaseUrl', 'https://mathfast-3bcce.firebaseio.com/')
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
    .factory("Auth", ["$firebaseAuth",
        function($firebaseAuth) {
            return $firebaseAuth();
        }
    ])

// angular.module('todo', ['ionic', 'firebase'])
/**
 * The Projects factory handles saving and loading projects
 * from local storage, and also lets us save and load the
 * last active project index.
 */
.factory('Calc', function($location) {
    return {
        save: function(calcData) {
            window.localStorage['calcData'] = calcData;
        },

        load: function() {
            return window.localStorage['calcData'];
        }
    }
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $ionicConfigProvider.tabs.position('bottom');

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
            .state('tabs.user', {
                url: "/user",
                views: {
                    'user-tab': {
                        templateUrl: "templates/user.html",
                        controller: 'UserCtrl'
                    }
                }
            })
            .state('tabs.settings', {
                url: "/settings",
                views: {
                    'settings-tab': {
                        templateUrl: "templates/settings.html",
                        controller: 'SettingsCtrl'
                    }
                }
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

            })
            .state('login', {
                url: "/login",
                templateUrl: "templates/login.html",
                controller: 'LoginCtrl'

            });
        // $urlRouterProvider.otherwise("/tab/home");
        $urlRouterProvider.otherwise("/login");


    })
    .controller('LoginCtrl', function($scope, $state, $timeout, $ionicModal, $location, Calc, $ionicSideMenuDelegate, $firebaseAuth) {

        // // Initialize Firebase
        // var config = {
        //     apiKey: "AIzaSyAmX_xBU-aSgSZ-B-hrw3i8Hg9s23KvZHM",
        //     authDomain: "mathfast-3bcce.firebaseapp.com",
        //     databaseURL: "https://mathfast-3bcce.firebaseio.com",
        //     projectId: "mathfast-3bcce",
        //     storageBucket: "mathfast-3bcce.appspot.com",
        //     messagingSenderId: "418145274696"
        // };
        // firebase.initializeApp(config);

        // // FirebaseUI config.
        // var uiConfig = {
        //     // signInSuccessUrl: '<url-to-redirect-to-on-success>',
        //     signInSuccessUrl: '#/tab/home',
        //     signInOptions: [
        //         // Leave the lines as is for the providers you want to offer your users.
        //         // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        //         // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        //         // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        //         // firebase.auth.GithubAuthProvider.PROVIDER_ID,
        //         // firebase.auth.EmailAuthProvider.PROVIDER_ID
        //         {
        //             provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        //             requireDisplayName: false
        //         }

        //     ],
        //     // Terms of service url.
        //     tosUrl: '<your-tos-url>',
        //     signInFlow: 'popup',
        //     credentialHelper: firebaseui.auth.CredentialHelper.NONE
        // };

        // // Initialize the FirebaseUI Widget using Firebase.
        // var ui = new firebaseui.auth.AuthUI(firebase.auth());
        // // The start method will wait until the DOM is loaded.
        // ui.start('#firebaseui-auth-container', uiConfig);

        var auth = $firebaseAuth();

        // login with Facebook
        // auth.$signInWithPopup("facebook").then(function(firebaseUser) {
        //     console.log("Signed in as:", firebaseUser.uid);
        // }).catch(function(error) {
        //     console.log("Authentication failed:", error);
        // });

        $scope.signIn = function() {
            $scope.firebaseUser = null;
            $scope.error = null;

            auth.$signInAnonymously().then(function(firebaseUser) {
                $scope.firebaseUser = firebaseUser;
                $state.go('tabs.home');
                console.log("Anonymous login success: " + firebaseUser.uid);
            }).catch(function(error) {
                $scope.error = error;
                $state.go('tabs.home');
                console.log("Anonymous login error: " + error);
            });
        };
        $scope.signIn();

    })
    .controller('UserCtrl', function($scope, $timeout, $ionicModal, $location, Calc, $ionicSideMenuDelegate, $firebaseAuth) {

    })
    .controller('SettingsCtrl', function($scope, $timeout, $ionicModal, $location, Calc, $ionicSideMenuDelegate) {

    })
    .controller('MainCtrl', function($scope, $state, $timeout, $ionicModal, $location, Calc, $ionicSideMenuDelegate) {

        $scope.gameSettings = {}
        $scope.gameSettings.lengthValue = 10;
        $scope.gameSettings.difficultyValue = 1;

        $scope.operationToggleValue = {
            add: false,
            subtract: false,
            multiply: false,
            divide: false
        };

        // Create and load recap Modal
        $ionicModal.fromTemplateUrl('homehelp.html', function(modal) {
            $scope.homeHelpModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });

        // Open recap modal
        $scope.openHelp = function() {
            $scope.homeHelpModal.show();
        };

        // Close recap modal
        $scope.closeHelp = function() {
            $scope.homeHelpModal.hide();
        };

        $scope.changeView = function(view) {
            console.log('changeView: ' + view);
            $location.path(view);
        };

        $scope.checkStartGameEnabled = function() {
            $scope.startGameEnabled = $scope.operationToggleValue.add || $scope.operationToggleValue.subtract || $scope.operationToggleValue.multiply || $scope.operationToggleValue.divide;
        };

        $scope.startGame = function() {
            $scope.calcData = {
                uid: $scope.firebase_uid,
                difficulty: $scope.gameSettings.difficultyValue,
                time: -1,
                roundedTime: -1,
                questionsTotal: $scope.gameSettings.lengthValue,
                mistakes: -1,
                operations: $scope.operationToggleValue,
                questionLog: []
            };

            Calc.save(JSON.stringify($scope.calcData));
            console.log("Starting game");
            $state.go('calcView');
        };

        // firebase.auth().onAuthStateChanged(function(user) {
        //     if (user) {
        //         // User is signed in.
        //         var isAnonymous = user.isAnonymous;
        //         var uid = user.uid;
        //         $scope.firebase_uid = user.uid;
        //         console.log("User is signed in: " + uid + ", " + isAnonymous);
        //         // ...
        //     } else {
        //         // User is signed out.
        //         console.log("User is signed out");
        //     }
        // });


        $scope.$on('$ionicView.beforeEnter', function() {
            // if (localStorage.getItem('bestTimePerQuestion') === null) {
            //     $scope.bestTimePerQuestion = "N/A";
            // } else {
            //     $scope.bestTimePerQuestion = localStorage.getItem('bestTimePerQuestion');
            //     console.log('$scope.bestTimePerQuestion: ' + $scope.bestTimePerQuestion);
            // }
        });


    })
    .controller('ResultsCtrl', function($scope, $timeout, $ionicModal, $location, Calc, $ionicSideMenuDelegate, Auth) {

        // No promise so .then doesn't work
        // Calc.load().then(function(data) {
        //     $scope.calcData = JSON.parse(data);
        //     console.log($scope.calcData);
        // }).error(function(error) {
        //     $scope.status = "ResultsCtrl Calc load error: " + error;
        //     console.log($scope.status);
        // });

        $scope.$on('$ionicView.beforeEnter', function() {
            // $scope.rank = '. . .';
            $scope.calcData = JSON.parse(Calc.load());

            // window.localStorage.setItem('bestTimePerQuestion', $scope.calcData.roundedTime / $scope.calcData.questionsTotal);

            // var database = firebase.database();

            // http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
            // function guid() {
            //     function s4() {
            //         return Math.floor((1 + Math.random()) * 0x10000)
            //             .toString(16)
            //             .substring(1);
            //     }
            //     return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            //         s4() + '-' + s4() + s4() + s4();
            // }

            // var uuid = guid();
            // firebase.database().ref('scores/' + uuid).set({
            //     score: $scope.calcData.roundedTime
            // });

            // $scope.scores = [];
            // firebase.database().ref('/scores/').once('value').then(function(snapshot) {
            //     var s = snapshot.val();

            //     for (var key in s) {
            //         $scope.scores.push(s[key].score);
            //     }
            //     console.log('$scope.scores: ' + $scope.scores);

            //     $scope.scores.sort(function(a, b) {
            //         return a - b;
            //     });
            //     console.log('$scope.scores: ' + $scope.scores);
            //     var rank = $scope.scores.indexOf($scope.calcData.roundedTime) + 1;
            //     $scope.rank = 'Top ' + Math.floor(rank / $scope.scores.length * 100) + '%';
            //     console.log('rank: ' + rank);
            // });

        });

        // Create and load recap Modal
        $ionicModal.fromTemplateUrl('recap.html', function(modal) {
            $scope.recapModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });

        // Open recap modal
        $scope.openRecap = function() {
            $scope.recapModal.show();
        };

        // Close recap modal
        $scope.closeRecap = function() {
            $scope.recapModal.hide();
        };

        $scope.recapColor = function(correct) {
            if (correct) {
                return 'green';
            } else {
                return 'red';
            }
        }

        // Create and load results help Modal
        $ionicModal.fromTemplateUrl('resultshelp.html', function(modal) {
            $scope.resultsHelpModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });

        // Open recap modal
        $scope.openResultsHelp = function() {
            $scope.resultsHelpModal.show();
        };

        // Close recap modal
        $scope.closeResultsHelp = function() {
            $scope.resultsHelpModal.hide();
        };

    })
    .controller('CalcCtrl', function($scope, $state, $window, $timeout, $ionicModal, $location, Calc, $ionicSideMenuDelegate) {

        // Enable back button
        // $scope.$on('$ionicView.beforeEnter', function(event, viewData) {
        //     viewData.enableBack = true;
        // });

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
            // Prevents never-ending game
            if ($scope.counter === 100000) {
                $scope.$broadcast('timer-stopped', $scope.counter);
                $timeout.cancel(mytimeout);
                return;
            }
            $scope.counter++;
            mytimeout = $timeout($scope.onTimeout, 100);
        };

        $scope.startTimer = function() {
            mytimeout = $timeout($scope.onTimeout, 100);
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

        $scope.endGame = function() {

            console.log('All ' + $scope.calcQuestionNumberTotal + ' correct!');

            // Data transfer to Results view
            console.log('$scope.counter: ' + $scope.counter);
            $scope.calcData.mistakes = $scope.calcQuestionMistakes;

            // Mistakes incur 5 second penalties
            $scope.calcData.roundedTime = (($scope.calcData.time / 10) + ($scope.calcData.mistakes * 5)).toFixed(1);
            console.log('$scope.calcData.roundedTime: ' + $scope.calcData.roundedTime);

            $scope.stopTimer();

            console.log('saving data', JSON.stringify($scope.calcData));
            // Todo write on-success callback
            Calc.save(JSON.stringify($scope.calcData));

            console.log('Changing to Results View');
            $state.go('results');
        }

        // Create arithmetic questions
        function calcQuestionStringConstruction() {
            var plusMinusMultiplier;
            var multDivMultiplier;
            if ($scope.calcData.difficulty == 1) {
                plusMinusMultiplier = 9;
                multDivMultiplier = 4;
            } else if ($scope.calcData.difficulty == 2) {
                plusMinusMultiplier = 49;
                multDivMultiplier = 9;
            } else if ($scope.calcData.difficulty == 3) {
                plusMinusMultiplier = 99;
                multDivMultiplier = 19;
            }

            var n1 = Math.floor(Math.random() * plusMinusMultiplier) + 1;
            var n2 = Math.floor(Math.random() * plusMinusMultiplier) + 1;

            var idx = Math.floor(Math.random() * $scope.op.length);

            if ($scope.op[idx] == '×') {
                var n1 = Math.floor(Math.random() * multDivMultiplier) + 1;
                var n2 = Math.floor(Math.random() * multDivMultiplier) + 1;
            } else if ($scope.op[idx] == '÷') {
                var n2 = Math.floor(Math.random() * multDivMultiplier) + 1;
                var n1 = n2 * (Math.floor(Math.random() * multDivMultiplier) + 1);
            }

            console.log("$scope.calcData.difficulty: " + $scope.calcData.difficulty)

            if ($scope.calcData.difficulty == 3) {
                console.log("posOrNeg");
                var posOrNeg1 = Math.random() < 0.5 ? -1 : 1;
                var posOrNeg2 = Math.random() < 0.5 ? -1 : 1;
                n1 *= posOrNeg1;
                n2 *= posOrNeg2;
            }

            $scope.number1 = n1;
            $scope.number2 = n2;
            $scope.operation = $scope.op[idx];

            $scope.createHint();

            // If doing substraction and avoiding negative answers
            // ensure first number is larger than second number
            // if (n1 < n2 && $scope.op[idx] == '-') {
            //     var temp = n1;
            //     n1 = n2;
            //     n2 = temp;
            // }

            if ($scope.op[idx] == '+') {
                $scope.calcQuestionAnswer = n1 + n2;
            } else if ($scope.op[idx] == '-') {
                $scope.calcQuestionAnswer = n1 - n2;
            } else if ($scope.op[idx] == '×') {
                $scope.calcQuestionAnswer = n1 * n2;
            } else if ($scope.op[idx] == '÷') {
                $scope.calcQuestionAnswer = n1 / n2;
            }
            console.log('Current calcQuestionAnswer: ' + $scope.calcQuestionAnswer);
            $scope.calcQuestionString = n1 + ' ' + $scope.op[idx] + ' ' + n2;
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
            else if (digit == 'submit' && $scope.calcValueString != '') {
                var currentValue = parseInt($scope.calcValueString);
                console.log('currentValue: ' + currentValue);

                if (currentValue == $scope.calcQuestionAnswer) {
                    console.log('Correct Answer');

                    $scope.loadingBarLoad(1. / $scope.calcQuestionNumberTotal * 100);

                    $scope.calcQuestionNumberCurrent += 1;

                    // Save time on submission of final correct answer
                    if ($scope.calcQuestionNumberCurrent == $scope.calcQuestionNumberTotal) {
                        $scope.calcData.time = $scope.counter;
                    }

                    $scope.calcData.questionLog.push([$scope.calcQuestionString, currentValue, true]);

                } else {
                    $scope.calcQuestionMistakes += 1;
                    $scope.calcData.questionLog.push([$scope.calcQuestionString, currentValue, false]);
                    console.log('Incorrect Answer');
                }

                $scope.calcValueString = '';

            }
            // Digit pressed - add digit to end of current number
            else if ($scope.calcValueString.length < 5 && (typeof digit === 'number') && Math.floor(digit) === digit) {
                $scope.calcValueString += digit.toString();
                console.log('After update: ' + $scope.calcValueString);
            }
            // Unexpected behavior check
            else {
                console.log('Error: CalcCtrl controller calcDisplayUpdate no actions triggered');
            }
        };

        $scope.$on('$ionicView.enter', function() {
            // analytics.trackView('Screen Title');
            console.log('Calc loaded');
            // $scope.calcQuestionNumberCurrent = 0;
            // $scope.calcQuestionMistakes = 0;
            // $scope.calcValueString = '';
            $scope.progressPercent = 0;

            // $scope.calcData = {
            //     time: -1,
            //     roundedTime: -1,
            //     questionsTotal: $scope.calcQuestionNumberTotal,
            //     mistakes: -1,
            //     questionLog: []
            // };

            $scope.calcData = JSON.parse(Calc.load());
            
            //Reset question log
            $scope.calcData.questionLog = [];

            console.log("difficulty: " + $scope.calcData.difficulty);
            //Calculator
            $scope.calcValueString = '';
            $scope.calcQuestionString = '';
            $scope.calcQuestionAnswer = 0;

            $scope.calcQuestionNumberTotal = $scope.calcData.questionsTotal;
            $scope.calcQuestionNumberCurrent = 0;
            $scope.calcQuestionMistakes = 0;

            // $scope.op = ['+', '-', '×', '÷'];
            $scope.op = [];
            if ($scope.calcData.operations.add) {
                $scope.op.push('+');
            }
            if ($scope.calcData.operations.subtract) {
                $scope.op.push('-');
            }
            if ($scope.calcData.operations.multiply) {
                $scope.op.push('×');
            }
            if ($scope.calcData.operations.divide) {
                $scope.op.push('÷');
            }

            $scope.startTimer();
            calcQuestionStringConstruction();
        });

        // https://codepen.io/aidan2129/details/GZQwam
        $scope.progressPercent = 0

        $scope.loadingBarLoad = function(loadPercentage) {
            var originalPercent = $scope.progressPercent;

            // Debug conditional for 'Skip to End' button
            if (loadPercentage == 100) {
                $scope.calcData.time = $scope.counter;
            }

            var interval = setInterval(function() {
                $scope.progressPercent++;
                if ($scope.progressPercent >= 100) {
                    clearInterval(interval);

                    // Call endGame() here so that view change to
                    // Results view occurs only after progress bar fills
                    $scope.endGame();
                } else if ($scope.progressPercent - originalPercent == loadPercentage) {
                    clearInterval(interval);
                    calcQuestionStringConstruction();
                }
                $scope.$apply();
            }, 20);
        }

        // Create and load recap Modal
        $ionicModal.fromTemplateUrl('hint.html', function(modal) {
            $scope.recapModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });

        // Open recap modal
        $scope.openHint = function() {
            $scope.recapModal.show();
        };

        // Close recap modal
        $scope.closeHint = function() {
            $scope.recapModal.hide();
        };

        $scope.createHint = function() {
            //number1, number2, operation

            function breakdownFunction(num) {
                var res = [];
                var numLength = num.toString().length;
                for (var i = 0; i < numLength; i++) {
                    res.push((num % 10) * (Math.pow(10, i)));
                    num = Math.floor(num / 10);
                }
                return res;
            }

            // Removing multiple items (ES2015 code)
            // http://stackoverflow.com/questions/5767325/how-to-remove-a-particular-element-from-an-array-in-javascript

            $scope.hintBreakdownOne1 = breakdownFunction($scope.number1).reverse();
            $scope.hintBreakdownOne1 = $scope.hintBreakdownOne1.filter(item => ![0].includes(item));

            $scope.hintBreakdownOne2 = breakdownFunction($scope.number2).reverse();
            $scope.hintBreakdownOne2 = $scope.hintBreakdownOne2.filter(item => ![0].includes(item));

            console.log($scope.hintBreakdownOne1, $scope.hintBreakdownOne2)

            $scope.hintBreakdownOne = $scope.hintBreakdownOne1.join(' + ') + ' ' + $scope.operation + ' ' + $scope.hintBreakdownOne2.join(' + ');

            // https://www.reddit.com/r/learnjavascript/comments/683t4u/merge_two_arrays_and_sort_them_i_dont_know_why_it/dgvitkx/
            function mergeAndSortArrays(a, b) {
                return a.concat(b).sort((x, y) => y - x);
            }
            $scope.hintBreakdownTwo = mergeAndSortArrays($scope.hintBreakdownOne1, $scope.hintBreakdownOne2);
            // console.log($scope.hintBreakdownTwo);
            $scope.hintBreakdownTwo = $scope.hintBreakdownTwo.join(' + ');

        }
    });
