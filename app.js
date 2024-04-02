(function() {
    'use strict';

    angular.module('RestaurantApp', ['ngRoute'])
        .config(RoutesConfig);

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

    angular.module('RestaurantApp')
        .controller('MainController', MainController);

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

    angular.module('RestaurantApp')
        .controller('SignUpController', SignUpController);

    SignUpController.$inject = ['SignUpService', '$location'];

    function SignUpController(SignUpService, $location) {
        var signupCtrl = this;
        signupCtrl.signupFormSubmitted = false; // Initialize form submission state
        signupCtrl.invalidMenuItem = false; // Initialize invalid menu item state

        signupCtrl.submitForm = function() {
            signupCtrl.signupFormSubmitted = true; // Set form submission state to true

            // Check if the form is valid
            if (signupCtrl.signupForm.$valid && !signupCtrl.invalidMenuItem) {
                SignUpService.saveUserData(signupCtrl.firstName, signupCtrl.lastName, signupCtrl.email, signupCtrl.phone, signupCtrl.favoriteMenuItem)
                    .then(function(response) {
                        signupCtrl.message = "Your information has been saved.";
                    })
                    .catch(function(error) {
                        console.error('Error saving user data:', error);
                    });
            }
        };

        signupCtrl.checkMenuItem = function() {
            if (signupCtrl.favoriteMenuItem) {
                SignUpService.checkMenuItem(signupCtrl.favoriteMenuItem)
                    .then(function(response) {
                        signupCtrl.invalidMenuItem = response === null;
                    });
            } else {
                signupCtrl.invalidMenuItem = false; // Reset invalid menu item state if favoriteMenuItem is empty
            }
        };
    }

    angular.module('RestaurantApp')
        .controller('MyInfoController', MyInfoController);

    MyInfoController.$inject = ['SignUpService'];

    function MyInfoController(SignUpService) {
        var myInfoCtrl = this;

        myInfoCtrl.userInfo = SignUpService.getUserInfo();

        SignUpService.getFavoriteMenuItemWithDetails().then(function(favoriteMenuItemDetails) {
            myInfoCtrl.favoriteMenuItem = favoriteMenuItemDetails;
        }).catch(function(error) {
            console.error('Error fetching favorite menu item:', error);
            myInfoCtrl.favoriteMenuItem = null;
        });
    }

    angular.module('RestaurantApp')
        .service('SignUpService', SignUpService);

    SignUpService.$inject = ['$http', '$q']; // Inject $q for promises

    function SignUpService($http, $q) {
        var service = this;
        var userInfo;
        var favoriteMenuItem;

        service.saveUserData = function(firstName, lastName, email, phone, favoriteMenuItemData) {
            userInfo = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone
            };
            favoriteMenuItem = favoriteMenuItemData;
            // Simulate saving data to server
            return $q.resolve();
        };

        service.checkMenuItem = function(menuItem) {
            return $http.get('https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json')
                .then(function(response) {
                    var menuItems = response.data;
                    var menuItemExists = false;
                    for (var categoryKey in menuItems) {
                        var category = menuItems[categoryKey];
                        for (var i = 0; i < category.menu_items.length; i++) {
                            if (category.menu_items[i].short_name === menuItem) {
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

        service.getFavoriteMenuItemWithDetails = function() {
            return $http.get('https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json')
                .then(function(response) {
                    var menuItems = response.data;
                    var menuItemDescription;

                    if (favoriteMenuItem) {
                        var categoryShortName, menuItemShortName;

                        for (var categoryKey in menuItems) {
                            var category = menuItems[categoryKey];
                            for (var i = 0; i < category.menu_items.length; i++) {
                                if (category.menu_items[i].short_name === favoriteMenuItem) {
                                    categoryShortName = category.category.short_name;
                                    menuItemShortName = category.menu_items[i].short_name;
                                    menuItemDescription = category.menu_items[i].description;
                                    break;
                                }
                            }
                            if (categoryShortName && menuItemShortName) {
                                break;
                            }
                        }

                        var imageUrl = 'images/menu/' + categoryShortName + '/' + menuItemShortName + '.jpg';

                        return {
                            name: favoriteMenuItem,
                            imageUrl: imageUrl,
                            description: menuItemDescription
                        };
                    } else {
                        return null;
                    }
                });
        };
    }
})();
