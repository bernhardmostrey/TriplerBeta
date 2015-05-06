<?php
/**
 * Created by PhpStorm.
 * User: bernhardmostrey
 * Date: 29/04/15
 * Time: 16:28
 */
$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "tripler";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
    echo 0 . $conn->connect_error;
}
//id, locatie, zoom, logo, limit, term
$params = json_decode(file_get_contents('php://input'),true);
$id = $params["id"];
$categories = $params["categories"];
$selectedcategory = $params["selectedcategory"];
$businesses = $params["businesses"];
$selectedbusiness = $params["selectedbusiness"];
echo $categories;


$sql = "UPDATE dynamic SET `categories`='".$categories."',`selectedcategory`='".$selectedcategory."', `businesses`=''".$businesses."'', `selectedbusiness`='".$selectedbusiness."' WHERE id=".$id;
//echo $sql;

if ($conn->query($sql) === TRUE) {
    echo 1;
} else {
    echo 0 . $conn->error;
}

$conn->close();
?>