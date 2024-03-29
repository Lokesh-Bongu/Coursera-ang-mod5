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

    SignUpController.$inject = ['SignUpService', '$location']; // Inject $location here
    function SignUpController(SignUpService, $location) {
   
        var signupCtrl = this;

        signupCtrl.submitForm = function() {
            // Form submission logic
            SignUpService.saveUserData(signupCtrl.firstName, signupCtrl.lastName, signupCtrl.email, signupCtrl.phone, signupCtrl.favoriteMenuItem);
            signupCtrl.message = "Your information has been saved.";
        };

        signupCtrl.checkMenuItem = function() {
            SignUpService.checkMenuItem(signupCtrl.favoriteMenuItem)
            .then(function(response) {
                signupCtrl.invalidMenuItem = response === null;
            });
        };
    }

    angular.module('RestaurantApp')
    .controller('MyInfoController', MyInfoController);

    MyInfoController.$inject = ['SignUpService'];
    function MyInfoController(SignUpService) {
        var myInfoCtrl = this;

        myInfoCtrl.userInfo = SignUpService.getUserInfo();
        myInfoCtrl.favoriteMenuItem = SignUpService.getFavoriteMenuItemWithDetails();
    }

    angular.module('RestaurantApp')
    .service('SignUpService', SignUpService);

    SignUpService.$inject = ['$http'];
    function SignUpService($http) {
        var service = this;
        var userInfo;
        var favoriteMenuItem;

        service.saveUserData = function(firstName, lastName, email, phone, favoriteMenuItem) {
            // Save user data
            userInfo = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone
            };
            service.favoriteMenuItem = favoriteMenuItem;
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
            var favoriteMenuItem = service.getFavoriteMenuItem();
            var category = favoriteMenuItem.category; // Get category
            var shortName = favoriteMenuItem.shortName; // Get short name
            console.log("category",category)
            console.log("shortName",shortName)
            var pictureUrl = 'images/menu/' + category + '/' + shortName + '.jpg'; // Construct image URL
            return {
                title: favoriteMenuItem.title,
                description: favoriteMenuItem.description,
                pictureUrl: pictureUrl
            };
        };
    }
})();
