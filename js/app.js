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

    fac.today = new Date();
    var dd = fac.today.getDate();
    var mm = fac.today.getMonth()+1; //January is 0!
    var yyyy = fac.today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    }

    if(mm<10) {
        mm='0'+mm
    }

    fac.today = yyyy+mm+dd;

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
    fac.addCompanyToFoursquare = function(id){
        $http.get("https://api.foursquare.com/v2/venues/"+id+"?client_id=RUPUSGLEH3TPT0TTINACNKO1DYNH0QNIXOKOGN11BYKADTF2&client_secret=MEN100NRVI4JFP5NICL0WL3U32B2M2GDLG0TIC0LAVSNQKIN&v="+fac.today+"&m=foursquare").success(function(c){
            value = c.response;
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
            y = new fqResult(fac.dynamic.Businesses.length, value.venue.id,name,loc, categories, verified, stats, price, rating, ratingColor, ratingSignals, hours, specials, photos, hereNow, tips);
            console.log(y);
            y.setContent();
            fac.dynamic.Businesses.push(y);
            //console.log(fac.dynamic.Businesses);

        });
    };

    fac.getYelp = function(url, n){
        var def = $.Deferred();

        $http.get(url).success(function(data){
            list = new Array();
            angular.forEach(data, function(value, key){
                if(value.error){
                    console.log(value.error);
                }else{
                    y = new yelpResult(n, value.categories,value.display_phone,value.id,value.image_url,value.is_claimed,value.is_closed,value.location,value.mobile_url,value.name,value.phone,value.rating,value.rating_img_url,value.rating_img_url_large,value.rating_img_url_small,value.review_count,value.reviews,value.snippet_image_url,value.snippet_text,value.url)
                    //console.log(y);
                    fac.dynamic.Businesses.push(y);
                    angular.forEach(value.categories, function(value, key){
                        cat = [];
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
    fac.getTripAdvisor = function(url, n){
        var def = $.Deferred();

        $http.get(url).success(function(data){
            angular.forEach(data.data, function(value, key){
                if(value.error){
                    console.log(value.error);
                }else{
                    y = new taResult(n, value.address_obj, value.distance, value.percent_recommended, value.latitude, value.rating, value.cuisine, value.location_id, value.api_detail_url, value.ranking_data, value.location_string, value.web_url, value.price_level, value.rating_image_url, value.awards, value.name, value.num_reviews, value.write_review, value.category, value.subcategory, value.ancestors, value.see_all_photos, value.longitude);
                    //fac.dynamic.Businesses[fac.dynamic.Businesses.indexOf(value)] = y;
                    console.log(y.id);
                    fac.dynamic.Businesses.push(y);

                    cat = [];
                    cat[0] = value.category;
                    cat[1] = 1;

                    var result = $.grep(fac.dynamic.Categories, function(e){ return e[0].localized_name == value.category.localized_name; });
                    if (result.length != 0) {
                        //console.log("found");
                        fac.dynamic.Categories[fac.dynamic.Categories.indexOf(result[0])][1]++;
                    }else{
                        //console.log("new");
                        fac.dynamic.Categories.push(cat);
                    }
                }
                n++;
            });
            //l1 = list;
            //return list;
            //console.log("ret");
            fac.addReviewsToTripAdvisor();
            //console.log("ret2");
            return def.resolve({1:fac.dynamic});
        }).error(function(data){
            console.log(data);
            //$scope.error = true;
            //$scope.message = "Oeps";
            return def.reject({0:data});
        });

        return def.promise();
    };
    fac.getFoursquare = function(url, n){
        var def = $.Deferred();

        $http.get(url).success(function(data){
            angular.forEach(data.response.groups[0].items, function(value, key){
                //console.log(value);
                if(value.error){
                    console.log(value.error);
                }else{
                    y = new fqResult(n, value.venue.id, value.venue.name, value.venue.location, value.venue.categories, value.venue.verified, value.venue.stats, value.venue.price, value.venue.rating, value.venue.ratingColor, value.venue.ratingSignals, value.venue.hours, value.venue.specials, value.venue.photos, value.venue.hereNow, value.tips, value.venue.shortUrl);
                    //fac.dynamic.Businesses[fac.dynamic.Businesses.indexOf(value)] = y;
                    //console.log(value);
                    fac.dynamic.Businesses.push(y);

                    cat = [];
                    cat[0] = value.venue.categories[0];
                    cat[1] = 1;

                    var result = $.grep(fac.dynamic.Categories, function(e){ return e[0].name == value.venue.categories[0].name; });
                    if (result.length != 0) {
                        //console.log("found");
                        fac.dynamic.Categories[fac.dynamic.Categories.indexOf(result[0])][1]++;
                    }else{
                        //console.log("new");
                        fac.dynamic.Categories.push(cat);
                    }
                }
                n++;
            });
            //l1 = list;
            //return list;
            //console.log("ret");
            fac.addCompanyToFoursquare(fac.fixed.FoursquareID);
            fac.addPhotosToFoursquare();
            //console.log("ret2");

            return def.resolve({1:fac.dynamic});
        }).error(function(data){
            console.log(data);
            //$scope.error = true;
            //$scope.message = "Oeps";
            return def.reject({0:data});
        });

        return def.promise();
    };

    return fac;
});


app.controller("MainController", function($scope, $http, uiGmapGoogleMapApi, $filter, TriplerService, $cookies, $interval, $timeout) {
    var ts = TriplerService;

    $scope.loading = true;
    $scope.validated = false;


    if($cookies["trip_id"]){
        //console.log($cookies["trip_id"]);
        $scope.inputID = $cookies["trip_id"];
        startLoad();
    }else{
        $scope.loading = false;
    }

    $scope.inputID = 1;
    $scope.changeID = function(i){
        $scope.inputID = i;
    };
    $scope.enterID = startLoad;

    function startLoad() {
        //console.log($scope.inputID);
        $cookies["trip_id"] = $scope.inputID;



        $scope.message = "Loading Tripler...";
        ts.getFixed($scope.inputID).then(function(d) {
            console.log(d.data);

            //ts.fixed = ;
            ts.fixed = new Fixed(d.data.ID, d.data.Lat, d.data.Lon, d.data.LocString, d.data.MapZoom, d.data.Logo, d.data.PrimaryColor, d.data.Slogan, d.data.ShowCompany, d.data.FoursquareID, d.data.MapLimit, d.data.MapTerm);

            var api = "fq";
            switch(api){
                case "yelp":
                    ts.getYelp("php/get.php?location=Gent&limit=20&offset=0", 0).then(function(o){
                        //console.log(o);
                        //console.log(ts.dynamic);
                        console.log(ts.fixed.zoom);
                        makeMap(parseInt(ts.fixed.MapZoom), ts.fixed.Lat, ts.fixed.Lon);
                        $scope.brand_logo = ts.fixed.Logo;
                    });
                    break;
                case "ta":
                    ts.getTripAdvisor("http://api.tripadvisor.com/api/partner/2.0/map/51.0533111,3.7211195?key=4bfede65b8eb4ceebd7148c9879b0c85&lang=nl&lunit=km&distance=30", 0).then(function(o){
                        //console.log(o);
                        //console.log(ts.dynamic);
                        makeMap(parseInt(ts.fixed.MapZoom), ts.fixed.Lat, ts.fixed.Lon);
                        $scope.brand_logo = ts.fixed.Logo;
                    });
                    break;
                case "fq":
                    ts.getFoursquare("https://api.foursquare.com/v2/venues/explore?client_id=RUPUSGLEH3TPT0TTINACNKO1DYNH0QNIXOKOGN11BYKADTF2&client_secret=MEN100NRVI4JFP5NICL0WL3U32B2M2GDLG0TIC0LAVSNQKIN&ll=51.0533111,3.7211195&v="+ts.today+"&m=foursquare", 0).then(function(o){
                        //console.log(o);
                        //console.log(ts.dynamic);
                        makeMap(parseInt(ts.fixed.MapZoom), ts.fixed.Lat, ts.fixed.Lon);
                        console.log(ts.fixed.Logo);
                        $scope.brand_logo = ts.fixed.Logo;
                    });
                    break;
            }
        });


    }




    function makeMap(zoom, lat, lon){
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
        startCycle();
    }

    function startCycle(){
        var randBuss = randomNumbers($scope.businesses.length);
        var randCount = 0;
        $interval(function(){
            angular.forEach($scope.businesses, function(value, key){
                value.showWindow = false;
            });
            $scope.$apply();

            $scope.businesses[randBuss[randCount]].showWindow = true;


            randCount++;
            if(randCount == $scope.businesses.length){
                randBuss = randomNumbers($scope.businesses.length);
                randCount = 0;
                console.log("reset");
            }
            //$scope.$apply();
        }, 5000);
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
    this.hours = hours;
    this.specials = specials;
    this.photos = photos;
    this.hereNow = hereNow;
    this.tips = tips;
    image_url = "";

    this.setPics = function(pics){
        this.pics = pics;

        if(pics != null && this.pics.length > 0){
            image_url = pics[0].prefix+"300x100"+pics[0].suffix;
        }
    };

    this.latitude = location.lat;
    this.longitude = location.lng;
    this.showWindow = false;
    this.icon = "img/marker.png";

    i = categories[0].icon.prefix;
    this.catIcon = categories[0].icon.prefix+"64"+categories[0].icon.suffix;


    this.url = "https://foursquare.com/v/foursquare-hq/"+id;
    if(tips != ""){c_tips = tips[0].text}else{c_tips = "";}

    this.setContent = function(){
        this.content = '<div class="window"><div class="name">'+name+'</div><div class="rating">'+rating+'</div><div class="det-left"><div class="adres"><p>'+location.address+'</p><p>'+location.postalCode+' '+location.city+'</p></div><div class="snippet">'+c_tips+'</div></div><div class="det-right"><div class="image"><img src="'+image_url+'"/></div></div></div>';
    }
}