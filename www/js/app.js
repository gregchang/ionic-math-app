// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('todo', ['ionic', 'firebase', 'ionic-toast'])
  .constant('FirebaseUrl', 'https://mathfast-3bcce.firebaseio.com/')
  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      if (window.cordova) {
        setTimeout(function() {
          navigator.splashscreen.hide();
        }, 300);
      }
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

  .factory('Scores', function($location) {
    return {
      save: function(scores) {
        window.localStorage['scores'] = scores;
      },

      load: function() {
        return window.localStorage['scores'];
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
      // .state('tabs.user', {
      //     url: "/user",
      //     views: {
      //         'user-tab': {
      //             templateUrl: "templates/user.html",
      //             controller: 'UserCtrl'
      //         }
      //     }
      // })
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
    $urlRouterProvider.otherwise("/tab/home");


  })
  .controller('LoginCtrl', function($scope, $state, $timeout, $ionicModal, $location, Calc, $ionicSideMenuDelegate, $firebaseAuth) {

  })
  .controller('UserCtrl', function($scope, $timeout, $ionicModal, $location, Calc, $ionicSideMenuDelegate, $firebaseAuth) {

  })
  .controller('SettingsCtrl', function($scope, $timeout, $ionicModal, $ionicPopup, $location, Calc, $ionicSideMenuDelegate, ionicToast) {

    $scope.clearScores = function() {

      var confirmPopup = $ionicPopup.confirm({
        title: 'Are you sure?'
        // template: 'Permanently delete your local high scores?'
      });

      confirmPopup.then(function(res) {
        if (res) {
          console.log('Yes');
          window.localStorage.removeItem("scores");
          ionicToast.show("All scores deleted", 'middle', false, 1000);

        } else {
          console.log('No');
        }
      });

    };

    // Create and load about Modal
    $ionicModal.fromTemplateUrl('about.html', function(modal) {
      $scope.aboutModal = modal;
    }, {
      scope: $scope,
      animation: 'slide-in-up'
    });

    // Open anbout modal
    $scope.openAbout = function() {
      $scope.aboutModal.show();
    };

    // Close about modal
    $scope.closeAbout = function() {
      $scope.aboutModal.hide();
    };
  })
  .controller('MainCtrl', function($scope, $state, $timeout, $ionicModal, $location, Calc, $ionicSideMenuDelegate, $firebaseAuth) {

    $scope.bestTime = "N/A";
    $scope.showSecText = false;

    $scope.gameSettings = {}
    $scope.gameSettings.lengthValue = 10;
    $scope.gameSettings.difficultyValue = 1;

    $scope.operationToggleValue = {
      add: false,
      subtract: false,
      multiply: false,
      divide: false
    };

    $scope.$watchGroup(['gameSettings.lengthValue', 'gameSettings.difficultyValue', 'operationToggleValue.add', 'operationToggleValue.subtract', 'operationToggleValue.multiply', 'operationToggleValue.divide'], function(newValues, oldValues, scope) {
      // newValues array contains the current values of the watch expressions
      // with the indexes matching those of the watchExpression array
      // i.e.
      // newValues[0] -> $scope.foo 
      // and 
      // newValues[1] -> $scope.bar
      console.log("MainCtrl watchGroup triggered");
      $scope.showBestTime();
    });

    // Create and load homeHelp Modal
    $ionicModal.fromTemplateUrl('homehelp.html', function(modal) {
      $scope.homeHelpModal = modal;
    }, {
      scope: $scope,
      animation: 'slide-in-up'
    });

    // Open homeHelp modal
    $scope.openHelp = function() {
      $scope.homeHelpModal.show();
    };

    // Close homeHelp modal
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

    // gameSettings stored in questionsTotal, difficulty, operations
    $scope.startGame = function() {
      $scope.calcData = {
        uid: $scope.firebase_uid,
        difficulty: $scope.gameSettings.difficultyValue,
        time: -1,
        finalTime: -1,
        questionsTotal: $scope.gameSettings.lengthValue,
        mistakes: -1,
        operations: $scope.operationToggleValue,
        questionLog: []
      };

      Calc.save(JSON.stringify($scope.calcData));
      console.log("Starting game");
      $state.go('calcView');
    };

    //Check signin status
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        $scope.firebase_uid = user.uid;
        console.log("User is signed in: " + uid + ", " + isAnonymous);
        // ...
      } else {
        // User is signed out.
        console.log("User is signed out");

        var auth = $firebaseAuth();
        $scope.signIn = function() {
          $scope.firebaseUser = null;
          $scope.error = null;

          auth.$signInAnonymously().then(function(firebaseUser) {
            $scope.firebaseUser = firebaseUser;
            // $state.go('tabs.home');
            console.log("Anonymous login success: " + firebaseUser.uid);
          }).catch(function(error) {
            $scope.error = error;
            // $state.go('tabs.home');
            console.log("Anonymous login error: " + error);
          });
        };
        $scope.signIn();
      }
    });

    $scope.showBestTime = function() {
      console.log("Show Best Time");
      scoreIdentifier = $scope.gameSettings.lengthValue + "-" + $scope.gameSettings.difficultyValue + "-" + ("" + ($scope.operationToggleValue.add * 1) + ($scope.operationToggleValue.subtract * 1) + ($scope.operationToggleValue.multiply * 1) + ($scope.operationToggleValue.divide * 1));
      if (window.localStorage.getItem("scores") != null) {
        scores = JSON.parse(window.localStorage["scores"]);
        if (scores[scoreIdentifier] != undefined) {
          $scope.bestTime = scores[scoreIdentifier];
          $scope.showSecText = true;
          console.log("showBestTime(): Found existing time");
          return;
        }
      }
      console.log("showBestTime(): Existing time not found");
      $scope.bestTime = "N/A";
      $scope.showSecText = false;
    };


    $scope.$on('$ionicView.beforeEnter', function() {
      $scope.showBestTime();
    });


  })
  .controller('ResultsCtrl', function($scope, $timeout, $ionicModal, $location, Calc, $ionicSideMenuDelegate, Auth, $firebaseObject) {

    // No promise so .then doesn't work
    // Calc.load().then(function(data) {
    //     $scope.calcData = JSON.parse(data);
    //     console.log($scope.calcData);
    // }).error(function(error) {
    //     $scope.status = "ResultsCtrl Calc load error: " + error;
    //     console.log($scope.status);
    // });

    $scope.changeView = function(view) {
      console.log('changeView: ' + view);
      $location.path(view);
    };


    $scope.$on('$ionicView.beforeEnter', function() {
      $scope.calcData = JSON.parse(Calc.load());

      $scope.showNewBestTimeMessage = false;

      scoreIdentifier = $scope.calcData.questionsTotal + "-" + $scope.calcData.difficulty + "-" + ("" + ($scope.calcData.operations.add * 1) + ($scope.calcData.operations.subtract * 1) + ($scope.calcData.operations.multiply * 1) + ($scope.calcData.operations.divide * 1));
      console.log(scoreIdentifier);
      var scores = {}

      if (window.localStorage.getItem("scores") === null) {
        // console.log("bestTimeSave 1");
        scores[scoreIdentifier] = $scope.calcData.finalTime;
      } else {
        // console.log("bestTimeSave 2");
        scores = JSON.parse(window.localStorage["scores"]);
        if (scores[scoreIdentifier] === null || scores[scoreIdentifier] === undefined) {
          // console.log("bestTimeSave 3");
          scores[scoreIdentifier] = $scope.calcData.finalTime;
        } else {
          // console.log("bestTimeSave 4");
          scores[scoreIdentifier] = $scope.calcData.finalTime < scores[scoreIdentifier] ? $scope.calcData.finalTime : scores[scoreIdentifier];
        }
      }
      // console.log(scores[scoreIdentifier]);
      $scope.bestTime = scores[scoreIdentifier];

      if ($scope.bestTime == $scope.calcData.finalTime) {
        $scope.showNewBestTimeMessage = true;
      }

      // console.log("$scope.showNewBestTimeMessage: " + $scope.showNewBestTimeMessage)
      window.localStorage["scores"] = JSON.stringify(scores);

      var database = firebase.database();
      var ref = database.ref('scores/' + scoreIdentifier);
      var syncObject = $firebaseObject(ref);
      syncObject.$bindTo($scope, "topOnlineScore");

      if ($scope.topOnlineScore > $scope.bestTime) {
        $scope.topOnlineScore = $scope.bestTime;
      }
      if ($scope.topOnlineScore === undefined || $scope.calcData.finalTime < $scope.topOnlineScore) {
        firebase.database().ref('scores/' + scoreIdentifier).set({
          score: $scope.calcData.finalTime
        });
      }
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
  .controller('CalcCtrl', function($scope, $state, $window, $timeout, $ionicModal, $location, Calc, $ionicSideMenuDelegate, ionicToast) {

    // Enable back button
    // $scope.$on('$ionicView.beforeEnter', function(event, viewData) {
    //     viewData.enableBack = true;
    // });

    // https://github.com/rajeshwarpatlolla/ionic-toast
    // $scope.showToast = function(message) {
    //     // ionicToast.show(message, position, stick, time);
    //     ionicToast.show(message, 'bottom', false, 1500);
    // };

    // Change view
    $scope.changeView = function(view) {
      console.log('changeView: ' + view);
      $location.path(view);
    };


    // Timer, based off http://www.devblogrbmz.com/building-a-very-simple-timer-in-angularjs/
    // $scope.counter = 0;
    // var mytimeout = null;

    // if ($scope.counter === 0) {
    //     console.log('$scope.counter is 0');
    // }

    // $scope.onTimeout = function() {
    //     // Prevents never-ending game
    //     if ($scope.counter === 100000) {
    //         $scope.$broadcast('timer-stopped', $scope.counter);
    //         $timeout.cancel(mytimeout);
    //         return;
    //     }
    //     $scope.counter++;
    //     mytimeout = $timeout($scope.onTimeout, 100);
    // };

    // $scope.startTimer = function() {
    //     mytimeout = $timeout($scope.onTimeout, 100);
    // };

    // // stop and reset current timer
    // $scope.stopTimer = function() {
    //     $scope.$broadcast('timer-stopped', $scope.counter);
    //     $scope.counter = 0;
    //     $timeout.cancel(mytimeout);
    // };
    // // triggered, when the timer stops, you can do something here, maybe show a visual indicator or vibrate the device
    // $scope.$on('timer-stopped', function(event, elapsed) {
    //     console.log(event, elapsed);
    //     // console.log('You\'ve spent way too long on your questions!');

    // });

    $scope.endGame = function() {

      console.log('All ' + $scope.calcQuestionNumberTotal + ' correct!');

      // Data transfer to Results view
      $scope.calcData.mistakes = $scope.calcQuestionMistakes;

      // Mistakes incur 5 second penalties
      $scope.calcData.finalTime = (($scope.calcData.time / 1000) + ($scope.calcData.mistakes * 5)).toFixed(2);
      console.log('$scope.calcData.finalTime: ' + $scope.calcData.finalTime);

      // $scope.stopTimer();

      console.log('saving data', JSON.stringify($scope.calcData));
      // Todo write on-success callback
      Calc.save(JSON.stringify($scope.calcData));

      console.log('Changing to Results View');
      $state.go('results');
    }

    $scope.endGameEarly = function() {
      // $scope.stopTimer();
      console.log('Changing to Home View');
      $state.go('tabs.home');
    }

    // Create arithmetic questions
    function calcQuestionStringConstruction() {

      if ($scope.calcQuestionNumberCurrent == $scope.calcQuestionNumberTotal - 1) {
        $scope.calcQuestionString = "All done!";
        return;
      }

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
      if ($scope.calcQuestionNumberCurrent == $scope.calcQuestionNumberTotal) {
        return;
      }

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
        console.log('calcQuestionString: ' + $scope.calcQuestionString);

        if (currentValue == $scope.calcQuestionAnswer) {
          console.log('Correct Answer');
          // $scope.showToast("Correct!");
          $scope.showCorrect = true;
          $scope.showIncorrect = false;
          var offset = 0;
          if (($scope.calcQuestionNumberTotal == 30 && $scope.calcQuestionNumberCurrent % 3 == 0) || ($scope.calcQuestionNumberTotal == 40 && $scope.calcQuestionNumberCurrent % 4 == 0)) {
            offset = 1;
          }
          $scope.loadingBarLoad(Math.floor(1. / $scope.calcQuestionNumberTotal * 100) + offset);

          $scope.calcData.questionLog.push([$scope.calcQuestionString, currentValue, true]);

          calcQuestionStringConstruction();

          $scope.calcQuestionNumberCurrent += 1;

          // Save time on submission of final correct answer
          if ($scope.calcQuestionNumberCurrent == $scope.calcQuestionNumberTotal) {
            // $scope.calcData.time = $scope.counter;
            $scope.calcData.time = Date.now() - $scope.start;
          }


        } else {
          console.log('Incorrect Answer');
          // $scope.showToast("Incorrect! +5 second penalty");
          $scope.showCorrect = false;
          $scope.showIncorrect = true;
          $scope.calcQuestionMistakes += 1;
          $scope.calcData.questionLog.push([$scope.calcQuestionString, currentValue, false]);

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

      $scope.start = Date.now();
      $scope.progressPercent = 0;

      //Calculator
      $scope.calcValueString = '';
      $scope.calcQuestionString = '';
      $scope.calcQuestionAnswer = 0;

      $scope.calcData = JSON.parse(Calc.load());

      $scope.calcQuestionNumberTotal = $scope.calcData.questionsTotal;
      $scope.calcQuestionNumberCurrent = 0;
      $scope.calcQuestionMistakes = 0;

      //Reset question log
      $scope.calcData.questionLog = [];

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

      // $scope.startTimer();
      calcQuestionStringConstruction();

      $scope.showCorrect = false;
      $scope.showIncorrect = false;
    });

    // https://codepen.io/aidan2129/details/GZQwam
    $scope.progressPercent = 0

    $scope.loadingBarLoad = function(loadPercentage) {
      var originalPercent = $scope.progressPercent;
      console.log("loadingBarLoad: " + loadPercentage);

      // Debug conditional for 'Skip to End' button
      // if (loadPercentage == 100) {
      //     $scope.calcData.time = $scope.counter;
      // }

      var interval = setInterval(function() {
        $scope.progressPercent++;
        if ($scope.progressPercent >= 100) {
          clearInterval(interval);

          // Call endGame() here so that view change to
          // Results view occurs only after progress bar fills
          $scope.endGame();
        } else if ($scope.progressPercent - originalPercent == loadPercentage) {
          clearInterval(interval);
          // calcQuestionStringConstruction();
        }
        $scope.$apply();
      }, 20);
    }

    // Create and load hint Modal
    $ionicModal.fromTemplateUrl('hint.html', function(modal) {
      $scope.hintModal = modal;
    }, {
      scope: $scope,
      animation: 'slide-in-up'
    });

    // Open hint modal
    $scope.openHint = function() {
      $scope.hintModal.show();
    };

    // Close hint modal
    $scope.closeHint = function() {
      $scope.hintModal.hide();
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
