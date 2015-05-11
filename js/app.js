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

function Dynamic(id, categories, selectedCategory, businesses, selectedBusiness){
    this.ID = id;
    this.Categories = categories;
    this.SelectedCategory = selectedCategory;
    this.Businesses = businesses;
    this.SelectedBusiness = selectedBusiness;
}

function Fixed(id, lat, lon, locstring, mapzoom, logo, primarycolor, slogan, showcompany, foursquareid, maplimit, mapterm){
    this.ID = id;
    this.Lat = lat;
    this.Lon = lon;
    this.LocString = locstring;
    this.MapZoom = mapzoom;
    this.Logo = logo;
    this.PrimaryColor = primarycolor;
    this.Slogan = slogan;
    this.ShowCompany = showcompany;
    this.FoursquareID = foursquareid;
    this.MapLimit = maplimit;
    this.MapTerm = mapterm;
}
app.factory('TriplerService', function($http){



    var fac = {};

    fac.today = getToday();

    fac.dynamic = new Dynamic(null, [], null, [], null);
    fac.fixed = new Fixed(null, null, null, null, null, null, null, null, null, null, null, null);

    fac.checkUsage = function(){};
    fac.checkID = function(id){};
    fac.checkLocation = function(){};
    fac.updateLocation = function(){};

    fac.getFixed = function(id){
        return $http.get("http://doohapps.com/citytripapp/read.php?id="+id);
    };
    fac.updateFixed = function(id){
        $http.post("http://doohapps.com/citytripapp/write.php?id="+id, JSON.stringify(fac.fixed)).success(function(data){
            console.log(data);
        });
    };


    fac.addReviewsToTripAdvisor = function(){

        angular.forEach(fac.dynamic.Businesses, function(value, key){
            $http.get(value.api_detail_url).success(function(details){
                value.setReviews(details.reviews);
                value.setContent();
            });
        });
        //console.log(fac.dynamic.Businesses);
    };
    fac.addPhotosToFoursquare = function(){

        angular.forEach(fac.dynamic.Businesses, function(value, key){
            $http.get("https://api.foursquare.com/v2/venues/"+value.fid+"/photos?client_id=RUPUSGLEH3TPT0TTINACNKO1DYNH0QNIXOKOGN11BYKADTF2&client_secret=MEN100NRVI4JFP5NICL0WL3U32B2M2GDLG0TIC0LAVSNQKIN&v="+fac.today+"&m=foursquare").success(function(pics){
                value.setPics(pics.response.photos.items);
                value.setContent();
            });

        });
        //console.log(fac.dynamic.Businesses);
    };
    fac.addShortUrlToFoursquare = function(){

        angular.forEach(fac.dynamic.Businesses, function(value, key){
            $http.post("https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyBioj_ghWQx_SdIPrs4FjsmwgEYx5NRYoA", {"longUrl": value.url}).success(function(g){
                value.setShortUrl(g.id);
            });

        });
        //console.log(fac.dynamic.Businesses);
    };
    fac.addShortUrlToTripAdvisor = function(){

        angular.forEach(fac.dynamic.Businesses, function(value, key){
            $http.post("https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyBioj_ghWQx_SdIPrs4FjsmwgEYx5NRYoA", {"longUrl": value.web_url}).success(function(g){
                value.setShortUrl(g.id);
            });

        });
        //console.log(fac.dynamic.Businesses);
    };
    fac.addShortUrlToYelp = function(){

        angular.forEach(fac.dynamic.Businesses, function(value, key){
            $http.post("https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyBioj_ghWQx_SdIPrs4FjsmwgEYx5NRYoA", {"longUrl": value.url}).success(function(g){
                value.setShortUrl(g.id);
            });

        });
        //console.log(fac.dynamic.Businesses);
    };
    fac.addCompanyToFoursquare = function(id){
        $http.get("https://api.foursquare.com/v2/venues/"+id+"?client_id=RUPUSGLEH3TPT0TTINACNKO1DYNH0QNIXOKOGN11BYKADTF2&client_secret=MEN100NRVI4JFP5NICL0WL3U32B2M2GDLG0TIC0LAVSNQKIN&v="+fac.today+"&m=foursquare").success(function(c){
            var value = c.response;
            //console.log(typeof(value.venue.name));


            if(typeof(value.venue.name) != "undefined"){var name=value.venue.name}else{var name=""};
            if(typeof(value.venue.location) != "undefined"){loc=value.venue.location}else{loc=""};
            if(typeof(value.venue.categories) != "undefined"){categories=value.venue.categories}else{categories=""};
            if(typeof(value.venue.verified) != "undefined"){verified=value.venue.verified}else{verified=""};
            if(typeof(value.venue.stats) != "undefined"){stats=value.venue.stats}else{stats=""};
            if(typeof(value.venue.price) != "undefined"){price=value.venue.price}else{price=""};
            if(typeof(value.venue.rating) != "undefined"){rating=value.venue.rating}else{rating=""};
            if(typeof(value.venue.ratingColor) != "undefined"){ratingColor=value.venue.ratingColor}else{ratingColor=""};
            if(typeof(value.venue.ratingSignals) != "undefined"){ratingSignals=value.venue.ratingSignals}else{ratingSignals=""};
            if(typeof(value.venue.hours) != "undefined"){hours=value.venue.hours}else{hours=""};
            if(typeof(value.venue.specials) != "undefined"){specials=value.venue.specials}else{specials=""};
            if(typeof(value.venue.photos) != "undefined"){photos=value.venue.photos}else{photos=""};
            if(typeof(value.venue.hereNow) != "undefined"){hereNow=value.venue.hereNow}else{hereNow=""};
            if(typeof(value.tips) != "undefined"){tips=value.tips}else{tips=""};

            //console.log(name);
            var y = new fqResult(fac.dynamic.Businesses.length, value.venue.id,name,loc, categories, verified, stats, price, rating, ratingColor, ratingSignals, hours, specials, photos, hereNow, tips);
            console.log(y);
            y.setContent();
            fac.dynamic.Businesses.push(y);
            //console.log(fac.dynamic.Businesses);

        });
    };

    fac.getYelp = function(url, n){
        var def = $.Deferred();

        $http.get(url).success(function(data){
            console.log(data);
            list = new Array();
            angular.forEach(data, function(value, key){
                if(value.error){
                    console.log(value.error);
                }else{
                    var y = new yelpResult(n, value.categories,value.display_phone,value.id,value.image_url,value.is_claimed,value.is_closed,value.location,value.mobile_url,value.name,value.phone,value.rating,value.rating_img_url,value.rating_img_url_large,value.rating_img_url_small,value.review_count,value.reviews,value.snippet_image_url,value.snippet_text,value.url)
                    //console.log(y);
                    fac.dynamic.Businesses.push(y);
                    angular.forEach(value.categories, function(value, key){
                        var cat = [];
                        cat[0] = value;
                        cat[1] = 1;

                        var result = $.grep(fac.dynamic.Categories, function(e){ return e[0][1] == value[1]; });
                        if (result.length != 0) {
                            //console.log("found");
                            fac.dynamic.Categories[fac.dynamic.Categories.indexOf(result[0])][1]++;
                        }else{
                            //console.log("new");
                            fac.dynamic.Categories.push(cat);
                        }
                    });
                }
                n++;

            });
            //l1 = list;
            //return list;
            return def.resolve({1:fac.dynamic});
        }).error(function(data){
            console.log(data);
            //$scope.error = true;
            //$scope.message = "Oeps";
            return def.reject({0:data});
        });

        return def.promise();
    };


    function randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
    }
    fac.getYelpJS = function(loc, term, n){
        var method = 'GET';
        var url = 'http://api.yelp.com/v2/search';
        var params = {
            callback: 'angular.callbacks._0',
            location: loc,
            oauth_consumer_key: 'UVOv68GWWuYUEHgIOs2kbA', //Consumer Key
            oauth_token: 'rGxuTEJtPFiQswZ3ai4up_qKrDBWPlQy', //Token
            oauth_signature_method: "HMAC-SHA1",
            oauth_timestamp: new Date().getTime(),
            oauth_nonce: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
            term: term
        };
        var consumerSecret = 'igfK7uLT0q2o8buNgEUoWvGkcIU'; //Consumer Secret
        var tokenSecret = '19rfxqDsWEfQ7k_QrVQUjEHWopw'; //Token Secret
        var signature = oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, { encodeSignature: false});
        params['oauth_signature'] = signature;


        var def = $.Deferred();

        $http.jsonp(url, {params: params}).success(function(data){

            list = new Array();
            angular.forEach(data.businesses, function(value, key){
                if(value.error){
                    console.log(value.error);
                }else{
                    var y = new yelpResult(n, value.categories,value.display_phone,value.id,value.image_url,value.is_claimed,value.is_closed,value.location,value.mobile_url,value.name,value.phone,value.rating,value.rating_img_url,value.rating_img_url_large,value.rating_img_url_small,value.review_count,value.reviews,value.snippet_image_url,value.snippet_text,value.url)
                    //console.log(y);
                    fac.dynamic.Businesses.push(y);
                    angular.forEach(value.categories, function(value, key){
                        var cat = [];
                        cat[0] = value;
                        cat[1] = 1;

                        var result = $.grep(fac.dynamic.Categories, function(e){ return e[0][1] == value[1]; });
                        if (result.length != 0) {
                            //console.log("found");
                            fac.dynamic.Categories[fac.dynamic.Categories.indexOf(result[0])][1]++;
                        }else{
                            //console.log("new");
                            fac.dynamic.Categories.push(cat);
                        }
                    });
                }
                n++;

            });
            //l1 = list;
            //return list;
            //fac.addReviewsToYelp();
            fac.addShortUrlToYelp();
            console.log(fac.dynamic);
            return def.resolve({1:fac.dynamic});
        }).error(function(data){
            console.log(data);
            //$scope.error = true;
            //$scope.message = "Oeps";
            return def.reject({0:data});
        });

        return def.promise();

    };

    fac.addReviewsToYelp = function(){
        angular.forEach(fac.dynamic.Businesses, function(value, key){
            var method = 'GET';
            var url = 'http://api.yelp.com/v2/business/'+value.yid;
            var params = {
                callback: 'angular.callbacks._0',
                location: "gent",
                oauth_consumer_key: 'UVOv68GWWuYUEHgIOs2kbA', //Consumer Key
                oauth_token: 'rGxuTEJtPFiQswZ3ai4up_qKrDBWPlQy', //Token
                oauth_signature_method: "HMAC-SHA1",
                oauth_timestamp: new Date().getTime(),
                oauth_nonce: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
                term: "food"
            };
            var consumerSecret = 'igfK7uLT0q2o8buNgEUoWvGkcIU'; //Consumer Secret
            var tokenSecret = '19rfxqDsWEfQ7k_QrVQUjEHWopw'; //Token Secret
            var signature = oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, { encodeSignature: false});
            params['oauth_signature'] = signature;

            $http.jsonp(url, {params: params}).success(function(data){
                console.log(data);
            });
        });
    };

    fac.getTripAdvisor = function(url, n){
        var def = $.Deferred();

        $http.get(url).success(function(data){
            angular.forEach(data.data, function(value, key){
                if(value.error){
                    console.log(value.error);
                }else{
                    var y = new taResult(n, value.address_obj, value.distance, value.percent_recommended, value.latitude, value.rating, value.cuisine, value.location_id, value.api_detail_url, value.ranking_data, value.location_string, value.web_url, value.price_level, value.rating_image_url, value.awards, value.name, value.num_reviews, value.write_review, value.category, value.subcategory, value.ancestors, value.see_all_photos, value.longitude);
                    fac.dynamic.Businesses.push(y);

                    var cat = [];
                    cat[0] = value.category;
                    cat[1] = 1;

                    var result = $.grep(fac.dynamic.Categories, function(e){ return e[0].localized_name == value.category.localized_name; });
                    if (result.length != 0) {
                        fac.dynamic.Categories[fac.dynamic.Categories.indexOf(result[0])][1]++;
                    }else{
                        fac.dynamic.Categories.push(cat);
                    }
                }
                n++;
            });

            fac.addReviewsToTripAdvisor();
            fac.addShortUrlToTripAdvisor();
            return def.resolve({1:fac.dynamic});
        }).error(function(data){
            console.log(data);
            return def.reject({0:data});
        });

        return def.promise();
    };
    fac.getFoursquare = function(url, n){
        console.time("FQLoad");
        var def = $.Deferred();

        $http.get(url).success(function(data){
            angular.forEach(data.response.groups[0].items, function(value, key){
                //console.log(value);
                if(value.error){
                    console.log(value.error);
                }else{
                    var y = new fqResult(n, value.venue.id, value.venue.name, value.venue.location, value.venue.categories, value.venue.verified, value.venue.stats, value.venue.price, value.venue.rating, value.venue.ratingColor, value.venue.ratingSignals, value.venue.hours, value.venue.specials, value.venue.photos, value.venue.hereNow, value.tips, value.venue.shortUrl);

                    fac.dynamic.Businesses.push(y);

                    var cat = [];
                    cat[0] = value.venue.categories[0];
                    cat[1] = 1;

                    var result = $.grep(fac.dynamic.Categories, function(e){ return e[0].name == value.venue.categories[0].name; });
                    if (result.length != 0) {
                        fac.dynamic.Categories[fac.dynamic.Categories.indexOf(result[0])][1]++;
                    }else{
                        fac.dynamic.Categories.push(cat);
                    }
                }
                n++;
            });

            fac.addCompanyToFoursquare(fac.fixed.FoursquareID);
            fac.addPhotosToFoursquare();
            fac.addShortUrlToFoursquare();

            console.timeEnd("FQLoad");
            return def.resolve({1:fac.dynamic});
        }).error(function(data){
            console.log(data);

            return def.reject({0:data});
        });

        return def.promise();
    };

    return fac;
});

