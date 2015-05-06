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
$id = $_GET["id"];
$lat = $_GET["lat"];
$lon = $_GET["lon"];
$zoom = $_GET["zoom"];
$logo = $_GET["logo"];
$reslimit = $_GET["reslimit"];
$term = $_GET["term"];


$sql = "UPDATE fixed SET `lat`='".$lat."',`lon`='".$lon."', `zoom`=".$zoom.", `logo`='".$logo."', `reslimit`=".$reslimit.", `term`='".$term."' WHERE id=".$id;
//echo $sql;

if ($conn->query($sql) === TRUE) {
    echo 1;
} else {
    echo 0 . $conn->error;
}

$conn->close();
?>