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
	
	var mouseData={
		x:null
		,y:null
		,prevX:null
		,prevY:null
	};
	
	window.addEventListener('resize',function(){
		windowSize=F.window.getBoundingClientRect();
		windowCornerDistance=Math.pow(windowSize.width-0,2)+Math.pow(windowSize.height-0,2);
	});
	
	var windowSize=F.window.getBoundingClientRect();
	var windowCornerDistance=Math.pow(windowSize.width-0,2)+Math.pow(windowSize.height-0,2);
	
	function checkInterval(){
		//If not shuffling
		if(shuffling!==true) return;
		
		//Don't do anything if we haven't set a previous x and y yet
		if(mouseData.prevX===null){
			mouseData.prevX=mouseData.x;
			mouseData.prevY=mouseData.y;
			return;
		}
		
		//If the cursor's position hasn't changed
		if(mouseData.x===mouseData.prevX && mouseData.y===mouseData.prevY) return;
		
		var distance=Math.abs(((mouseData.x-mouseData.prevX)^2+(mouseData.y-mouseData.prevY)^2)^-1);
		var radians=Math.atan2(mouseData.y-mouseData.prevY,mouseData.x-mouseData.prevX);
		
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
					*(distance/windowCornerDistance)
					+minSpeed
				;
				
				//Distance modifier
				
				var newLeft=(x-(fromLeft*speed));
				var newTop=(y-(fromTop*speed));
				
				//Don't let go outside of boundaries
				if(newLeft<radius) newLeft=radius;
				if(newLeft>windowSize.width-radius) newLeft=windowSize.width-radius;
				
				if(newTop<radius) newTop=radius;
				if(newTop>windowSize.height-radius) newTop=windowSize.height-radius;
				
				F.buttons[i].element.style.left=newLeft+'px';
				F.buttons[i].element.style.top=newTop+'px';
			}
		}
		
		//The last considered mouse x and y are the current now
		mouseData.prevX=mouseData.x;
		mouseData.prevY=mouseData.y;
	};
	
	F.window.addEventListener('mousemove',function(event){
		mouseData.x=event.clientX;
		mouseData.y=event.clientY;
	});
	
	//Event listeners
	F.window.addEventListener('mousedown',function(event){
		mouseData.prevX=mouseData.x;
		mouseData.prevY=mouseData.y;
		shuffling='process';
	});
	
	F.window.addEventListener('mouseup',function(event){
		shuffling=false;
		mouseData.prevX=null;
		mouseData.prevY=null;
		
		if(target!==null){
			target.classList.remove('ferret-item-target');
			target=null;
		}
	});
	
	F.window.addEventListener('mousemove',function(event){
		if(shuffling===false) return;
		
		console.log(shuffling);
		
		//Don't read this if we aren't shuffling
		if(shuffling==='process'){
			//If we didn't move much
			if(Math.pow(event.clientX-mouseData.prevX,2)+Math.pow(event.clientY-mouseData.prevY,2)<windowCornerDistance/1000) return;
			
			console.log(Math.pow(event.clientX-mouseData.prevX,2)+Math.pow(event.clientY-mouseData.prevY,2));
			
			//Otherwise, continue
			shuffling=true;
			
			if(target!==null) target.classList.add('ferret-item-target');
		}
		
		
		//Move the held button
		if(target!==null){
			target.style.left=event.clientX+'px';
			target.style.top=event.clientY+'px';;
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
		
		//Set button position
		button.style.left=Math.random()*100+'%';
		button.style.top=Math.random()*100+'%';
		button.style.zIndex=i;
		
		button.addEventListener('mousedown',buttonMouseDown);
		button.addEventListener('click',buttonClick);
		
		F.window.appendChild(button);
		let buttonCalc=button.getBoundingClientRect();
		button.style.left=(buttonCalc.left+buttonCalc.width/2)+'px';
		button.style.top=(buttonCalc.top+buttonCalc.width/2)+'px';
		
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
		
		document.querySelectorAll('.ferret-item').forEach(function(element){
			//Don't do it for this button!
			if(
				element!==target
				&& parseInt(element.style.zIndex)>parseInt(initialZ)
			) element.style.zIndex--;
			
		});
	}
}