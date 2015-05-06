<?php
error_reporting(0);
/**
 * Yelp API v2.0 code sample.
 *
 * This program demonstrates the capability of the Yelp API version 2.0
 * by using the Search API to query for businesses by a search term and location,
 * and the Business API to query additional information about the top result
 * from the search query.
 * 
 * Please refer to http://www.yelp.com/developers/documentation for the API documentation.
 * 
 * This program requires a PHP OAuth2 library, which is included in this branch and can be
 * found here:
 *      http://oauth.googlecode.com/svn/code/php/
 * 
 * Sample usage of the program:
 * `php sample.php --term="bars" --location="San Francisco, CA"`
 */

// Enter the path that the oauth library is in relation to the php file
require_once('../lib/OAuth.php');

// Set your OAuth credentials here  
// These credentials can be obtained from the 'Manage API Access' page in the
// developers documentation (http://www.yelp.com/developers)
$CONSUMER_KEY = "UVOv68GWWuYUEHgIOs2kbA";
$CONSUMER_SECRET = "igfK7uLT0q2o8buNgEUoWvGkcIU";
$TOKEN = "rGxuTEJtPFiQswZ3ai4up_qKrDBWPlQy";
$TOKEN_SECRET = "19rfxqDsWEfQ7k_QrVQUjEHWopw";


$API_HOST = 'api.yelp.com';
$DEFAULT_TERM = '';
$DEFAULT_LOCATION = 'Gent, Belgium';
$SEARCH_LIMIT = null;
$SEARCH_PATH = '/v2/search/';
$BUSINESS_PATH = '/v2/business/';


/** 
 * Makes a request to the Yelp API and returns the response
 * 
 * @param    $host    The domain host of the API 
 * @param    $path    The path of the APi after the domain
 * @return   The JSON response from the request      
 */
function request($host, $path) {

    $unsigned_url = "http://" . $host . $path;

    // Token object built using the OAuth library
    $token = new OAuthToken($GLOBALS['TOKEN'], $GLOBALS['TOKEN_SECRET']);

    // Consumer object built using the OAuth library
    $consumer = new OAuthConsumer($GLOBALS['CONSUMER_KEY'], $GLOBALS['CONSUMER_SECRET']);

    // Yelp uses HMAC SHA1 encoding
    $signature_method = new OAuthSignatureMethod_HMAC_SHA1();

    $oauthrequest = OAuthRequest::from_consumer_and_token(
        $consumer, 
        $token, 
        'GET', 
        $unsigned_url
    );
    
    // Sign the request
    $oauthrequest->sign_request($signature_method, $consumer, $token);
    
    // Get the signed URL
    $signed_url = $oauthrequest->to_url();
    
    // Send Yelp API Call
    $ch = curl_init($signed_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    $data = curl_exec($ch);
    curl_close($ch);
    
    return $data;
}

/**
 * Query the Search API by a search term and location 
 * 
 * @param    $term        The search term passed to the API 
 * @param    $location    The search location passed to the API 
 * @return   The JSON response from the request 
 */
function search($b_lat, $b_lon, $b_location, $b_limit, $b_offset, $b_term) {
    $url_params = array();

    //print $b_term;
    //if(!empty($b_lat))$url_params['lat'] = $b_lat;
    //if(!empty($b_lon))$url_params['lon'] = $b_lon;
    if(!empty($b_lon) && !empty($b_lat))$url_params['cll'] = $b_lat.",".$b_lon;
    if(!empty($b_term))$url_params['term'] = $b_term;
    if(!empty($b_location))$url_params['location'] = $b_location;
    if(!empty($b_limit))$url_params['limit'] = $b_limit;
    if(!empty($b_offset))$url_params['offset'] = $b_offset;


    $search_path = $GLOBALS['SEARCH_PATH'] . "?" . http_build_query($url_params);

    /*
     $b_lat = $_GET["lat"];
$b_lon = $_GET["lon"];
$b_location = $_GET["location"];
$b_limit = $_GET["limit"];
$b_offset = $_GET["offset"];
$b_term = $_GET["term"];
     */
    
    return request($GLOBALS['API_HOST'], $search_path);
}

/**
 * Query the Business API by business_id
 * 
 * @param    $business_id    The ID of the business to query
 * @return   The JSON response from the request 
 */
function get_business($business_id) {
    $business_path = $GLOBALS['BUSINESS_PATH'] . $business_id;
    
    return request($GLOBALS['API_HOST'], $business_path);
}

/**
 * Queries the API by the input values from the user 
 * 
 * @param    $term        The search term to query
 * @param    $location    The location of the business to query
 */
function query_api($b_lat, $b_lon, $b_location, $b_limit, $b_offset, $b_term) {
    //print search($term, $location);

    $response = json_decode(search($b_lat, $b_lon, $b_location, $b_limit, $b_offset, $b_term));

    //print_r($response->businesses);

    //print count($response->businesses);

    $bus_res = "";
    for($i = 0; $i <= 19; $i++){
        $bus = $response->businesses[$i];
        if($i != 0){$bus_res = $bus_res.",".get_business($bus->id);}else{$bus_res = get_business($bus->id);}

    }
    //print "[{'locations': ".$response."}, {'businesses': ".$bus_res."}]";

    $result = stripslashes(json_encode("[".$bus_res."]"));
    print substr($result ,1, strlen($result)-2);
    //print $bus_res;
    //print "['businesses: '".$bus_res."]";


    //$business_id = $response->businesses[0]->id;
    
    /*print sprintf(
        "%d businesses found, querying business info for the top result \"%s\"\n\n",         
        count($response->businesses),
        $business_id
    );*/
    
    //$response = get_business($business_id);
    
    //print sprintf("Result for business \"%s\" found:\n", $business_id);
    //print "$response\n";
}

/**
 * User input is handled here 
 */
/*$longopts  = array(
    "term::",
    "location::",
);
    
$options = getopt("", $longopts);

$term = $options['term'] ?: '';
$location = $options['location'] ?: '';*/


$b_lat = $_GET["lat"];
$b_lon = $_GET["lon"];
$b_location = $_GET["location"];
$b_limit = $_GET["limit"];
$b_offset = $_GET["offset"];
$b_term = $_GET["term"];


header('Content-Type: application/json');
query_api($b_lat, $b_lon, $b_location, $b_limit, $b_offset, $b_term);

?>
