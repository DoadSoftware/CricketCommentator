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
	var Tname;
	
	switch (whatToProcess) {
	case 'READ-MATCH-AND-POPULATE':
		
		if(dataToProcess){
			$('#fruit_captions_div').empty();
		}
		
		table = document.createElement('table');
		table.setAttribute('class', 'table table-bordered');
		table.setAttribute('id', 'setup_teams');
		tr = document.createElement('tr');
		
		tbody = document.createElement('tbody');
		if(dataToProcess) {
			dataToProcess.inning.forEach(function(inn,index,arr){
					if(inn.isCurrentInning.toUpperCase() == 'YES') {
						for (var i = 0; i <= 10; i++){
							row = tbody.insertRow(tbody.rows.length);
							for (var  j= 0; j <= 2; j++){
								cell=row.insertCell(j);
						
									switch (j){
										case 0:
											switch(i){
												case 0:
													if(inn.battingTeamId == dataToProcess.homeTeamId){	
														cell.innerHTML = dataToProcess.homeTeam.shortname;
													}
													else if(inn.battingTeamId == dataToProcess.awayTeamId){
														cell.innerHTML = dataToProcess.awayTeam.shortname;
													}
													break;
												case 1:
													cell.innerHTML = inn.totalRuns+'-'+inn.totalWickets+'('+inn.totalOvers+'.'+inn.totalBalls+')';
													break;
												case 2:
													cell.innerHTML = 'RR-' + inn.runRate; 
													break;
												case 3:
													cell.innerHTML ='BATSMAN';
													cell.style='color:#2E008B';
													break;
												case 4:
													inn.battingCard.forEach(function(bc,index,arr1){
														if(bc.onStrike == 'YES'){
															cell.innerHTML = bc.player.surname+'*'+'|'+'Runs:'+bc.runs +'|'+'Strike:'+ bc.strikeRate+'|'+'4s/6s:'+ bc.fours+'/'+bc.sixes;
														}
													});
													break;
												case 5:
													inn.battingCard.forEach(function(bc,index,arr1){
														if(bc.onStrike == 'NO'){
															cell.innerHTML = bc.player.surname+'|'+'Runs:'+bc.runs +'|'+'Strike:'+ bc.strikeRate+'|'+'4s/6s:'+ bc.fours+'/'+bc.sixes;	
														}
													});
													break;
												case 6:
													cell.innerHTML = 'Partnership';
													cell.style='color:#2E008B';
													break;
												case 7:
													 inn.partnerships.forEach(function(ps,index,arr4){
														if(ps.partnershipNumber == inn.partnerships.length){
															cell.innerHTML = 'FirstBatterRuns'+ps.firstBatterRuns+'|'+'Runs'+ ps.totalRuns+'|'+'SecondBatterRuns'+ps.secondBatterRuns;
														}
													});
													break;
												case 8:
													cell.innerHTML = 'Fall Of Wickets';
													cell.style='color:#2E008B';
													break;
												case 9:
													 inn.fallsOfWickets.forEach(function(fow,index,arr3){
														cell.innerHTML = 'Wicket Number:'+fow.fowNumber+'|'+'Runs:'+fow.fowRuns;
													});
													break;
												}
											break;
										case 1:
											switch(i){
												case 0:
													inn.bowlingCard.forEach(function(boc,index,arr2){
														if(boc.status == 'CURRENTBOWLER'){
															cell.innerHTML = 'This Over:-' +  boc.totalRunsThisOver;
														}
														else if(boc.status == 'LASTBOWLER'){
															cell.innerHTML = 'This Over:-' +  boc.totalRunsThisOver;
														}
													});
													break;
												case 3:
													cell.innerHTML ='BOLWER';
													cell.style='color:#2E008B';
													break;
												case 4:
													inn.bowlingCard.forEach(function(boc,index,arr2){
														if(boc.status == 'CURRENTBOWLER'){
															cell.innerHTML = boc.player.surname+'|'+'Bowling Figures:'+boc.wickets+'-'+boc.runs+'('+boc.overs+'.'+boc.balls+')'+'|'+'Dot Balls:'+boc.dots+'|'+'Economy:'+boc.economyRate;
														}
														else if(boc.status == 'LASTBOWLER'){
															cell.innerHTML = boc.player.surname+'|'+'Bowling Figures:'+boc.wickets+'-'+boc.runs+'('+boc.overs+'.'+boc.balls+')'+'|'+'Dot Balls:'+boc.dots+'|'+'Economy:'+boc.economyRate;
														}
													});
													break;
											}
											break;
										case 2:
											switch(i){
												case 3:
													cell.innerHTML = 'Batting Card';
													cell.style='color:#2E008B';
													break;
												case 4:
													inn.battingCard.forEach(function(bc,index,arr1){
														if(bc.status == 'OUT'){
															cell.innerHTML = bc.player.surname+':	'+bc.runs+'('+ bc.balls+')';
														}
														/*else if(bc.status == 'NOT OUT'){
															cell.innerHTML = bc.player.surname+'*'+':	'+bc.runs+'('+ bc.balls+')';	
														}
														else{
															cell.innerHTML = bc.player.surname;
														}*/
													});
													break;
												case 9:
													cell.innerHTML = 'Extras-' + inn.totalExtras+' '+'('+inn.totalWides+'wd, '+inn.totalByes+'b, '+inn.totalLegByes+'lb, '+inn.totalNoBalls+'nb'+')';
													break;
											}
											break;
								}
								row.appendChild(cell);
							}
							row.style='color:#008cff';
							tr.appendChild(row);
						
						}
						tbody = document.createElement('tbody');
						tbody.appendChild(tr);
						table.appendChild(tbody);
					}
				/*else{
					if(inn.inningNumber == 1){
						header_text = document.createElement('h6');
						header_text.innerHTML = 'Fall Of Wickets 1 Inning';
						document.getElementById('fruit_captions_div').appendChild(header_text);
					
						inn.fallsOfWickets.forEach(function(fow,index,arr3){
							header_text = document.createElement('h6');
							header_text.innerHTML = 'Wicket Number:'+fow.fowNumber+'|'+'Runs:'+fow.fowRuns;
							document.getElementById('fruit_captions_div').appendChild(header_text);
						
						});
					}
				}*/
			});
			$('#match_file_timestamp').attr('value',dataToProcess.match_file_timestamp);
		}
		document.getElementById('fruit_captions_div').appendChild(table);
		document.getElementById('fruit_captions_div').style.display = '';
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