function getToday(){
    var d = new Date();
    var dd = d.getDate();
    var mm = d.getMonth()+1; //January is 0!
    var yyyy = d.getFullYear();

    if(dd<10) {
        dd='0'+dd
    }

    if(mm<10) {
        mm='0'+mm
    }

    return yyyy+mm+dd;
}


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
            ts.fixed = new Fixed(d.data.ID, d.data.Lat, d.data.Lon, d.data.LocString, d.data.MapZoom, d.data.Logo, d.data.PrimaryColor, d.data.Slogan, d.data.ShowCompany, d.data.FoursquareID, d.data.MapLimit, d.data.MapTerm);

            var api = "fq";
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
                    ts.getFoursquare("https://api.foursquare.com/v2/venues/explore?client_id=RUPUSGLEH3TPT0TTINACNKO1DYNH0QNIXOKOGN11BYKADTF2&client_secret=MEN100NRVI4JFP5NICL0WL3U32B2M2GDLG0TIC0LAVSNQKIN&ll="+ts.fixed.Lat+","+ts.fixed.Lon+"&v="+ts.today+"&m=foursquare&section=food", 0).then(function(o){
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
        $scope.validated = true;


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
        //startCycle();
    }

    var randBuss;
    var randCount = 0;

    function cycle(){
        console.log(randCount);
        angular.forEach($scope.businesses, function(value, key){
            if(value.showWindow == true) value.showWindow = false;
        });
        $scope.$apply();

        $scope.businesses[randBuss[randCount]].showWindow = true;

        /* QR Width280 */

        $("#qr-wrapper ul li").removeClass("border");
        $("#qr-wrapper ul li:nth-child("+(randCount+1)+")").addClass("border");

        if(randCount >= 4){
            //console.log("start left");
            $( "#qr-wrapper ul" ).animate({
                left: "-=270"
            }, 500, function() {
                // Animation complete.
            });
        }
        if(randCount == randBuss.length-2){
            $( "#qr-wrapper ul" ).animate({
                left: "0"
            }, 500, function() {
                // Animation complete.
            });
        }


        randCount++;
        if(randCount == $scope.businesses.length-1){
            randBuss = randomNumbers($scope.businesses.length);
            $scope.randoms = randBuss;
            $scope.rand = randBuss[randCount];
            randCount = 0;
            //console.log("reset");
        }
        $scope.$apply();
    }

    function startCycle(){
        console.timeEnd("MapLoad");

        $scope.randoms = randBuss;
        $scope.rand = randBuss[randCount];
        var randCount = 0;



        //$interval(cycle(), 5000);
        $interval(function(){cycle();}, 10000);
    }




    $scope.closeAllWindows = function(){
        console.log("close");
        angular.forEach($scope.businesses, function(value, key){
            value.showWindow = false;
        });
    };
});

