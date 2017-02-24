<?php
header("Access-Control-Allow-Origin: *");
$action=$_POST['action'];
if($action == 'getEmpDetails')
{
	$connect_mysql = connectToDb('techaspecthrm_mysql');
    $sql = "select * from hs_hr_employee where employee_id = '".$_POST['empId']."' and termination_id is null";
    $rsd = mysqli_query($connect_mysql,$sql);
    while($res = mysqli_fetch_assoc($rsd)) {
		echo json_encode($res);
	}
}
   
	
function connectToDb($db){
    
    /* HRMS Database Configuration */
	$hostnameHrms = "localhost";
	$usernameHrms ="root";
	$passwordHrms ="";
	$databaseHrms ="techaspecthrm_mysql";

	/* External Database Configuration for pulling data related to the Attendance */
	$hostnameExternal = "";
	$usernameExternal = "";
	$passwordExternal = "";
	$databaseExternal = "";

   $connect =  mysqli_connect($hostnameHrms, $usernameHrms, $passwordHrms, $db);
   return $connect;
}	
?>