'use strict';

function Ferret(input={}){
	const F=this;
	
	F.window=input.window;
	F.buttons=input.buttons;
	
	var shuffling=false;
	var target=null;
	
	var frameGap=Math.floor(1000/(input.fps || 10));
	var interval=window.setInterval(checkInterval,frameGap);
	
	//Adjust way buttons respond on each mousemove
	var maxSpeed=100000000/(1000-frameGap); //If the user sweeps from one corner of the screen to the other
	var minSpeed=7500/(1000-frameGap);
	
	//How small a button can get when in the back
	var minSize=.4;
	
	var mouseData={
		x:null
		,y:null
		,prevX:null
		,prevY:null
	};
	
	window.addEventListener('resize',function(){
		windowSize=F.window.getBoundingClientRect();
	});
	
	var windowSize=F.window.getBoundingClientRect();
	
	//Crate
	var crate=document.createElement('div');
	crate.className='ferret-crate';
	F.window.appendChild(crate);
	var crateSize=crate.getBoundingClientRect();
	
	function checkInterval(){
		//If not shuffling
		if(shuffling!==true) return;
		
		//Don't do anything if we haven't set a previous x and y yet
		if(mouseData.prevX===null){
			mouseData.prevX=mouseData.x;
			mouseData.prevY=mouseData.y;
			return;
		}
		
		console.log(mouseData);
		
		//If the cursor's position hasn't changed
		if(mouseData.x===mouseData.prevX && mouseData.y===mouseData.prevY) return;
		
		var distance=Math.abs(((mouseData.x-mouseData.prevX)^2+(mouseData.y-mouseData.prevY)^2)^-1);
		var radians=Math.atan2(mouseData.y-mouseData.prevY,mouseData.x-mouseData.prevX);
		
		var crateSize=crate.getBoundingClientRect();
		var crateCornerDistance=Math.pow(crateSize.width-0,2)+Math.pow(crateSize.height-0,2);
		
		for(let i=0;i<F.buttons.length;i++){
			///////Y OUTSIDE////////
			
			var x=parseFloat(F.buttons[i].element.style.left);
			var y=parseFloat(F.buttons[i].element.style.top);
			
			//Rotated Y is based around origin of the button
			var relXA=mouseData.x-x;
			var relYA=mouseData.y-y;
			var relXB=mouseData.prevX-x;
			var relYB=mouseData.prevY-y;
			
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
				var fromLeft=(((mouseData.prevX-(x+radius)))/radius)+1;
				var fromTop=(((mouseData.prevY-(y+radius)))/radius)+1;
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
		mouseData.prevX=mouseData.x;
		mouseData.prevY=mouseData.y;
	};
	
	crate.addEventListener('mousemove',function(event){
		var crateSize=crate.getBoundingClientRect();
		
		mouseData.x=event.clientX-crateSize.left;
		mouseData.y=event.clientY-crateSize.top;
	});
	
	//Event listeners
	crate.addEventListener('mousedown',function(event){
		mouseData.prevX=mouseData.x;
		mouseData.prevY=mouseData.y;
		shuffling='process';
	});
	
	//These apply to the WHOLE window
	window.addEventListener('mouseup',function(event){
		shuffling=false;
		mouseData.prevX=null;
		mouseData.prevY=null;
		
		if(target!==null){
			target.classList.remove('ferret-item-target');
			target=null;
		}
	});
	
	window.addEventListener('mousemove',function(event){
		if(shuffling===false) return;
		
		console.log(shuffling);
		
		var crateSize=crate.getBoundingClientRect();
		var crateCornerDistance=Math.pow(crateSize.width-0,2)+Math.pow(crateSize.height-0,2);
		
		//Don't read this if we aren't shuffling
		if(shuffling==='process'){
			//If we didn't move much
			if(Math.pow(event.clientX-crateSize.left-mouseData.prevX,2)+Math.pow(event.clientY-crateSize.top-mouseData.prevY,2)<crateCornerDistance/1000) return;
			
			console.log(Math.pow(event.clientX-crateSize.left-mouseData.prevX,2)+Math.pow(event.clientY-crateSize.top-mouseData.prevY,2));
			
			//Otherwise, continue
			shuffling=true;
			
			if(target!==null) target.classList.add('ferret-item-target');
		}
		
		
		//Move the held button
		if(target!==null){
			target.style.left=event.clientX-crateSize.left+'px';
			target.style.top=event.clientY-crateSize.top+'px';;
		}
	});
	
	//Input
	var search=document.createElement('input');
	search.className='ferret-search';
	search.style.zIndex=F.buttons.length;
	search.placeholder='Search';
	
	search.addEventListener('input',function(e){
		//Hide buttons that don't match
		for(let i=0;i<F.buttons.length;i++){
			if(new RegExp('(^|,)'+this.value,'i').test(F.buttons[i].tags)){
				F.buttons[i].element.classList.remove('ferret-item-hide');
			}else{
				F.buttons[i].element.classList.add('ferret-item-hide');
			}
		}
	});
	
	F.window.appendChild(search);
	
	//Create buttons
	for(var i=0;i<F.buttons.length;i++){
		let button=document.createElement('a');
		button.className='ferret-item';
		
		//Set button position based on percent
		button.style.left=Math.random()*100+'%';
		button.style.top=Math.random()*100+'%';
		
		button.style.zIndex=i;
		var scale=(i/(F.buttons.length-1)*(1-minSize))+minSize;
		button.style.transform='translate(-50%,-50%) scale('+scale+')';
		
		button.addEventListener('mousedown',buttonMouseDown);
		button.addEventListener('click',buttonClick);
		
		crate.appendChild(button);
		
		//Recalculate button position based on pixels
		let buttonCalc=button.getBoundingClientRect();
		button.style.left=(buttonCalc.left-crateSize.left+buttonCalc.width/2)+'px';
		button.style.top=(buttonCalc.top-crateSize.top+buttonCalc.width/2)+'px';
		
		//Add values passed through
		button.innerHTML=F.buttons[i].content;
		button.href=F.buttons[i].action;
		if(F.buttons[i].classes) button.className+=' '+F.buttons[i].classes;
		if(F.buttons[i].css) button.style.cssText+=F.buttons[i].css;
		
		//Save button element in object
		F.buttons[i].element=button;
	}
	
	//Button functions
	function buttonClick(event){
		if(this.classList.contains('ferret-item-target')) event.preventDefault();
	}
	
	function buttonMouseDown(event){
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
}