function randomNumbers(length){
    var arr = [];
    while(arr.length < length){
        var randomnumber=Math.ceil(Math.random()*length-1);
        var found=false;
        for(var i=0;i<arr.length;i++){
            if(arr[i]==randomnumber){found=true;break}
        }
        if(!found)arr[arr.length]=randomnumber;
    }

    return arr;

}

/*function taResult(n, address_obj, distance, percent_recommended, latitude, rating, cuisine, location_id, api_detail_url, ranking_data, location_string, web_url, price_level, rating_image_url, awards, name, num_reviews, write_review, category, subcategory, ancestors, see_all_photos, longitude){
    this.id = n;
    this.address_obj = address_obj;
    if(address_obj.postalcode == null){address_obj.postalcode = "";}
    this.distance = distance;
    this.percent_recommended = percent_recommended;
    this.latitude = latitude;
    this.rating = rating;
    this.cuisine = cuisine;
    this.location_id = location_id;
    this.api_detail_url = api_detail_url;
    this.ranking_data = ranking_data;
    this.location_string = location_string;
    this.web_url = web_url;
    this.price_level = price_level;
    this.rating_image_url = rating_image_url;
    this.awards = awards;
    this.name = name;
    this.num_reviews = num_reviews;
    this.write_review = write_review;
    this.category = category;
    this.subcategory = subcategory;
    this.ancestors = ancestors;
    this.see_all_photos = see_all_photos;
    this.longitude = longitude;


    this.setReviews = function(reviews){
        this.reviews = reviews;
        if(this.reviews !== null && this.reviews.length > 0){
            this.snippet = this.reviews[0].text;
        }else{
            this.snippet = "No reviews";
        }
    };



    this.showWindow = false;
    this.icon = "img/Place-icon.png";

    this.setContent = function(){
        this.content = '<div class="window"><div class="name">'+name+'</div><div class="rating"><img src="'+rating_image_url+'"/></div><div class="det-left"><div class="adres"><p>'+address_obj.street1+'</p><p>'+address_obj.postalcode+' '+address_obj.city+'</p></div><div class="snippet">'+this.snippet+'</div></div><div class="det-right"><div class="image"><img src=""/></div></div></div>';
    };


    this.url = web_url;
}

function yelpResult(n, categories,display_phone,id,image_url,is_claimed,is_closed,location,mobile_url,name,phone,rating,rating_img_url,rating_img_url_large,rating_img_url_small,review_count,reviews,snippet_image_url,snippet_text,url){
    this.id = n;
    this.categories = categories;
    this.display_phone = display_phone;
    this.yid = id;
    this.image_url = image_url;
    this.is_claimed = is_claimed;
    this.is_closed = is_closed;
    this.location = location;
    this.mobile_url = mobile_url;
    this.name = name;
    this.phone = phone;
    this.rating = rating;
    this.rating_img_url = rating_img_url;
    this.rating_img_url_large = rating_img_url_large;
    this.rating_img_url_small = rating_img_url_small;
    this.review_count = review_count;
    this.reviews = reviews;
    this.snippet_image_url = snippet_image_url;
    this.snippet_text = snippet_text;
    this.url = url;

    this.latitude = location.coordinate.latitude;
    this.longitude = location.coordinate.longitude;
    this.showWindow = false;
    this.icon = "img/Place-icon.png";
    this.content = '<div class="window"><div class="name">'+name+'</div><div class="rating"><img src="'+rating_img_url+'"/></div><div class="det-left"><div class="adres"><p>'+location.address+'</p><p>'+location.postal_code+' '+location.city+'</p></div><div class="snippet">'+snippet_text+'</div></div><div class="det-right"><div class="image"><img src="'+image_url+'"/></div></div></div>';
}

function fqResult(n, id, name, location, categories, verified, stats, price, rating, ratingColor, ratingSignals, hours, specials, photos, hereNow, tips, shortUrl){
    this.id = n;
    this.fid = id;
    this.name = name;
    this.location = location;
    this.categories = categories;
    this.verified = verified;
    this.stats = stats;
    this.price = price;
    this.rating = rating;
    this.ratingColor = ratingColor;
    this.ratingSignals = ratingSignals;
    this.hours = hours;
    this.specials = specials;
    this.photos = photos;
    this.hereNow = hereNow;
    this.tips = tips;
    this.shortUrl = shortUrl;

    this.setPics = function(pics){
      this.pics = pics;
        image_url = "";
        if(pics != null && this.pics.length > 0){
            image_url = pics[0].prefix+"300x100"+pics[0].suffix;
        }
    };



    //console.log(categories);


    this.latitude = location.lat;
    this.longitude = location.lng;
    this.showWindow = false;
    this.icon = "img/marker.png";
    //this.icon = '<img class="img_bg" src="'+this.catIcon+'"/>';

    i = categories[0].icon.prefix;
    //console.log(categories[0].icon.prefix);
    //this.catIcon = "https://foursquare.com/img/categories/"+i.split("/")[5]+"/"+i.split("/")[6]+"64"+categories[0].icon.suffix;
    this.catIcon = categories[0].icon.prefix+"64"+categories[0].icon.suffix;


    this.url = "https://foursquare.com/v/foursquare-hq/"+id;


    this.setContent = function(){
        this.content = '<div class="window"><div class="name">'+name+'</div><div class="rating">'+rating+'</div><div class="det-left"><div class="adres"><p>'+location.address+'</p><p>'+location.postalCode+' '+location.city+'</p></div><div class="snippet">'+tips[0].text+'</div></div><div class="det-right"><div class="image"><img src="'+image_url+'"/></div></div></div>';
    }
}
    */
