angular.module('PortalApp')

.controller('waterlooRideShareCtrl', ['$scope', '$http', '$q', 'waterlooRideShareFactory', function ($scope, $http, $q,
waterlooRideShareFactory) {

    // Widget Configuration
    $scope.portalHelpers.config = {
        // make 'widgetMenu.html' the template for the top right menu
        "widgetMenu": "widgetMenu.html"
    };

    // Import variables and functions from service
    $scope.insertValue = waterlooRideShareFactory.insertValue;
    $scope.loading = waterlooRideShareFactory.loading;
    $scope.links = waterlooRideShareFactory.links;
    $scope.openDataExampleData = waterlooRideShareFactory.openDataExampleData;
    $scope.dbData = waterlooRideShareFactory.dbData;
    $scope.item = waterlooRideShareFactory.item;
    $scope.ride = waterlooRideShareFactory.ride;
    $scope.searchData = waterlooRideShareFactory.searchData;

    // Hard-coded cities
    
            /*            <option value="waterloo">Waterloo</option>
                    <option value="toronto">Toronto</option>
                    <option value="barrie">Barrie</option>
                    <option value="burlington">Burlington</option>
                    <option value="guelph">Guelph</option>
                    <option value="hamilton">Hamilton</option>
                    <option value="kitchener">Kitchener</option>
                    <option value="london">London</option>
                    <option value="markham">Markham</option>
                    <option value="mississauga">Mississauga</option>
                    <option value="ottawa">Ottawa</option>
                    <option value="vaughn">Vaughn</option> */
    $scope.cities = ["Waterloo", "Toronto", "Barrie", "Burlington", "Guelph", "Hamilton", "Kitchener", "London", "Markham", "Mississauga", "Ottawa", "Vaughn"];
    
    // Model for the search and list example
    $scope.model = [{
        title: "item 1",
        details: "item 1 details",
        category: '1'
    }, {
        title: "item 2",
        details: "item 2 details",
        category: '2'
    }, {
        title: "item 3",
        details: "item 3 details",
        category: '1'
    }, {
        title: "item 4",
        details: "item 4 details",
        category: '2'
    }, {
        title: "item 5",
        details: "item 5 details",
        category: '1'
    }, {
        title: "item 6",
        details: "item 6 details",
        category: '2'
    }];

    // initialize the service
    waterlooRideShareFactory.init($scope);

    // watch for changes in the loading variable
    $scope.$watch('loading.value', function () {
        // if loading
        if ($scope.loading.value) {
            // show loading screen in the first column, and don't append it to browser history
            $scope.portalHelpers.showView('loading.html', 1, false);
            // show loading animation in place of menu button
            $scope.portalHelpers.toggleLoading(true);
        } else {
            $scope.portalHelpers.showView('main.html', 1);
            $scope.portalHelpers.toggleLoading(false);
        }
    });

    // Create table, invoked by a button press from database test example
    $scope.createTable = function () {
        $scope.portalHelpers.invokeServerFunction('createTable').then(function (
            result) {
            $scope.dbData.value = [];
        });
    }

    // Handle form submit in the database test example
    $scope.insertData = function () {
        if ($scope.insertValue.value.length > 50)
            alert('value should be less than 50 characters');
        else {
            $scope.portalHelpers.invokeServerFunction('insert', {
                value: $scope.insertValue.value
            }).then(function (result) {
                $scope.dbData.value = result;
            });
            $scope.insertValue.value = "";
        }
    };

    // Handle click on an item in the list and search example
    $scope.showDetails = function (item) {
        // Set which item to show in the details view
        $scope.item.value = item;
        // Show details view in the second column
        $scope.portalHelpers.showView('details.html', 2);
    };
    
    // Handle Post New
    $scope.newPost = function () {
      $scope.portalHelpers.showView('newPost.html', 2);
    };
    
    // Handle Find Info
    $scope.findInfo = function () {
      $scope.portalHelpers.showView('findInfo.html', 2);
    };
    
    // Handle Find Results
    $scope.findResults = function (ride) {   
        $scope.portalHelpers.invokeServerFunction('searchForRides', {
                ride: $scope.ride.value
            }).then(function (
            result) {
            $scope.ride.value = result;
        });
      $scope.portalHelpers.showView('findResults.html', 2);
    };

}])
    // Factory maintains the state of the widget
    .factory('waterlooRideShareFactory', ['$http', '$rootScope', '$filter', '$q', function ($http, $rootScope,
        $filter, $q) {
        var initialized = {
            value: false
        };

        // Your variable declarations
        var loading = {
            value: true
        };
        var insertValue = {
            value: null
        };
        var links = {
            value: null
        };
        var openDataExampleData = {
            value: null
        };
        var dbData = {
            value: null
        };
        var item = {
            value: null
        };
        var ride = {
            value: null
        };
        var searchData = {
            value: null  
        };
        var sourcesLoaded = 0;

        var init = function ($scope) {
            if (initialized.value)
                return;
            initialized.value = true;

            // Place your init code here:

            // Get data for the widget
            $http.get('/ImportantLinks/JSONSource').success(function (data) {
                links.value = data;
                sourceLoaded();
            });

            // OPEN DATA API EXAMPLE
            $scope.portalHelpers.invokeServerFunction('getOpenData').then(function (
                result) {
                console.log('getopendata data: ', result);
                openDataExampleData.value = result.data;
                sourceLoaded();
            });

            $scope.portalHelpers.invokeServerFunction('getData').then(function (result) {
                dbData.value = result;
                sourceLoaded();
            });
        }

        function sourceLoaded() {
            sourcesLoaded++;
            if (sourcesLoaded == 3)
                loading.value = false;
        }

        return {
            init: init,
            loading: loading,
            insertValue: insertValue,
            links: links,
            openDataExampleData: openDataExampleData,
            dbData: dbData,
            item: item,
            ride: ride,
            searchData: searchData
        };

    }])
    // Custom directive example
    .directive('waterlooRideShareDirectiveName', ['$http', function ($http) {
        return {
            link: function (scope, el, attrs) {

            }
        };
    }])
    // Custom filter example
    .filter('waterlooRideShareFilterName', function () {
        return function (input, arg1, arg2) {
            // Filter your output here by iterating over input elements
            var output = input;
            return output;
        }
    });