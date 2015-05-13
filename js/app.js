/**
 * Created by bernhardmostrey on 6/03/15.
 */
var app = angular.module('tripler', ['uiGmapgoogle-maps', 'ja.qr', 'ngCookies']);

app.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyBy69Rcd3tkCmmjAa_HcmDd-q-FzTVn7ek',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
});







app.controller("MainController", function($scope, $http, uiGmapGoogleMapApi, $filter, TriplerService, $cookies, $interval, $timeout) {
    //console.time("AppLoad");
    var ts = TriplerService;

    $scope.loading = true;
    $scope.validated = false;


    /*if($cookies["trip_id"]){
        $scope.inputID = $cookies["trip_id"];
        startLoad();
    }else{
        $scope.loading = false;
    }

    $scope.inputID = 1;
    $scope.changeID = function(i){
        $scope.inputID = i;
    };
    $scope.enterID = startLoad;*/

    //ts.getYelpJS("gent", "food");

    startLoad();

    function startLoad() {
        console.timeEnd("AppLoad");
        console.time("DataLoad");
        //$cookies["trip_id"] = $scope.inputID;

        $scope.message = "Loading Tripler...";
        console.time("FixedLoad");
        ts.getFixed(1).then(function(d) {
            //console.log(d.data);
            console.timeEnd("FixedLoad");

            //ts.fixed = ;
            ts.fixed = new Fixed(d.data.ID, d.data.Lat, d.data.Lon, d.data.LocString, d.data.MapZoom, d.data.Logo, d.data.PrimaryColor, d.data.Slogan, d.data.ShowCompany, d.data.FoursquareID, d.data.MapLimit, d.data.MapTerm, d.data.CycleTime, d.data.API);
            console.log(ts.fixed);
            var api = ts.fixed.API;
            switch(api){
                case "yelp":
                    ts.getYelpJS("Gent", "food", 0).then(function(o){
                        makeMap(parseInt(ts.fixed.MapZoom), ts.fixed.Lat, ts.fixed.Lon);
                        $scope.brand_logo = ts.fixed.Logo;
                    });
                    break;
                case "ta":
                    ts.getTripAdvisor("http://api.tripadvisor.com/api/partner/2.0/map/"+ts.fixed.Lat+","+ts.fixed.Lon+"?key=4bfede65b8eb4ceebd7148c9879b0c85&lang=nl&lunit=km&distance=30", 0).then(function(o){
                        makeMap(parseInt(ts.fixed.MapZoom), ts.fixed.Lat, ts.fixed.Lon);
                        $scope.brand_logo = ts.fixed.Logo;
                    });
                    break;
                case "fq":
                    ts.getFoursquare("https://api.foursquare.com/v2/venues/explore?client_id=RUPUSGLEH3TPT0TTINACNKO1DYNH0QNIXOKOGN11BYKADTF2&client_secret=MEN100NRVI4JFP5NICL0WL3U32B2M2GDLG0TIC0LAVSNQKIN&ll="+ts.fixed.Lat+","+ts.fixed.Lon+"&v="+ts.today+"&m=foursquare&section=food&limit="+ts.fixed.MapLimit, 0).then(function(o){
                        makeMap(parseInt(ts.fixed.MapZoom), ts.fixed.Lat, ts.fixed.Lon);
                        console.log(ts.dynamic);
                        $scope.brand_logo = ts.fixed.Logo;
                    });
                    break;
            }
        });


    }




    function makeMap(zoom, lat, lon){
        console.timeEnd("DataLoad");
        console.time("MapLoad");

        $scope.categories = ts.dynamic.Categories;
        $scope.businesses = ts.dynamic.Businesses;

        $scope.categories.sort(function(a, b){return a[1] - b[1]}).reverse();

        $scope.message = false;
        $scope.loading = false;


        uiGmapGoogleMapApi.then(function(maps) {
            $scope.map = { center: { latitude: lat, longitude: lon}, zoom: zoom };
            angular.forEach($scope.businesses, function(value, key){
                value.onClicked = function() {
                    onMarkerClicked(value);
                };
            });
        });

        function onMarkerClicked(marker){
            marker.showWindow = true;
        }
        randBuss = randomNumbers($scope.businesses.length);
        $scope.message = false;
        $scope.loading = false;

        startCycle();
    }

    var randBuss;
    var randCount = 0;

    function cycle(){
        console.log(randCount);
        angular.forEach($scope.businesses, function(value, key){
            if(value.showWindow == true) value.showWindow = false;
        });
        $scope.$apply();

        $("#qr-wrapper ul li").removeClass("border");
        console.log(randCount + " of "+$scope.businesses.length);
        if(randCount == $scope.businesses.length){
            randBuss = randomNumbers($scope.businesses.length);
            $scope.randoms = randBuss;
            $scope.rand = randBuss[randCount];
            randCount = 0;
            //console.log("reset");
            $( "#qr-wrapper ul" ).animate({
                left: "810"
            }, 500, function() {
                // Animation complete.
                $("#qr-wrapper ul li:nth-child("+(randCount)+")").addClass("border");
            });
        }else{
            console.log(randCount);
            if(randCount == 0){
                $("#qr-wrapper ul li:nth-child("+1+")").addClass("border");

            }
        }




        $scope.businesses[randBuss[randCount]].showWindow = true;

        /* QR Width280 */




        if(randCount > 0){
            //console.log("start left");
            $( "#qr-wrapper ul" ).animate({
                left: "-=270"
            }, 500, function() {
                // Animation complete.
                $("#qr-wrapper ul li:nth-child("+(randCount)+")").addClass("border");
            });
        }
        if(randCount == randBuss.length-1){

        }



        randCount++;

        //$scope.$apply();
    }

    function startCycle(){
        console.timeEnd("MapLoad");

        $scope.randoms = randBuss;
        $scope.rand = randBuss[randCount];
        var randCount = 0;



        //$interval(cycle(), 5000);

        $interval(function(){cycle();}, ts.fixed.CycleTime);
    }




    $scope.closeAllWindows = function(){
        console.log("close");
        angular.forEach($scope.businesses, function(value, key){
            value.showWindow = false;
        });
    };
});