function taResult(n, address_obj, distance, percent_recommended, latitude, rating, cuisine, location_id, api_detail_url, ranking_data, location_string, web_url, price_level, rating_image_url, awards, name, num_reviews, write_review, category, subcategory, ancestors, see_all_photos, longitude){
    this.id = n;
    this.address_obj = address_obj;
    if(address_obj.postalcode == null){address_obj.postalcode = "";}
    this.distance = distance;
    this.percent_recommended = percent_recommended;
    this.latitude = latitude;
    this.rating = rating;
    this.cuisine = cuisine;
    this.location_id = location_id;
    this.api_detail_url = api_detail_url;
    this.ranking_data = ranking_data;
    this.location_string = location_string;
    this.web_url = web_url;
    this.price_level = price_level;
    this.rating_image_url = rating_image_url;
    this.awards = awards;
    this.name = name;
    this.num_reviews = num_reviews;
    this.write_review = write_review;
    this.category = category;
    this.subcategory = subcategory;
    this.ancestors = ancestors;
    this.see_all_photos = see_all_photos;
    this.longitude = longitude;


    this.setReviews = function(reviews){
        this.reviews = reviews;
        if(this.reviews !== null && this.reviews.length > 0){
            this.snippet = this.reviews[0].text;
        }else{
            this.snippet = "No reviews";
        }
    };



    this.showWindow = false;
    this.icon = "img/Place-icon.png";

    this.short = "";
    this.setShortUrl = function(s){
        this.short = ""+s;
    };

    powered = '<img src="img/pow_ta.png" />';

    this.setContent = function(){
        this.content = '<div class="window"><div class="det-left"><div class="top"><div class="name">'+name+'</div><div class="rating"><img src="'+rating_image_url+'"/></div></div><div class="adres"><p>'+address_obj.street1+'</p><p>'+address_obj.postalcode+' '+address_obj.city+'</p></div><div class="snippet">'+this.snippet+'</div><div class="powered">'+powered+'</div></div><div class="det-right"><div class="image"><img src=""/></div></div></div>';
    };


    this.url = web_url;
}

