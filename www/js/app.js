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
    .factory('localStorage', function() {
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
        .state('contact', {
            url: "/contact",
            templateUrl: "templates/contact.html"

        })
        .state('calc', {
            url: "/calc",
            templateUrl: "templates/calc.html"

        })
        .state('calcView', {
            url: "/calcView",
            templateUrl: "templates/calcView.html"

        });
    $urlRouterProvider.otherwise("/tab/home");

})

.controller('MainCtrl', function($scope, $timeout, $ionicModal, localStorage, $ionicSideMenuDelegate) {

    // // A utility function for creating a new project
    // // with the given projectTitle
    // var createProject = function(projectTitle) {
    //     var newProject = Projects.newProject(projectTitle);
    //     $scope.projects.push(newProject);
    //     Projects.save($scope.projects);
    //     $scope.selectProject(newProject, $scope.projects.length - 1);
    // }


    // // Load or initialize projects
    // $scope.projects = Projects.all();

    // // Grab the last active, or the first project
    // $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

    // // Called to create a new project
    // $scope.newProject = function() {
    //     var projectTitle = prompt('Project name');
    //     if (projectTitle) {
    //         createProject(projectTitle);
    //     }
    // };

    // // Called to select the given project
    // $scope.selectProject = function(project, index) {
    //     $scope.activeProject = project;
    //     Projects.setLastActiveIndex(index);
    //     $ionicSideMenuDelegate.toggleLeft(false);
    // };

    // // Create our modal
    // $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    //     $scope.taskModal = modal;
    // }, {
    //     scope: $scope
    // });

    // $scope.createTask = function(task) {
    //     if (!$scope.activeProject || !task) {
    //         return;
    //     }
    //     $scope.activeProject.tasks.push({
    //         title: task.title
    //     });
    //     $scope.taskModal.hide();

    //     // Inefficient, but save all the projects
    //     Projects.save($scope.projects);

    //     task.title = "";
    // };

    // $scope.newTask = function() {
    //     $scope.taskModal.show();
    // };

    // $scope.closeNewTask = function() {
    //     $scope.taskModal.hide();
    // }

    // $scope.toggleProjects = function() {
    //     $ionicSideMenuDelegate.toggleLeft();
    // };


    // // Try to create the first project, make sure to defer
    // // this by using $timeout so everything is initialized
    // // properly
    // $timeout(function() {
    //     if ($scope.projects.length == 0) {
    //         while (true) {
    //             var projectTitle = prompt('Your first project title:');
    //             if (projectTitle) {
    //                 createProject(projectTitle);
    //                 break;
    //             }
    //         }
    //     }
    // }, 1000);


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

        if (n1 < n2) {
            var temp = n1;
            n1 = n2;
            n2 = temp;
        }

        var idx = Math.floor(Math.random() * op.length);
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
                calcQuestionStringConstruction();
                console.log('Correct Answer');
                $scope.calcQuestionNumberCurrent += 1;
                if ($scope.calcQuestionNumberCurrent == $scope.calcQuestionNumberTotal) {
                    console.log($scope.calcQuestionNumberTotal + ' correct!');
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
