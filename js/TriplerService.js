/**
 * Created by bernhardmostrey on 13/05/15.
 */
app.factory('TriplerService', function($http){



    var fac = {};

    fac.today = getToday();

    //fac.dynamic = new Dynamic(null, [], null, [], null);
    fac.fixed = new Fixed(null, null, null, null, null, null, null, null, null, null, null, null, null, null);

    fac.checkUsage = function(){};
    fac.checkID = function(id){};
    fac.checkLocation = function(){};
    fac.updateLocation = function(){};

    fac.getFixed = function(){
        return $http.get("http://doohapps.com/citytripapp/read.php");
    };

    /*fac.getFixed = function(id){
     return $http.get("fixed.json");
     };*/

    /*fac.updateFixed = function(id){
     $http.post("http://doohapps.com/citytripapp/write.php?id="+id, JSON.stringify(fac.fixed)).success(function(data){
     console.log(data);
     });
     };*/


    fac.addReviewsToTripAdvisor = function(){

        angular.forEach(fac.fixed.Businesses, function(value, key){
            $http.get(value.api_detail_url).success(function(details){
                value.setReviews(details.reviews);
                value.setContent();
            });
        });
        //console.log(fac.fixed.Businesses);
    };
    fac.addPhotosToFoursquare = function(){

        angular.forEach(fac.fixed.Businesses, function(value, key){
            $http.get("https://api.foursquare.com/v2/venues/"+value.fid+"/photos?client_id=RUPUSGLEH3TPT0TTINACNKO1DYNH0QNIXOKOGN11BYKADTF2&client_secret=MEN100NRVI4JFP5NICL0WL3U32B2M2GDLG0TIC0LAVSNQKIN&v="+fac.today+"&m=foursquare").success(function(pics){
                value.setPics(pics.response.photos.items);
                value.setContent();
            });

        });
        //console.log(fac.fixed.Businesses);
    };
    fac.addShortUrlToFoursquare = function(){

        angular.forEach(fac.fixed.Businesses, function(value, key){
            $http.post("https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyBioj_ghWQx_SdIPrs4FjsmwgEYx5NRYoA", {"longUrl": value.url}).success(function(g){
                value.setShortUrl(g.id);
            });

        });
        //console.log(fac.fixed.Businesses);
    };
    fac.addShortUrlToTripAdvisor = function(){

        angular.forEach(fac.fixed.Businesses, function(value, key){
            $http.post("https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyBioj_ghWQx_SdIPrs4FjsmwgEYx5NRYoA", {"longUrl": value.web_url}).success(function(g){
                value.setShortUrl(g.id);
            });

        });
        //console.log(fac.fixed.Businesses);
    };
    fac.addShortUrlToYelp = function(){

        angular.forEach(fac.fixed.Businesses, function(value, key){
            $http.post("https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyBioj_ghWQx_SdIPrs4FjsmwgEYx5NRYoA", {"longUrl": value.url}).success(function(g){
                value.setShortUrl(g.id);
            });

        });
        //console.log(fac.fixed.Businesses);
    };
    fac.addCompanyToFoursquare = function(id){
        var def = $.Deferred();
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
            var y = new fqResult(fac.fixed.Businesses.length, value.venue.id,name,loc, categories, verified, stats, price, rating, ratingColor, ratingSignals, hours, specials, photos, hereNow, tips);
            y.icon = "img/here.png";
            console.log(y);
            y.setContent();
            fac.fixed.Businesses.push(y);
            //console.log(fac.fixed.Businesses);
            return def.resolve();

        });
        return def.promise();
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
                    fac.fixed.Businesses.push(y);
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
            fac.fixed.Businesses = [];
            list = new Array();
            angular.forEach(data.businesses, function(value, key){
                if(value.error){
                    console.log(value.error);
                }else{
                    var y = new yelpResult(n, value.categories,value.display_phone,value.id,value.image_url,value.is_claimed,value.is_closed,value.location,value.mobile_url,value.name,value.phone,value.rating,value.rating_img_url,value.rating_img_url_large,value.rating_img_url_small,value.review_count,value.reviews,value.snippet_image_url,value.snippet_text,value.url)
                    //console.log(y);
                    fac.fixed.Businesses.push(y);
                    /*angular.forEach(value.categories, function(value, key){
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
                    });*/
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
        angular.forEach(fac.fixed.Businesses, function(value, key){
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
            fac.fixed.Businesses = [];
            angular.forEach(data.data, function(value, key){
                if(value.error){
                    console.log(value.error);
                }else{
                    var y = new taResult(n, value.address_obj, value.distance, value.percent_recommended, value.latitude, value.rating, value.cuisine, value.location_id, value.api_detail_url, value.ranking_data, value.location_string, value.web_url, value.price_level, value.rating_image_url, value.awards, value.name, value.num_reviews, value.write_review, value.category, value.subcategory, value.ancestors, value.see_all_photos, value.longitude);
                    fac.fixed.Businesses.push(y);

                    /*var cat = [];
                    cat[0] = value.category;
                    cat[1] = 1;

                    var result = $.grep(fac.dynamic.Categories, function(e){ return e[0].localized_name == value.category.localized_name; });
                    if (result.length != 0) {
                        fac.dynamic.Categories[fac.dynamic.Categories.indexOf(result[0])][1]++;
                    }else{
                        fac.dynamic.Categories.push(cat);
                    }*/
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
            fac.fixed.Businesses = [];
            angular.forEach(data.response.groups[0].items, function(value, key){
                //console.log(value);
                if(value.error){
                    console.log(value.error);
                }else{
                    var y = new fqResult(n, value.venue.id, value.venue.name, value.venue.location, value.venue.categories, value.venue.verified, value.venue.stats, value.venue.price, value.venue.rating, value.venue.ratingColor, value.venue.ratingSignals, value.venue.hours, value.venue.specials, value.venue.photos, value.venue.hereNow, value.tips, value.venue.shortUrl);

                    fac.fixed.Businesses.push(y);

                    /*var cat = [];
                    cat[0] = value.venue.categories[0];
                    cat[1] = 1;

                    var result = $.grep(fac.fixed.Categories, function(e){ return e[0].name == value.venue.categories[0].name; });
                    if (result.length != 0) {
                        fac.fixed.Categories[fac.fixed.Categories.indexOf(result[0])][1]++;
                    }else{
                        fac.fixed.Categories.push(cat);
                    }*/
                }
                n++;
            });

            fac.addCompanyToFoursquare(fac.fixed.FoursquareID).then(function(){
                fac.addPhotosToFoursquare();
                fac.addShortUrlToFoursquare();
                console.timeEnd("FQLoad");
                //console.log(JSON.stringify(fac.fixed.Businesses));
                return def.resolve({1:fac.fixed});
            });



        }).error(function(data){
            console.log(data);

            //dynamic settings laden


            return def.reject({0:data});
        });

        return def.promise();
    };

    return fac;
});