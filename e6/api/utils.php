<?php
	function get_query($field, $default) {
		if (isset($_GET[$field])) {
			return $_GET[$field];
		} else {
			return $default;
		}
	}
	
	function json_filter_array(&$json_array, $keys, $whitelist) {
		foreach ($json_array as $json_object)
			$json_object = json_filter_object($json_object, $keys, $whitelist);
	}
	
	function json_filter_object($json_object, $keys, $whitelist) {
		if ($whitelist) {
			foreach ($json_object as $json_key => $json_value) {
				if (!in_array($json_key, $keys))
					unset($json_object->$json_key);
			}
		} else {
			foreach ($keys as $key) 
				unset($json_object->$key);
		}
	}
	
	function get_json_response($relpath) {
		return json_decode(file_get_contents("http://www.e621.net/".$relpath), true);
	}
?>