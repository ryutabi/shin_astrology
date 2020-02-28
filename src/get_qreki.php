<?
include "qreki.php";
$params = json_decode(file_get_contents('php://input'), true);

$year = $params["year"];
$month = $params["month"];
$day = $params["day"];

$result = calc_kyureki($year, $month, $day);
$isLeap = $result[1] === 1 ? true : false;

$qreki = array(
  "old_year" => (string)$result[0],
  "old_month" => (string)$result[2],
  "old_day" => (string)$result[3],
  "isLeap" => $isLeap
);

echo json_encode($qreki);
