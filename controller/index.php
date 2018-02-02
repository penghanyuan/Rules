<?php
session_start();
header("Content-Type:text/html;charset=utf-8");
function dispatch(){
	$func = $_POST['func'];
	if($func == "login")
	{	
		$username = $_POST['username'];
		$psw = $_POST['password'];
		logIn($username,$psw);
	}
	if($func == "loadrules")
	{	
		$flow = $_POST['flow'];
		loadrules($flow);
	}
	if($func == "sessiontest")
	{	
		sessiontest();
	}
	if($func == "sessionclean")
	{	
		session_unset("uid");
		session_unset("uname");
	}
	if($func == "addrules")
	{	
		$flow = $_POST['flow'];
		$rule = $_POST['rule'];
		addRules($flow,$rule);
	}
	if($func == "searchrules")
	{		
		$key = $_POST['key'];
		searchRules($key);
	}
	if($func == "deleterules")
	{	
		
		$rule = $_POST['id'];
		deleteRule($rule);
	}
	if($func == "checkrules")
	{	
		checkRule(0);
	}
	if($func == "refuserules")
	{	
		checkRule(-1);
	}
	if($func == "changestatus")
	{	
		$id = $_POST['id'];
		$status = $_POST['status'];
		changeStatus($id,$status);
	}
}

function sessiontest(){
	if($_SESSION==null)
		echo json_encode(array('status' => false ));
	else
	echo json_encode(array('uid' => $_SESSION['uid'],'uname'=>$_SESSION['uname'] ));
}
function connect(){

	$con = mysql_connect("localhost","root","phy8955743");
	//mysql_query("set names 'utf8'");
	if (!$con)
	{
 	 die('Could not connect: ' . mysql_error());
	}
	return $con;
}
function deleteRule($ruleid){
	$con = connect();
	mysql_select_db("flowscontrol", $con);
	$return = [];
	$result = mysql_query("DELETE FROM rules WHERE rule_id=".$ruleid);
	
	echo json_encode($result);
}
function logIn($username,$password){
	$con = connect();
	mysql_select_db("flowscontrol", $con);
	//$return = [];
	$result = mysql_query("SELECT * FROM users WHERE user_name='".$username."';");
	while($row = mysql_fetch_array($result)){
		header("Content-Type:application/json;charset=utf-8");
		// array_push($return,$row);
		if($row["user_psw"]==$password){
			$_SESSION['uid']=$row["user_id"];
			$_SESSION['uname']=$row["user_name"];
			echo json_encode(array("status"=>true));
		}
		else {
			echo json_encode(array("status"=>false));
		}

	}
	

}
function loadrules($flow){
	$con = connect();
	mysql_select_db("flowscontrol", $con);
	$return = [];
	$result = mysql_query("SELECT * FROM rules WHERE rule_status = 1 and flow_id=".$flow.";");
	while($row = mysql_fetch_array($result)){
		header("Content-Type:application/json;charset=utf-8");
		array_push($return,$row);
	}
	echo json_encode($return);

}
function addRules($flow,$rule){
	$con = connect();
	mysql_select_db("flowscontrol", $con);
	$sql = "INSERT into rules (flow_id,rule_content,rule_date,rule_status) VALUES('".$flow."','".$rule."','".date("Y-m-d H:i:s")."',0)";
	mysql_query($sql);
	echo json_encode(array('status' => true ));
}
function searchRules($key){
	$con = connect();
	mysql_select_db("flowscontrol", $con);
	$return = [];
	$result = mysql_query("SELECT * FROM rules WHERE rule_status = 1 and rule_content like '%".$key."%' ORDER BY flow_id;");
	while($row = mysql_fetch_array($result)){
		header("Content-Type:application/json;charset=utf-8");
		array_push($return,$row);
	}
	echo json_encode($return);

}
function checkRule($status){
	$con = connect();
	mysql_select_db("flowscontrol", $con);
	$return = [];
	$result = mysql_query("SELECT * FROM rules WHERE rule_status = ".$status."  ORDER BY flow_id;");
	while($row = mysql_fetch_array($result)){
		header("Content-Type:application/json;charset=utf-8");
		array_push($return,$row);
	}
	echo json_encode($return);

}

function changeStatus($id,$status){
	$con = connect();
	mysql_select_db("flowscontrol", $con);
	$sql = "UPDATE rules SET rule_status = '".$status."' WHERE rule_id=".$id ;	
	echo json_encode(mysql_query($sql));
}
dispatch();

?>