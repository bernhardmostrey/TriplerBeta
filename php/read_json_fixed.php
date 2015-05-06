<?php
/**
 * Created by PhpStorm.
 * User: bernhardmostrey
 * Date: 5/05/15
 * Time: 15:08
 */
header('Content-Type: application/json');
$json = file_get_contents('../fixed.json');
print $json;

?>