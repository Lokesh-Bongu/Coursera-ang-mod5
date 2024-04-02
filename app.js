// app.js
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
        signupCtrl.signupFormSubmitted = false;

        signupCtrl.submitForm = function() {
            signupCtrl.signupFormSubmitted = true;
            if (signupCtrl.signupForm.$valid) {
                SignUpService.saveUserData(signupCtrl.firstName, signupCtrl.lastName, signupCtrl.email, signupCtrl.phone, signupCtrl.favoriteMenuItem)
                    .then(function(response) {
                        signupCtrl.message = "Your information has been saved.";
                    })
                    .catch(function(error) {
                        console.error('Error saving user data:', error);
                    });
            }
        };
    }

    angular.module('RestaurantApp')
        .controller('MyInfoController', MyInfoController);

    MyInfoController.$inject = ['SignUpService'];

    function MyInfoController(SignUpService) {
        var myInfoCtrl = this;

        myInfoCtrl.userInfo = SignUpService.getUserInfo();
    }

    angular.module('RestaurantApp')
        .service('SignUpService', SignUpService);

    SignUpService.$inject = ['$http', '$q'];

    function SignUpService($http, $q) {
        var service = this;
        var userInfo;

        service.saveUserData = function(firstName, lastName, email, phone, favoriteMenuItemData) {
            var deferred = $q.defer();

            // Simulate saving data to server
            setTimeout(function() {
                userInfo = {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phone: phone
                };
                deferred.resolve();
            }, 1000);

            return deferred.promise;
        };

        service.getUserInfo = function() {
            return userInfo;
        };
    }
})();
