(function() {
    'use strict';

    angular.module('RestaurantApp', ['ngRoute'])
        .config(RoutesConfig)
        .controller('MainController', MainController)
        .controller('SignUpController', SignUpController)
        .controller('MyInfoController', MyInfoController)
        .service('SignUpService', SignUpService);

    RoutesConfig.$inject = ['$routeProvider'];
    function RoutesConfig($routeProvider) {
        $routeProvider
            .when('/signup', {
                templateUrl: 'signup.html',
                controller: 'SignUpController as signupCtrl'
            })
            .when('/myinfo', {
                templateUrl: 'myinfo.html',
                controller: 'MyInfoController as myInfoCtrl'
            })
            .otherwise({
                redirectTo: '/signup'
            });
    }

    MainController.$inject = ['$location'];
    function MainController($location) {
        var mainCtrl = this;

        mainCtrl.goToSignUp = function() {
            $location.path('/signup');
        };

        mainCtrl.goToMyInfo = function() {
            $location.path('/myinfo');
        };
    }

    SignUpController.$inject = ['SignUpService', '$location'];
    function SignUpController(SignUpService, $location) {
        var signupCtrl = this;

        signupCtrl.submitForm = function() {
            SignUpService.saveUserData(signupCtrl.firstName, signupCtrl.lastName, signupCtrl.email, signupCtrl.phone, signupCtrl.favoriteMenuItem)
                .then(function() {
                    signupCtrl.message = "Your information has been saved.";
                })
                .catch(function(error) {
                    console.error("Error saving user data:", error);
                    signupCtrl.message = "Failed to save user information.";
                });
        };

        signupCtrl.checkMenuItem = function() {
            SignUpService.checkMenuItem(signupCtrl.favoriteMenuItem)
                .then(function(response) {
                    signupCtrl.invalidMenuItem = response === null;
                })
                .catch(function(error) {
                    console.error("Error checking menu item:", error);
                    signupCtrl.invalidMenuItem = true;
                });
        };
    }

    MyInfoController.$inject = ['SignUpService'];
    function MyInfoController(SignUpService) {
        var myInfoCtrl = this;

        myInfoCtrl.userInfo = SignUpService.getUserInfo();
        myInfoCtrl.favoriteMenuItem = SignUpService.getFavoriteMenuItem();
    }

    SignUpService.$inject = ['$http'];
    function SignUpService($http) {
        var service = this;
        var userInfo;
        var favoriteMenuItem;

        service.saveUserData = function(firstName, lastName, email, phone, favoriteMenuItem) {
            userInfo = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone
            };
            service.favoriteMenuItem = favoriteMenuItem;

            // Simulate asynchronous behavior with a promise
            return Promise.resolve(); // Replace this with actual saving logic if needed
        };

        service.checkMenuItem = function(menuItem) {
            return $http.get('https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json')
                .then(function(response) {
                    var menuItems = response.data;
                    var menuItemExists = false;
                    for (var categoryKey in menuItems) {
                        var category = menuItems[categoryKey];
                        for (var i = 0; i < category.menu_items.length; i++) {
                            if (category.menu_items[i].name === menuItem) {
                                menuItemExists = true;
                                break;
                            }
                        }
                        if (menuItemExists) {
                            break;
                        }
                    }
                    return menuItemExists ? menuItem : null;
                });
        };

        service.getUserInfo = function() {
            return userInfo;
        };

        service.getFavoriteMenuItem = function() {
            console.log("kkkkkkkk",favoriteMenuItem)
            return favoriteMenuItem;
        };
    }
})();
