/**
 * Created by bernhardmostrey on 13/05/15.
 */
/*function Dynamic(id, categories, selectedCategory, businesses, selectedBusiness){
    this.ID = id;
    this.Categories = categories;
    this.SelectedCategory = selectedCategory;
    this.Businesses = businesses;
    this.SelectedBusiness = selectedBusiness;
}*/

function Fixed(lat, lon, locstring, mapzoom, logo, primarycolor, slogan, showcompany, foursquareid, maplimit, mapterm, cycletime, api, businesses){
    //this.ID = id;
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
    this.API = api;
    this.CycleTime = cycletime;
    if(businesses == ""){this.Businesses = [];}else{this.Businesses = businesses;}

}
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
    if(hours && hours.status)this.hours = hours.status;
    //if(typeof(hours.status) != "undefined")this.hours = hours;

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
        this.content = '<div class="window"><div class="det-left"><div class="top"><div class="name">'+name+'</div><div class="rating">'+stars+'</div></div><div class="adres"><p>'+location.address+'</p><p>'+location.postalCode+' '+location.city+'</p></div><div class="hours"><p>'+this.hours+'</p></div><div class="snippet">'+c_tips+'</div><div class="powered">'+powered+'</div></div><div class="det-right"><div class="imgs_wrap">'+img0+'<div class="small-wrap">'+img1+img2+img3+'</div></div></div></div>';
        //console.log(this.content);
    }
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
