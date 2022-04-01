function processWaitingButtonSpinner(whatToProcess) 
{
	switch (whatToProcess) {
	case 'START_WAIT_TIMER': 
		$('.spinner-border').show();
		$(':button').prop('disabled', true);
		break;
	case 'END_WAIT_TIMER': 
		$('.spinner-border').hide();
		$(':button').prop('disabled', false);
		break;
	}
	
}
function reloadPage(whichPage)
{
	switch (whichPage) {
	case 'initialise':
		processUserSelection($('#select_broadcaster'));
		break;
	}
}
function processUserSelection(whichInput)
{	
}
function processCricketProcedures(whatToProcess)
{
	var valueToProcess;
	
	switch(whatToProcess) {
	case 'READ-MATCH-AND-POPULATE':
		valueToProcess = $('#matchFileTimeStamp').val();
		break;
	}

	$.ajax({    
        type : 'Get',     
        url : 'processCricketProcedures.html',     
        data : 'whatToProcess=' + whatToProcess + '&valueToProcess=' + valueToProcess, 
        dataType : 'json',
        success : function(data) {
        	switch(whatToProcess) {
			case 'READ-MATCH-AND-POPULATE':
				addItemsToList(whatToProcess,data);
				$('#matchFileTimeStamp').val(session_match.matchFileTimeStamp);
				break;
        	}
			processWaitingButtonSpinner('END_WAIT_TIMER');
	    },    
	    error : function(e) {    
	  	 	console.log('Error occured in ' + whatToProcess + ' with error description = ' + e);     
	    }    
	});
}
function addItemsToList(whatToProcess, dataToProcess)
{
	var header_text;
	
	switch (whatToProcess) {
	case 'READ-MATCH-AND-POPULATE':
		
		if(dataToProcess){
			$('#fruit_captions_div').empty();
		}
		if(dataToProcess) {
			dataToProcess.inning.forEach(function(inn,index,arr) {
				if(inn.isCurrentInning.toUpperCase() == 'YES') {
					header_text = document.createElement('h6');
					if(inn.battingTeamId ==dataToProcess.homeTeamId)
					{	
						header_text.innerHTML = dataToProcess.homeTeam.fullname;	
					}
					else if(inn.battingTeamId == dataToProcess.awayTeamId)
					{
						header_text.innerHTML = dataToProcess.awayTeam.fullname;
					}
					document.getElementById('fruit_captions_div').appendChild(header_text);
						
					header_text = document.createElement('h6');
					header_text.innerHTML = 'Total ' + inn.totalRuns+'-'+inn.totalWickets+'('+inn.totalOvers+'.'+inn.totalBalls+')';
					document.getElementById('fruit_captions_div').appendChild(header_text);
					
					header_text = document.createElement('h6');
					header_text.innerHTML = 'Run Rate-' +  (inn.totalRuns/inn.totalOvers);
					document.getElementById('fruit_captions_div').appendChild(header_text);
					
					header_text = document.createElement('h6');
					header_text.innerHTML = 'Extras-' + inn.totalExtras+' '+'('+inn.totalWides+'wd, '+inn.totalByes+'b, '+inn.totalLegByes+'lb, '+inn.totalNoBalls+'nb'+')';
					document.getElementById('fruit_captions_div').appendChild(header_text);
					
					header_text = document.createElement('h6');
					header_text.innerHTML = 'Batsman';
					document.getElementById('fruit_captions_div').appendChild(header_text);
					
					inn.battingCard.forEach(function(bc,index,arr1){
						if(bc.onStrike == 'YES'){
							header_text = document.createElement('h6');
							header_text.innerHTML = 'Name:'+ bc.player.surname+'*'+'|'+'Runs:'+bc.runs +'|'+'Strike:'+ bc.strikeRate+'|'+'4s/6s:'+ bc.fours+'/'+bc.sixes;
							document.getElementById('fruit_captions_div').appendChild(header_text);
						}
						if(bc.onStrike == 'NO'){
							header_text = document.createElement('h6');
							header_text.innerHTML = 'Name:'+ bc.player.surname+'|'+'Runs:'+bc.runs +'|'+'Strike:'+ bc.strikeRate+'|'+'4s/6s:'+ bc.fours+'/'+bc.sixes;
							document.getElementById('fruit_captions_div').appendChild(header_text);
						}
						
					});
					
					header_text = document.createElement('h6');
					header_text.innerHTML = 'Bowler';
					document.getElementById('fruit_captions_div').appendChild(header_text);
					
					inn.bowlingCard.forEach(function(boc,index,arr2){
						if(boc.status == 'CURRENTBOWLER'){
							header_text = document.createElement('h6');
							header_text.innerHTML = 'Name:'+ boc.player.surname+'|'+'Bowling Figures:'+boc.wickets+'-'+boc.runs+'('+boc.overs+')'+'|'+'Dot Balls:'+boc.dots+'|'+'Economy:'+boc.economyRate;
							document.getElementById('fruit_captions_div').appendChild(header_text);
						}
						if(boc.status == 'LASTBOWLER'){
							header_text = document.createElement('h6');
							header_text.innerHTML = 'Name:'+ boc.player.surname+'|'+'Bowling Figures:'+boc.wickets+'-'+boc.runs+'('+boc.overs+')'+'|'+'Dot Balls:'+boc.dots+'|'+'Economy:'+boc.economyRate;
							document.getElementById('fruit_captions_div').appendChild(header_text);
						}
						
					});
					
					header_text = document.createElement('h6');
					header_text.innerHTML = 'Fall Of Wickets';
					document.getElementById('fruit_captions_div').appendChild(header_text);
					
					inn.fallsOfWickets.forEach(function(fow,index,arr3){
						header_text = document.createElement('h6');
						header_text.innerHTML = 'Wicket Number:'+fow.fowNumber+'|'+'Runs:'+fow.fowRuns;
						document.getElementById('fruit_captions_div').appendChild(header_text);
						
					});
					
					header_text = document.createElement('h6');
					header_text.innerHTML = 'Batsman Team Order';
					document.getElementById('fruit_captions_div').appendChild(header_text);
					
					inn.battingCard.forEach(function(bc,index,arr1){
						if(bc.status == 'OUT'){
							header_text = document.createElement('h6');
							header_text.innerHTML = 'Name:'+ bc.player.surname+'|'+'Runs:'+bc.runs +'|'+'Balls:'+ bc.balls;
							document.getElementById('fruit_captions_div').appendChild(header_text);
						}
						else if(bc.status == 'NOT OUT'){
							header_text = document.createElement('h6');
							header_text.innerHTML = 'Name:'+ bc.player.surname+'*'+'|'+'Runs:'+bc.runs +'|'+'Balls:'+ bc.balls;
							document.getElementById('fruit_captions_div').appendChild(header_text);
						}
						else{
							header_text = document.createElement('h6');
							header_text.innerHTML = 'Name:'+ bc.player.surname;
							document.getElementById('fruit_captions_div').appendChild(header_text);
						}
					});
				}
				
			});
			$('#match_file_timestamp').attr('value',dataToProcess.match_file_timestamp);
		}
		break;
	}
}
function checkEmpty(inputBox,textToShow) {

	var name = $(inputBox).attr('id');
	
	document.getElementById(name + '-validation').innerHTML = '';
	document.getElementById(name + '-validation').style.display = 'none';
	$(inputBox).css('border','');
	if(document.getElementById(name).value.trim() == '') {
		$(inputBox).css('border','#E11E26 2px solid');
		document.getElementById(name + '-validation').innerHTML = textToShow + ' required';
		document.getElementById(name + '-validation').style.display = '';
		document.getElementById(name).focus({preventScroll:false});
		return false;
	}
	return true;	
}