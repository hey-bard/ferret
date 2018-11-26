var settings={
	window:document.getElementById('ferret')
	,buttons:[
		{
			content:'Orbit'
			,classes:null
			,css:'background-image:url("resources/orbit.jpg")'
			,tags:'crazy,simple,vector'
			,action:'https://heybard.com/stories/orbit/'
		}
		,{
			content:'Entreprenewb'
			,classes:null
			,css:'background-image:url("resources/entreprenewb.jpg")'
			,tags:'business,paint,entrepreneur'
			,action:'https://heybard.com/stories/entreprenewb/'
		}
		,{
			content:'Game Plan!'
			,classes:null
			,css:'background-image:url("resources/game-plan.jpg")'
			,tags:'christian,manga,slice of life'
			,action:'http://gameplanmanga.com/'
		}
		,{
			content:'Steelblood: Silver & Gold'
			,classes:null
			,css:'background-image:url("resources/steelblood.jpg")'
			,tags:'christian,manga,fantasy'
			,action:'http://steelbloodmanga.com/'
		}
		,{
			content:'Culture Shock'
			,classes:null
			,css:'background-image:url("resources/culture-shock.jpg")'
			,tags:'urban,fantasy'
			,action:'http://cultureshockcomic.com/'
		}
		,{
			content:'Seasons'
			,classes:null
			,css:'background-image:url("resources/seasons.jpg")'
			,tags:'urban'
			,action:'http://seasonsthecomicbook.com'
		}
		,{
			content:'164 Days'
			,classes:null
			,css:'background-image:url("resources/164-days.jpg")'
			,tags:'fantasy,magic'
			,action:'https://164days.co.uk/'
		}
		,{
			content:'Rainy Days'
			,classes:null
			,css:'background-image:url("resources/rainy-days.png")'
			,tags:'slice of life,cute'
			,action:'https://tapas.io/series/RainyDays'
		}
		,{
			content:'XP'
			,classes:null
			,css:'background-image:url("resources/xp.jpg")'
			,tags:'fantasy,dnd,wacky'
			,action:'http://xpwebcomic.com/'
		}
		,{
			content:'The Adventures of Dr. McNinja'
			,classes:null
			,css:'background-image:url("resources/dr-mcninja.jpg")'
			,tags:'ninja,wacky,urban'
			,action:'http://drmcninja.com/'
		}
		,{
			content:'Axe Cop'
			,classes:null
			,css:'background-image:url("resources/axe-cop.jpg")'
			,tags:'urban,wacky'
			,action:'http://axecop.com/'
		}
		,{
			content:'Polka and Japan'
			,classes:null
			,css:'background-image:url("resources/polka-and-japan.jpg")'
			,tags:'slice of life,cute,culture'
			,action:'https://www.webtoons.com/en/challenge/polka-and-japan/list?title_no=20488'
		}
		,{
			content:'A Beautiful Mind'
			,classes:null
			,css:'background-image:url("resources/a-beautiful-mind.jpg")'
			,tags:'wacky,slice of life'
			,action:'https://www.webtoons.com/en/challenge/a-beautiful-mind/list?title_no=28295'
		}
		,{
			content:'Brawl in the Family'
			,classes:null
			,css:'background-image:url("resources/brawl-in-the-family.jpg")'
			,tags:'video game,super smash bros'
			,action:'http://brawlinthefamily.keenspot.com/'
		}
		,{
			content:'Not Enough Rings'
			,classes:null
			,css:'background:url("resources/not-enough-rings.png") center, #fff;background-size:contain;background-repeat:no-repeat;'
			,tags:'video game,sonic'
			,action:'https://www.notenoughrings.com/'
		}
		,{
			content:'Jackie Rose'
			,classes:null
			,css:'background-image:url("resources/jackie-rose.jpg")'
			,tags:'adventure'
			,action:'https://www.webtoons.com/en/action/jackie-rose/list?title_no=613'
		}
		,{
			content:'Luft'
			,classes:null
			,css:'background-image:url("resources/luft.jpg")'
			,tags:'sweet'
			,action:'https://www.webtoons.com/en/challenge/luft/list?title_no=60156'
		}
		,{
			content:'Darths & Droids'
			,classes:null
			,css:'background-image:url("resources/darths-and-droids.jpg");'
			,tags:'dnd,action,movie,star wars'
			,action:'http://www.darthsanddroids.net/'
		}
		,{
			content:'To the Moon, Too!'
			,classes:null
			,css:'background-image:url("resources/to-the-moon-too.png")'
			,tags:'video game,sweet'
			,action:'http://freebirdgames.com/to-the-moon-too_comic/'
		}
		,{
			content:'DM of the Rings'
			,classes:null
			,css:'background-image:url("resources/dm-of-the-rings.jpg")'
			,tags:'dnd,lotr,lord of the rings'
			,action:'https://www.shamusyoung.com/twentysidedtale/?p=612'
		}
	]
	,fps:10
	,minSize:.9
	,query:'search'
};

var printer=new ObjPrint({
	window:document.getElementById("code")
	,explanationWindow:document.getElementById("propertyExplanation")
	,properties:{
		window:"The element to put Ferret into. Ideally a div. Must be set."
		,buttons:"An array of all the buttons."
		,'buttons.#':'A button instance.'
		,'buttons.#.action':'Where to go on clicking the button.'
		,'buttons.#.content':'The button\'s text.'
		,'buttons.#.classes':'An array of classes to add to the button. Can be <em>null</em>.'
		,'buttons.#.css':'Adds inline CSS to the button.'
		,'buttons.#.element':'Automatically set to the button\'s element once it\'s created. Can start unset or <em>null</em>.'
		,'buttons.#.tags':'Additional terms you can search for the button by, comma-separated.'
		,minSize:"The smallest a button can get if it's far back. Defaults to <em>.4</em>."
		,fps:"How many frames per second to read mouse movements for scrubbing. Does not affect animation smoothness; animations should be smooth regardless of what this is set to. Defaults to <em>10</em>."
		,query:"Save searches to the querystring, and load searches from the querystring. This allows going back and forward to revisit searches and creating links to specific searches. If <em>null</em>, this will be disabled; if anything else, it will be the query's name in the URL. Defaults to <em>null</em>."
	}
});

printer.print(settings);

var localFerret=new Ferret(settings);