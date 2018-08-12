function Ferret(input={}){
	const F=this;
	
	F.window=input.window;
	F.buttons=input.buttons;
	
	var shuffling=false;
	var target=null;
	
	//Adjust way buttons respond on each mousemove
	var maxSpeed=24;
	var minSpeed=1;
	
	var frameGap=100;
	var interval=window.setInterval(checkInterval,frameGap);
	
	var mouseData={
		x:null
		,y:null
		,prevX:null
		,prevY:null
	};
	
	//Testing
	if(true){
		var test=F.window.appendChild(document.createElement('div'));
		test.className='ferret-test';
	}
	
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
		
		//console.log(mouseData);
		var slope=(mouseData.y-mouseData.prevY)/(mouseData.x-mouseData.prevX);
		var distance=Math.abs(((mouseData.x-mouseData.prevX)^2+(mouseData.y-mouseData.prevY)^2)^-1);
		var radians=Math.atan2(mouseData.y-mouseData.prevY,mouseData.x-mouseData.prevX);
		var degrees=(radians*(180/Math.PI));
		
		/*
		if(test){
			test.style.width=Math.abs(distance)+'px';
			test.style.left=mouseData.x+'px';
			test.style.top=mouseData.y+'px';
			test.style.transform='rotate('+(degrees+180)+'deg)';
		}*/
		
		//console.log('SLOPE:',slope,'RADIANS:',radians,'DEGREES:',degrees);
		
		//Down is 0
		
		/*Rotate one of the two points based on the slope of the line and the origin of the circle; by seeing if:
			-That one point is above the circle's bottom
		We'll determine if they intersect.
		*/
		//var rotatedX=mouseData.x*(Math.cos())-mouseData.Y*(Math.sin());
		
		//console.log(rotatedY);
		
		//Pointer properties
		var windowSize=F.window.getBoundingClientRect();
		
		for(let i=0;i<F.buttons.length;i++){
			///////Y OUTSIDE- THE MATH IS RIGHT, BUT THE RESULTS DON'T ALWAYS WORK////////
			
			var x=parseFloat(F.buttons[i].element.style.left);
			var y=parseFloat(F.buttons[i].element.style.top);
			
			//Rotated Y is based around origin of the button
			var relXA=mouseData.x-x;
			var relYA=mouseData.y-y;
			var relXB=mouseData.prevX-x;
			var relYB=mouseData.prevY-y;
			
			//Button radius
			var radius=F.buttons[i].element.getBoundingClientRect().width/2;
			
			//console.log('RADIUS',radius);
			//console.log('RELATIVE',relXA,relYA);
			
			//https://academo.org/demos/rotation-about-point/
			//var rotatedY=relY*(Math.cos(radians))+relX*(Math.sin(radians));
			var rotatedYA=(-relYA*(Math.cos(radians)))+(relXA*(Math.sin(radians)));
			var rotatedXA=(relXA*(Math.cos(radians)))-(-relYA*(Math.sin(radians)));
			var rotatedXB=(relXB*(Math.cos(radians)))-(-relYB*(Math.sin(radians)));
			
			if(true){
				test.style.top=rotatedYA+y+'px';
				test.style.left=rotatedXA+x+'px';
				//test.style.left='50%';
				test.style.width='5px';
			}
			
			console.log(Math.abs(rotatedYA)<=radius,(Math.abs(rotatedXA)>radius && Math.abs(rotatedXB)>radius),(Math.abs(rotatedXA)<radius && Math.abs(rotatedXB)<radius));
			
			if(
				Math.abs(rotatedYA)<=radius
				&& !(
					(rotatedXA>radius && rotatedXB>radius)
					||
					(rotatedXA<-radius && rotatedXB<-radius)
				)
			){
				console.log('COLLIDE');
				//F.buttons[i].element.style.left=x+(mouseData.x-mouseData.prevX)+'px';
				//F.buttons[i].element.style.top=y+(mouseData.y-mouseData.prevY)+'px';
				
				
			
				//console.log(leftPointer,topPointer);
				
				//Distance from the center
				var fromLeft=(((mouseData.prevX-(x+radius)))/radius)+1;
				var fromTop=(((mouseData.prevY-(y+radius)))/radius)+1;
				var zIndex=parseInt(F.buttons[i].element.style.zIndex);
				
				console.log(fromLeft,fromTop);
				
				//console.log(calc.left,leftPointer,calc.top,topPointer);
				
				var speed=((maxSpeed-minSpeed)*(zIndex/(F.buttons.length)))+minSpeed;
				
				console.log(maxSpeed,minSpeed,zIndex);
				
				var newLeft=(x-(fromLeft*speed));
				var newTop=(y-(fromTop*speed));
				
				//Don't let go outside of boundaries
				if(newLeft<radius) newLeft=radius;
				if(newLeft>windowSize.width-radius) newLeft=windowSize.width-radius;
				
				if(newTop<radius) newTop=radius;
				if(newTop>windowSize.height-radius) newTop=windowSize.height-radius;
				
				console.log(fromLeft,fromTop,radius,speed,newLeft,newTop);
				
				F.buttons[i].element.style.left=newLeft+'px';
				F.buttons[i].element.style.top=newTop+'px';
			}
			
			//mouseData.x*(Math.cos())-mouseData.Y*(Math.sin())
			
			//(mouseData.x-mouseData.prevX)*y+(mouseData.y-mouseData.prevY)*x+(()
			/*
			//https://www.geeksforgeeks.org/check-line-touches-intersects-circle/
			var x=parseFloat(F.buttons[i].element.style.left);
			var y=parseFloat(F.buttons[i].element.style.top);
			
			//Rotated Y is based around origin of the button
			var relX=mouseData.x-x;
			var relY=mouseData.y-y;
			
			//Button radius
			var radius=F.buttons[i].element.getBoundingClientRect().width/2;
			
			// get a, b, c values
			var a = 1 + (m*m);
			var b = -h * 2 + (m * (n - k)) * 2;
			var c = (h*h) + (n - k)^2 - (r*r);
			
			var dist=Math.abs(a*x + b*y + c)/Math.sqrt(a*a + b*b);
			
			if(radius>dist) console.log('COLLIDE');*/
			/*
			var radius=F.buttons[i].element.getBoundingClientRect().width/2;
			var x=parseFloat(F.buttons[i].element.style.left);
			var y=parseFloat(F.buttons[i].element.style.top);
			
			//console.log(findCircleLineIntersections(radius,x,y,slope,));*/
			/*
			//https://math.stackexchange.com/questions/275529/check-if-line-intersects-with-circles-perimeter
			var ax=mouseData.prevX;
			var ay=mouseData.prevY;
			var bx=mouseData.x;
			var by=mouseData.y;
			var cx=parseFloat(F.buttons[i].element.style.left);
			var cy=parseFloat(F.buttons[i].element.style.top);
			var r=F.buttons[i].element.getBoundingClientRect().width/2;
			
			// parameters: ax ay bx by cx cy r
			ax -= cx;
			ay -= cy;
			bx -= cx;
			by -= cy;
			var a = ax^2 + ay^2 - r^2;
			var b = 2*(ax*(bx - ax) + ay*(by - ay));
			var c = (bx - ax)^2 + (by - ay)^2;
			var disc = b^2 - 4*a*c;
			if(disc <= 0) console.log('hey');
			var sqrtdisc = Math.sqrt(disc);
			var t1 = (-b + sqrtdisc)/(2*a);
			var t2 = (-b - sqrtdisc)/(2*a);
			
			console.log('LINE',ax,ay,bx,by);
			console.log(disc,t1,t2);
			
			if((0 < t1 && t1 < 1) || (0 < t2 && t2 < 1)) console.log('Collide!');
			else console.log('No collide!');*/
		}
		
		//The last considered mouse x and y are the current now
		mouseData.prevX=mouseData.x;
		mouseData.prevY=mouseData.y;
	};
	
	//https://cscheng.info/2016/06/09/calculate-circle-line-intersection-with-javascript-and-p5js.html
	function findCircleLineIntersections(r, h, k, m, n) {
		// circle: (x - h)^2 + (y - k)^2 = r^2
		// line: y = m * x + n
		// r: circle radius
		// h: x value of circle centre
		// k: y value of circle centre
		// m: slope
		// n: y-intercept

		// get a, b, c values
		var a = 1 + sq(m);
		var b = -h * 2 + (m * (n - k)) * 2;
		var c = sq(h) + sq(n - k) - sq(r);

		// get discriminant
		var d = sq(b) - 4 * a * c;
		if (d >= 0) {
			// insert into quadratic formula
			var intersections = [
				(-b + sqrt(sq(b) - 4 * a * c)) / (2 * a),
				(-b - sqrt(sq(b) - 4 * a * c)) / (2 * a)
			];
			if (d == 0) {
				// only 1 intersection
				return [intersections[0]];
			}
			return intersections;
		}
		// no intersection
		return [];
	}

	
	F.window.addEventListener('mousemove',function(event){
		mouseData.x=event.clientX;
		mouseData.y=event.clientY;
	});
	
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