function yelpResult(n, categories,display_phone,id,image_url,is_claimed,is_closed,location,mobile_url,name,phone,rating,rating_img_url,rating_img_url_large,rating_img_url_small,review_count,reviews,snippet_image_url,snippet_text,url){
    this.id = n;
    this.categories = categories;

    this.display_phone = "";
    if(typeof(display_phone)!="undefined")this.display_phone = display_phone;
    this.yid = id;
    this.image_url = "";
    if(typeof(image_url) != "undefined")this.image_url = image_url;
    this.is_claimed = is_claimed;
    this.is_closed = is_closed;
    this.location = location;
    this.mobile_url = mobile_url;
    this.name = name;
    this.phone = phone;
    this.rating = rating;
    this.rating_img_url = rating_img_url;
    this.rating_img_url_large = rating_img_url_large;
    this.rating_img_url_small = rating_img_url_small;
    this.review_count = review_count;
    //this.reviews = reviews;
    this.reviews = "";
    this.snippet_image_url = snippet_image_url;
    this.snippet_text = snippet_text;
    this.url = url;

    this.latitude = location.coordinate.latitude;
    this.longitude = location.coordinate.longitude;
    this.showWindow = false;
    this.icon = "img/Place-icon.png";

    this.short = "";
    this.setShortUrl = function(s){
        this.short = ""+s;
    };

    powered = '<img src="img/pow_yelp.png" />';
    //this.content = "test";
    this.content = '<div class="window"><div class="det-left"><div class="top"><div class="name">'+name+'</div><div class="rating"><img src="'+rating_img_url+'"/></div></div><div class="adres"><p>'+location.address+'</p><p>'+location.postal_code+' '+location.city+'</p></div><div class="snippet">'+snippet_text+'</div><div class="powered">'+powered+'</div></div><div class="det-right"><div class="image"><img src="'+image_url+'"/></div></div></div>';
}

