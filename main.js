var ENDPOINT = 'https://oumi48qov7.execute-api.us-east-1.amazonaws.com/prod';

angular.module('app', ['ngRoute', 'ui.ace'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'root.html'
            })
            .when('/carlist', {
                templateUrl: 'listcars.html',
                controller: 'CarListController'
            })
            .when('/carnew', {
                templateUrl: 'editcar.html',
                controller: 'CarEditController'
            })
            .otherwise({
                redirectTo: '/'
            });
    }])

    .controller('MainController', ['$scope', '$location', '$http', function($scope, $location, $http) {
        $scope.routeActive = function(loc) {
            return loc === $location.path();
        };

        $scope.loading = false;

        $scope.ready = function() {
            $scope.loading = false;
        };

        $scope.carREST = function(method, endpoint, data) {
            $scope.loading = true;
            return $http[method](endpoint, data)
                .catch(console.log)
                .finally($scope.ready);
        };
    }])

    .controller('CarListController', ['$scope', '$location', '$http', function($scope, $location, $http) {
        $scope.carREST('get', ENDPOINT+'/cars-list')
            .then(function(response) {
                $scope.cars = response.data.Items;
            });
    }])

    .controller('CarEditController', ['$scope', '$location', '$routeParams', '$http', function($scope, $location, $routeParams, $http) {
        $scope.car = {
            Number: '00',
            Owner: 'owner',
        };

        var eventParm = function(car) {
            return {
                "operation": "create",
                "tableName": "car",
                "payload": {
                  "Item": car
                }
            };
        };

        $scope.save = function() {
            $scope.carREST('post', ENDPOINT + "/car-post", eventParm($scope.car))
                .then(function() {
                    $location.path("carlist");
                });
        };
    }]);