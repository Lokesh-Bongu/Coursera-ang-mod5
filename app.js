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
            redirectTo: '/'
        });
    }

    angular.module('RestaurantApp')
    .controller('MainController', MainController)
    .controller('SignUpController', SignUpController)
    .controller('MyInfoController', MyInfoController)
    .service('SignUpService', SignUpService);

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

    SignUpController.$inject = ['SignUpService'];
    function SignUpController(SignUpService) {
        var signupCtrl = this;

        signupCtrl.submitForm = function() {
            // Submit form logic here
        };
    }

    MyInfoController.$inject = ['SignUpService'];
    function MyInfoController(SignUpService) {
        var myInfoCtrl = this;

        myInfoCtrl.userInfo = SignUpService.getUserInfo();
        myInfoCtrl.favoriteMenuItem = SignUpService.getFavoriteMenuItem();
    }

    function SignUpService() {
        var service = this;

        // Implement methods to save and retrieve user information and favorite menu item
    }
})();
