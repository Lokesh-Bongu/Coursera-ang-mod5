angular.module('RestaurantApp')
    .service('SignUpService', SignUpService);

SignUpService.$inject = ['$http', '$q'];

function SignUpService($http, $q) {
    var service = this;
    var userInfo;
    var favoriteMenuItem;

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
            favoriteMenuItem = favoriteMenuItemData;
            deferred.resolve();
        }, 1000);

        return deferred.promise;
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
            })
            .catch(function(error) {
                console.error('Error checking menu item:', error);
                return $q.reject('Error checking menu item');
            });
    };

    service.getUserInfo = function() {
        return userInfo;
    };

    service.getFavoriteMenuItemWithDetails = function() {
        if (!favoriteMenuItem) {
            return $q.reject('Favorite menu item is not defined');
        }

        return $http.get('https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json')
            .then(function(response) {
                var menuItems = response.data;
                var categoryShortName, menuItemShortName, menuItemDescription;

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
            })
            .catch(function(error) {
                console.error('Error fetching favorite menu item:', error);
                return $q.reject('Error fetching favorite menu item');
            });
    };
}
