<?php
	header("Content-Type: application/json; charset=utf-8");

	include("utils.php");
	
	define("QUERY_TAGS", "tags");
	define("QUERY_PAGE", "page");
	
	$tags = get_query(QUERY_TAGS, "");
	$page = get_query(QUERY_PAGE, 1);
	$limit = 50;
	
	$tag_whitelist = [
		"score", "preview_url", "sample_url", "file_ext", "id", "rating"
	];
	
	$json = get_json_response("/post/index.json?tags=$tags&page=$page&limit=$limit");
	
	$response = array();
	
	foreach ($json as $entry) {
		$sEntry = array();
		
		$sEntry["id"] = $entry["id"];
		$sEntry["rating"] = $entry["rating"];
		$sEntry["score"] = $entry["score"];
		$sEntry["preview"] = ($entry["file_ext"] == "jpg" || $entry["file_ext"] == "png") ? $entry["sample_url"] : $entry["preview_url"];
		$sEntry["artist"] = $entry["artist"];
		$sEntry["url"] = $entry["file_url"];
		
		$response[] = $sEntry;
	}
	
	echo json_encode($response);
?>