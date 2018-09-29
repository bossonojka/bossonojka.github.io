<?php
    $upload_dir = "uploads/";
    $files_json = "files.json";

    if (isset($_FILES['userfile'])){
        $file_name = fix_string($_FILES['userfile']['name']);
        $file_size = fix_string($_FILES['userfile']['size']);
        $file_type = fix_string($_FILES['userfile']['type']);
        $upload_file = $upload_dir . $file_name;
        if (move_uploaded_file($_FILES['userfile']['tmp_name'], $upload_file)){
            if (!file_exists($files_json)){
                $arr = array();
                $arr[] = array("name" => $file_name, "size" => $file_size, "type" => $file_type);
                $obj = array("files" => $arr);
                file_put_contents($files_json, json_encode($obj));
            } else {
                $json = file_get_contents($files_json);
                $json_decoded = json_decode($json, TRUE);
                if (count($json_decoded['files'])){
                    for ($i = 0; $i < count($json_decoded['files']); $i++){
                        if ($json_decoded['files'][$i]['name'] == $file_name){
                            $json_decoded['files'][$i] = array("name" => $file_name, "size" => $file_size, "type" => $file_type);
                            break;
                        } else if ($i == count($json_decoded['files']) - 1){
                            $json_decoded['files'][] = array("name" => $file_name, "size" => $file_size, "type" => $file_type);
                        }
                    }
                } else {
                    $json_decoded['files'][] = array("name" => $file_name, "size" => $file_size, "type" => $file_type);
                }
                file_put_contents($files_json, json_encode($json_decoded));
            }
            echo "File is valid, and was successfully uploaded.";
        }
    }

    if (isset($_POST['fordeleting'])){
        $file_name = fix_string($_POST['fordeleting']);
        $deleting_file = $upload_dir . $file_name;
        unlink(fix_string($deleting_file));
        
        $json = file_get_contents($files_json);
        $json_decoded = json_decode($json, TRUE);

        $temp = array();
        
        for ($i = 0; $i < count($json_decoded['files']); $i++){
            if ($json_decoded['files'][$i]['name'] != $file_name){
                $temp[] = array("name" => $json_decoded['files'][$i]['name'], "size" => $json_decoded['files'][$i]['size'], "type" => $json_decoded['files'][$i]['type']);
            } else {
                continue;
            }
        }

        $obj = array("files" => $temp);
        file_put_contents($files_json, json_encode($obj));
    }

    /*if (isset($_GET['load'])){
        $file_names = scandir($upload_dir);
        $temp;
        for ($i = 2; $i < count($file_names); $i++){
            $temp[] = $file_names[$i];
        }
        echo json_encode($temp);
    }*/

    if (isset($_GET['load'])){
        $count = fix_string($_GET['load']);
        if (file_exists($files_json)){
            $json = file_get_contents($files_json);
            $json_decoded = json_decode($json, TRUE);
            $temp = array();
            for ($i = 0; $i < count($json_decoded['files']); $i++){
                $name = $json_decoded['files'][$i]['name'];
                $size = $json_decoded['files'][$i]['size'];
                $type = $json_decoded['files'][$i]['type'];
                $temp[$i] = array("name" => $name, "size" => $size, "type" => $type, "dir" => $upload_dir);     
            }
            echo json_encode($temp);
        }
    }

    function fix_string($val){
        $val = strip_tags($val);
        $val = htmlentities($val);
        return stripslashes($val);
    }
?>