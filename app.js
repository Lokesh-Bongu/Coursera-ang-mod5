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
        signupCtrl.message = '';

        signupCtrl.submitForm = function() {
            signupCtrl.message = ''; // Reset message

            // Validate first name
            if (!signupCtrl.firstName) {
                signupCtrl.message = "Please enter your first name.";
                return;
            }

            // Validate last name
            if (!signupCtrl.lastName) {
                signupCtrl.message = "Please enter your last name.";
                return;
            }

            // Validate email
            if (!signupCtrl.email) {
                signupCtrl.message = "Please enter your email address.";
                return;
            } else if (!isValidEmail(signupCtrl.email)) {
                signupCtrl.message = "Please enter a valid email address ending with '@gmail.com'.";
                return;
            }

            // Validate phone number
            if (!signupCtrl.phone) {
                signupCtrl.message = "Please enter your phone number.";
                return;
            }

            // All fields are valid, save user data
            SignUpService.saveUserData(signupCtrl.firstName, signupCtrl.lastName, signupCtrl.email, signupCtrl.phone, signupCtrl.favoriteMenuItem)
                .then(function() {
                    signupCtrl.message = "Your information has been saved.";
                })
                .catch(function(error) {
                    console.error('Error saving user data:', error);
                    signupCtrl.message = "An error occurred while saving your information.";
                });
        };

        // Function to validate email format
        function isValidEmail(email) {
            var emailRegex = /\b[A-Za-z0-9._%+-]+@gmail\.com\b/;
            return emailRegex.test(email);
        }
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

    SignUpService.$inject = ['$http', '$q'];

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
            return favoriteMenuItem;
        };

        service.getFavoriteMenuItemWithDetails = function() {
            return $http.get('https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json')
                .then(function(response) {
                    var menuItemDescription;
                    var menuItems = response.data;
                    var favoriteMenuItemData = service.getFavoriteMenuItem();

                    if (favoriteMenuItemData) {
                        var categoryShortName, menuItemShortName;

                        for (var categoryKey in menuItems) {
                            var category = menuItems[categoryKey];
                            for (var i = 0; i < category.menu_items.length; i++) {
                                if (category.menu_items[i].short_name === favoriteMenuItemData) {
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
                            name: favoriteMenuItemData,
                            imageUrl: imageUrl + menuItemDescription
                        };
                    } else {
                        return null;
                    }
                });
        };
    }
})();
