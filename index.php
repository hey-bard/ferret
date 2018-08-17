<!DOCTYPE html>
<html>
<head>
	<title>Ferret Demo</title>
	<meta name="description" content="A fun way to find something new!">
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	
	<link rel="stylesheet" href="styles.css">
	
	<!--Favicons-->
	<link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png">
	<link rel="manifest" href="/favicons/manifest.json">
	<link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#5bbad5">
	<link rel="shortcut icon" href="/favicons/favicon.ico">
	<meta name="msapplication-config" content="/favicons/browserconfig.xml">
	<meta name="theme-color" content="#ffffff">
</head>
<body>
<header>
	<nav>
		<span><img class="svg-inline" src="design-files/logo.svg"></span>
		<a href="https://github.com/joshpowlison/ferret"><p>Github</p></a>
		<a href="https://github.com/joshpowlison/ferret/tree/develop"><p>Dev Branch</p></a>
	</nav>
</header>
<main>

<script src="ferret/script.js"></script>
<link rel="stylesheet" href="ferret/styles.css">

<h1><img class="svg-inline" src="design-files/logo.svg"> Ferret</h1>

<p id="intro">A fun way to find something new!</p>

<div id="ferret"></div>

<script>
var localFerret=new Ferret({
	window:document.getElementById('ferret')
	,buttons:<?php
		#Make a bunch of buttons for the sake of testing
		$buttons=[];
		
		for($i=0;$i<20;$i++){
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

<h2>Install in 5 minutes!</h2>

<p><a href="https://github.com/joshpowlison/ferret/releases" target="_blank">Download</a> and put the <em>ferret</em> folder on your website. Use this HTML:</p>

<pre>
&lt;script src="ferret/script.js"&gt;&lt;/script&gt;
&lt;script&gt;new Ferret;&lt;/script&gt;
</pre>

<p>To customize your Ferret, look at the code below!</p>

<pre>
&lt;script&gt;
new Ferret({
<span id="code"></span>
});
&lt;/script&gt;

<p id="propertyExplanation"></p></pre>

<!--<h2>Used by:</h3>
<div id="websites-using"><a href="http://gameplanmanga.com" target="_blank"><img src="images/gameplan-banner.jpg"></a></div>
<p><small>Email me at <a href="mailto:joshuapowlison@gmail.com" target="_blank">joshuapowlison@gmail.com</a> if you want to be included in the list! I will not include NSFW stories.</small></p>-->

<script src="script.js"></script>

</main>
<footer><p>Ferret is Open Source under an MIT License. Version in Demo: DEV BRANCH</p></footer>
</body>
</html>