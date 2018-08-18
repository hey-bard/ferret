'use strict';

function Ferret(input={}){

///////////////////////////////////////
///////////PUBLIC VARIABLES////////////
///////////////////////////////////////

const F=this;

F.window=input.window;
F.query=input.query || null;
F.buttons=input.buttons || [];

///////////////////////////////////////
///////////PUBLIC FUNCTIONS////////////
///////////////////////////////////////

///////////////////////////////////////
///////////PRIVATE VARIABLES///////////
///////////////////////////////////////

var shuffling=false;
var target=null;

var frameGap=Math.floor(1000/(input.fps || 10));
var interval=window.setInterval(checkInterval,frameGap);

//Adjust way buttons respond on each mousemove
var maxSpeed=100000000/(1000-frameGap); //If the user sweeps from one corner of the screen to the other
var minSpeed=7500/(1000-frameGap);

//How small a button can get when in the back
var minSize=input.minSize || .4;

var inputData={
	x:null
	,y:null
	,prevX:null
	,prevY:null
};

//Crate
var crate=document.createElement('div');
crate.className='ferret-crate';
F.window.appendChild(crate);
var crateSize=crate.getBoundingClientRect();
var crateSize=crate.getBoundingClientRect();

//Input
var search=document.createElement('input');
search.className='ferret-search';
search.style.zIndex=F.buttons.length;
search.placeholder='Search';

///////////////////////////////////////
///////////PRIVATE FUNCTIONS///////////
///////////////////////////////////////

//This interval checks mouse movements while scrubbing
function checkInterval(){
	//If not shuffling
	if(shuffling!==true) return;
	
	//Don't do anything if we haven't set a previous x and y yet
	if(inputData.prevX===null){
		inputData.prevX=inputData.x;
		inputData.prevY=inputData.y;
		return;
	}
	
	//If the cursor's position hasn't changed
	if(inputData.x===inputData.prevX && inputData.y===inputData.prevY) return;
	
	var distance=Math.abs(((inputData.x-inputData.prevX)^2+(inputData.y-inputData.prevY)^2)^-1);
	var radians=Math.atan2(inputData.y-inputData.prevY,inputData.x-inputData.prevX);
	
	var crateSize=crate.getBoundingClientRect();
	var crateCornerDistance=Math.pow(crateSize.width-0,2)+Math.pow(crateSize.height-0,2);
	
	for(let i=0;i<F.buttons.length;i++){
		//Skip over the target
		if(target && F.buttons[i].element===target) continue;
		
		///////Y OUTSIDE////////
		
		var x=parseFloat(F.buttons[i].element.style.left);
		var y=parseFloat(F.buttons[i].element.style.top);
		
		//Rotated Y is based around origin of the button
		var relXA=inputData.x-x;
		var relYA=inputData.y-y;
		var relXB=inputData.prevX-x;
		var relYB=inputData.prevY-y;
		
		//Button radius
		var radius=F.buttons[i].element.getBoundingClientRect().width/2;
		
		//https://academo.org/demos/rotation-about-point/
		//var rotatedY=relY*(Math.cos(radians))+relX*(Math.sin(radians));
		var rotatedYA=(-relYA*(Math.cos(radians)))+(relXA*(Math.sin(radians)));
		var rotatedXA=(relXA*(Math.cos(radians)))-(-relYA*(Math.sin(radians)));
		var rotatedXB=(relXB*(Math.cos(radians)))-(-relYB*(Math.sin(radians)));
		
		if(
			Math.abs(rotatedYA)<=radius
			&& !(
				(rotatedXA>radius && rotatedXB>radius)
				||
				(rotatedXA<-radius && rotatedXB<-radius)
			)
		){
			
			//Distance from the center
			var fromLeft=(((inputData.prevX-(x+radius)))/radius)+1;
			var fromTop=(((inputData.prevY-(y+radius)))/radius)+1;
			var zIndex=parseInt(F.buttons[i].element.style.zIndex);
			
			var speed=(
					(maxSpeed-minSpeed)
					*(zIndex/(F.buttons.length))
				)
				*(distance/crateCornerDistance)
				+minSpeed
			;
			
			//Distance modifier
			
			var newLeft=(x-(fromLeft*speed));
			var newTop=(y-(fromTop*speed));
			
			//Don't let go outside of boundaries
			if(newLeft<radius) newLeft=radius;
			if(newLeft>crateSize.width-radius) newLeft=crateSize.width-radius;
			
			if(newTop<radius) newTop=radius;
			if(newTop>crateSize.height-radius) newTop=crateSize.height-radius;
			
			F.buttons[i].element.style.left=newLeft+'px';
			F.buttons[i].element.style.top=newTop+'px';
		}
	}
	
	//The last considered mouse x and y are the current now
	inputData.prevX=inputData.x;
	inputData.prevY=inputData.y;
};

function inputStart(){
	inputData.prevX=inputData.x;
	inputData.prevY=inputData.y;
	shuffling='process';
}

function inputMove(event){
	var clientX, clientY;
	
	//Adjust movement based on touches
	if(event.touches){
		clientX=event.changedTouches[0].clientX;
		clientY=event.changedTouches[0].clientY;
	}else{
		clientX=event.clientX;
		clientY=event.clientY;
	}
	
	if(shuffling===false) return;
	
	var crateSize=crate.getBoundingClientRect();
	var crateCornerDistance=Math.pow(crateSize.width-0,2)+Math.pow(crateSize.height-0,2);
	
	inputData.x=clientX-crateSize.left;
	inputData.y=clientY-crateSize.top;
	
	//Don't read this if we aren't shuffling
	if(shuffling==='process'){
		//If we didn't move much
		if(Math.pow(clientX-crateSize.left-inputData.prevX,2)+Math.pow(clientY-crateSize.top-inputData.prevY,2)<crateCornerDistance/1000) return;
		
		//Otherwise, continue
		shuffling=true;
		
		if(target!==null) target.classList.add('ferret-item-target');
	}
	
	
	//Move the held button
	if(target!==null){
		target.style.left=clientX-crateSize.left+'px';
		target.style.top=clientY-crateSize.top+'px';;
	}
}

function inputEnd(){
	shuffling=false;
	inputData.prevX=null;
	inputData.prevY=null;
	inputData.x=null;
	inputData.y=null;
	
	if(target!==null){
		bringWithinBounds(target);
		target.classList.remove('ferret-item-target');
		target=null;
	}
}

//Button functions
function buttonInput(event){
	if(this.classList.contains('ferret-item-target')) event.preventDefault();
}

function preventDrag(event){
	event.preventDefault();
}

function buttonInputStart(){
	target=this;
	
	//Move this element to the top, and all the others down a step
	var initialZ=this.style.zIndex;
	this.style.zIndex=F.buttons.length-1;
	this.style.transform='translate(-50%,-50%) scale(1)';
	
	document.querySelectorAll('.ferret-item').forEach(function(element){
		//Don't do it for this button!
		if(
			element!==target
			&& parseInt(element.style.zIndex)>parseInt(initialZ)
		){
			element.style.zIndex--;
			
			var scale=(((parseInt(element.style.zIndex)-1)/(F.buttons.length-1))*(1-minSize))+minSize;

			element.style.transform='translate(-50%,-50%) scale('+scale+')';
		}
		
	});
}

//Bring a button back within the boundaries of the crate
function bringWithinBounds(element){
	var newLeft=parseInt(element.style.left);
	var newTop=parseInt(element.style.top);
	var radius=element.getBoundingClientRect().width/2;
	var crateSize=crate.getBoundingClientRect();
	
	//Don't let go outside of boundaries
	if(newLeft<radius) newLeft=radius;
	if(newLeft>crateSize.width-radius) newLeft=crateSize.width-radius;
	
	if(newTop<radius) newTop=radius;
	if(newTop>crateSize.height-radius) newTop=crateSize.height-radius;
	
	element.style.left=newLeft+'px';
	element.style.top=newTop+'px';
}

///////////////////////////////////////
////////////EVENT LISTENERS////////////
///////////////////////////////////////

search.addEventListener('input',function(e){
	//Hide buttons that don't match
	for(let i=0;i<F.buttons.length;i++){
		var regex=new RegExp('(^|,)'+this.value,'i');
		
		if(regex.test(F.buttons[i].content) || regex.test(F.buttons[i].tags)){
			F.buttons[i].element.classList.remove('ferret-item-hide');
		}else{
			F.buttons[i].element.classList.add('ferret-item-hide');
		}
	}
});

crate.addEventListener('mousedown',inputStart);
crate.addEventListener('touchstart',inputStart);
crate.addEventListener('touchmove',function(){event.preventDefault();},{passive:false}); //We can't have scrolling on the crate

window.addEventListener('mousemove',inputMove);
window.addEventListener('touchmove',inputMove,{passive:false}); //This answer explains passive:false https://stackoverflow.com/questions/49500339/cant-prevent-touchmove-from-scrolling-window-on-ios

window.addEventListener('mouseup',inputEnd);
window.addEventListener('touchend',inputEnd);

///////////////////////////////////////
/////////////////START/////////////////
///////////////////////////////////////

F.window.appendChild(search);

//Randomize the z-index array
//With help from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
var zIndexes=[];
for(var i=0;i<F.buttons.length;i++){
	zIndexes[i]=i;
}

var currentIndex=zIndexes.length;

// While there remain elements to shuffle...
while(0!==currentIndex){
	// Pick a remaining element...
	var randomIndex=Math.floor(Math.random()*currentIndex);
	currentIndex-=1;

	// And swap it with the current element.
	[zIndexes[currentIndex],zIndexes[randomIndex]]=[zIndexes[randomIndex],zIndexes[currentIndex]];
}

//Create buttons
for(var i=0;i<F.buttons.length;i++){
	let button=document.createElement('a');
	button.className='ferret-item';
	button.draggable=false;
	
	button.style.zIndex=zIndexes[i];
	
	var scale=(((parseInt(button.style.zIndex)-1)/(F.buttons.length-1))*(1-minSize))+minSize;
	button.style.transform='translate(-50%,-50%) scale('+scale+')';
	
	button.addEventListener('mousedown',buttonInputStart);
	button.addEventListener('touchstart',buttonInputStart);
	button.addEventListener('click',buttonInput);
	button.addEventListener('dragstart',preventDrag);
	
	crate.appendChild(button);
	
	//Recalculate button position based on pixels
	let buttonCalc=button.getBoundingClientRect();
	button.style.left=Math.round(buttonCalc.width/2+(crateSize.width-buttonCalc.width)*Math.random())+'px';
	button.style.top=Math.round(buttonCalc.height/2+(crateSize.height-buttonCalc.height)*Math.random())+'px';
	/*button.style.left=(buttonCalc.left-crateSize.left+buttonCalc.width/2)+'px';
	button.style.top=(buttonCalc.top-crateSize.top+buttonCalc.width/2)+'px';*/
	
	//Add values passed through
	button.innerHTML=F.buttons[i].content;
	button.href=F.buttons[i].action;
	if(F.buttons[i].classes) button.className+=' '+F.buttons[i].classes;
	if(F.buttons[i].css) button.style.cssText+=F.buttons[i].css;
	
	//Save button element in object
	F.buttons[i].element=button;
}

//If querystring is enabled, add functions for it and get it from the URL
if(F.query){
	var queryRegExp=new RegExp('([?|&]'+F.query+'=)([^&$]*)','i');
	
	getQuery();
	search.addEventListener('change',updateQuery);

	function updateQuery(){
		var newLocation;
		
		//Replace the querystring or add it in, depending on needs
		if(queryRegExp.test(location.href)){
			if(search.value==='') newLocation=location.href.replace(queryRegExp,'');
			else newLocation=location.href.replace(queryRegExp,'$1'+search.value);
		}else{
			newLocation=location.href+(/\?/.test(location.href) ? '&' : '?')+F.query+'='+search.value;
		}
		
		//Get query
		history.pushState(
			{}
			,''
			,newLocation
		);
	}
	
	function getQuery(){
		var get=queryRegExp.exec(location.href);
		if(get && get[2]) search.value=decodeURIComponent(get[2]);
		else search.value='';
		
		search.dispatchEvent(new Event('input'));
	}
	
	window.addEventListener('popstate',getQuery);
}

}