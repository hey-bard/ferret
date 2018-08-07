function Ferret(input={}){
	const F=this;
	
	F.window=input.window;
	F.buttons=input.buttons;
	
	var shuffling=false;
	var target=null;
	
	//Event listeners
	F.window.addEventListener('mousedown',function(event){
		shuffling=true;
	});
	
	F.window.addEventListener('mouseup',function(event){
		shuffling=false;
		
		if(target!==null){
			target.classList.remove('ferret-item-target');
			target=null;
		}
	});
	
	F.window.addEventListener('mousemove',function(event){
		//Move the held button
		if(target!==null){
			target.style.left=event.clientX+'px';
			target.style.top=event.clientY+'px';;
		}
	});
	
	F.window.addEventListener('mousedown',function(event){
		shuffling=true;
	});
	
	//Input
	var search=document.createElement('input');
	search.className='ferret-search';
	search.style.zIndex=F.buttons.length;
	search.placeholder='Search';
	
	search.addEventListener('input',function(e){
		console.log(this.value);
		
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
		let button=document.createElement('div');
		button.className='ferret-item';
		
		//button.style.transform='translate('+Math.random()*100+'%,'+Math.random()*100+'%)';
		//Set button position
		button.style.left=Math.random()*100+'%';
		button.style.top=Math.random()*100+'%';
		button.style.zIndex=i;
		
		button.addEventListener('mousedown',function(event){
			target=this;
			this.classList.add('ferret-item-target');
			
			//Move this element to the top, and all the others down a step
			var initialZ=this.style.zIndex;
			this.style.zIndex=F.buttons.length-1;
			
			document.querySelectorAll('.ferret-item').forEach(function(element){
				console.log(element,element.style.zIndex,initialZ);
			
				//Don't do it for this button!
				if(
					element!==target
					&& parseInt(element.style.zIndex)>parseInt(initialZ)
				) element.style.zIndex--;
				
			});
		});
		
		button.addEventListener('mousemove',function(event){
			//We move held buttons in mousemove for the whole window
			if(!shuffling || target===this) return;
		
			//Positions are calculated by pixels
		
			//Element properties
			var calc=this.getBoundingClientRect();
			var radius=calc.width/2;
			var zIndex=parseInt(this.style.zIndex);
		
			//Pointer properties
			var windowSize=F.window.getBoundingClientRect();
			
			var leftPointer=event.clientX;
			var topPointer=event.clientY;
			
			//Adjust way buttons respond on each mousemove
			var maxSpeed=24;
			var minSpeed=15;
		
			//console.log(leftPointer,topPointer);
			
			//Distance from the center
			var fromLeft=((leftPointer-(calc.left+radius)))/radius;
			var fromTop=((topPointer-(calc.top+radius)))/radius;
			
			console.log(fromLeft,fromTop);
			
			//console.log(calc.left,leftPointer,calc.top,topPointer);
			
			var speed=((maxSpeed-minSpeed)*(zIndex/(F.buttons.length-1)))+minSpeed;
			
			var newLeft=(calc.left-(fromLeft*speed)+radius);
			var newTop=(calc.top-(fromTop*speed)+radius);
			
			//Don't let go outside of boundaries
			if(newLeft<radius) newLeft=radius;
			if(newLeft>windowSize.width-radius) newLeft=windowSize.width-radius;
			
			if(newTop<radius) newTop=radius;
			if(newTop>windowSize.height-radius) newTop=windowSize.height-radius;
			
			this.style.left=newLeft+'px';
			this.style.top=newTop+'px';
		});
		
		F.window.appendChild(button);
		let buttonCalc=button.getBoundingClientRect();
		button.style.left=(buttonCalc.left+buttonCalc.width/2)+'px';
		button.style.top=(buttonCalc.top+buttonCalc.width/2)+'px';
		
		//Add values passed through
		button.innerHTML=F.buttons[i].content;
		if(F.buttons[i].classes) button.className+=' '+F.buttons[i].classes;
		if(F.buttons[i].css) button.style.cssText+=F.buttons[i].css;
		
		//Save button element in object
		F.buttons[i].element=button;
	}
}