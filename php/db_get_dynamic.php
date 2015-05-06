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
    print "fail";
}

$id = $_GET["id"];
$q = $_GET["q"];

$sql = "SELECT * FROM dynamic WHERE id = ".$id;
$result = $conn->query($sql);

if ($result->num_rows > 0) {

    // output data of each row
    $row = $result->fetch_assoc();
    //print_r($row);
    header('Content-Type: application/json');
    print '[{"id": '.$row["id"].', "categories": '.$row["categories"].', "selectedcategory": "'.$row["selectedcategory"].'", "businesses": '.$row["businesses"].', "selectedbusiness": "'.$row["selectedbusiness"].'"}]';
    //print $row[0];
    /*while($row = $result->fetch_assoc()) {
        echo "id: " . $row["id"]. " - Name: " . $row["firstname"]. " " . $row["lastname"]. "<br>";
    }*/
} else {
    print "null";
}
$conn->close();
?>