function fqResult(n, id, name, location, categories, verified, stats, price, rating, ratingColor, ratingSignals, hours, specials, photos, hereNow, tips){
    this.id = n;
    this.fid = id;
    this.name = name;
    this.location = location;
    this.categories = categories;
    this.verified = verified;
    this.stats = stats;
    this.price = price;
    this.rating = rating;
    this.ratingColor = ratingColor;
    this.ratingSignals = ratingSignals;

    this.hours = "";
    if(typeof(hours.status) != "undefined")this.hours = hours;

    this.specials = specials;
    this.photos = photos;
    this.hereNow = hereNow;
    this.tips = tips;


    //console.log(hours);


    var img1 = "";
    var img2 = "";
    var img3 = "";
    var img4 = "";
    var img0 =  "";
    this.setPics = function(pics){
        this.pics = pics;


        if(pics != null && this.pics.length > 0){
            //image_url = pics[0].prefix+"500x300"+pics[0].suffix;

            if(typeof(pics[0]) == "object")img0 = '<div class="big"><img src="'+pics[0].prefix+"500x300"+pics[0].suffix+'" alt="img0" /></div>';
            if(typeof(pics[1]) == "object")img1 = '<div class="small"><img src="'+pics[1].prefix+"300x300"+pics[1].suffix+'" alt="img1" /></div>';
            if(typeof(pics[2]) == "object")img2 = '<div class="small"><img src="'+pics[2].prefix+"300x300"+pics[2].suffix+'" alt="img2" /></div>';
            if(typeof(pics[3]) == "object")img3 = '<div class="small"><img src="'+pics[3].prefix+"300x300"+pics[3].suffix+'" alt="img3" /></div>';
            if(typeof(pics[4]) == "object")img4 = '<div class="small"><img src="'+pics[4].prefix+"300x300"+pics[4].suffix+'" alt="img4" /></div>';

        }
    };

    this.short = "";
    this.setShortUrl = function(s){
        this.short = ""+s;
    };

    this.latitude = location.lat;
    this.longitude = location.lng;
    this.showWindow = false;
    this.icon = "img/marker.png";

    i = categories[0].icon.prefix;
    this.catIcon = categories[0].icon.prefix+"64"+categories[0].icon.suffix;


    this.url = "https://foursquare.com/v/foursquare-hq/"+id;

    var stars = "";
    if(typeof(rating) != "undefined"){
        if(rating > 1){stars += '<i class="star"></i>';}else{stars += '<i class="star gray"></i>';}
        if(rating > 3){stars += '<i class="star"></i>';}else{stars += '<i class="star gray"></i>';}
        if(rating > 5){stars += '<i class="star"></i>';}else{stars += '<i class="star gray"></i>';}
        if(rating > 7){stars += '<i class="star"></i>';}else{stars += '<i class="star gray"></i>';}
        if(rating > 9){stars += '<i class="star"></i>';}else{stars += '<i class="star gray"></i>';}
    }


    //console.log(typeof(tips[0]));
    var c_tips = "";
    if(typeof(tips[0]) != "undefined"){c_tips = tips[0].text;}

    powered = '<img src="img/pow_fq.png" />';

    this.setContent = function(){
        this.content = '<div class="window"><div class="det-left"><div class="top"><div class="name">'+name+'</div><div class="rating">'+stars+'</div></div><div class="adres"><p>'+location.address+'</p><p>'+location.postalCode+' '+location.city+'</p></div><div class="hours"><p>'+hours.status+'</p></div><div class="snippet">'+c_tips+'</div><div class="powered">'+powered+'</div></div><div class="det-right"><div class="imgs_wrap">'+img0+'<div class="small-wrap">'+img1+img2+img3+'</div></div></div></div>';
        //console.log(this.content);
    }
}