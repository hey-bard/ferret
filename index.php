<!DOCTYPE html>
<html>
<head>
	<title>Ferret</title>
	<link rel="stylesheet" href="ferret/styles.css">
	<script src="ferret/script.js"></script>
</head>
<body>
<style>
#ferret{
	position:fixed;
	left:0;
	right:0;
	top:0;
	bottom:0;
	background-color:yellow;
}
</style>

<div id="ferret"></div>

<script>
var localFerret=new Ferret({
	window:document.getElementById('ferret')
	,buttons:<?php
		#Make a bunch of buttons for the sake of testing
		$buttons=[];
		
		for($i=0;$i<30;$i++){
			$buttons[$i]=[
				'content'=>'Test '.$i
				,'classes'=>null
				,'css'=>null
				,'tags'=>$i
				,'element'=>null
				,'action'=>'https://heybard.com/'.$i
			];
		}
	
		echo json_encode($buttons);
	?>
	,fps:10
});
</script>

</body>
</html>