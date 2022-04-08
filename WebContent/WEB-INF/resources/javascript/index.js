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
				for (var i = 0; i <= 9; i++){
					row = tbody.insertRow(tbody.rows.length);
					for (var  j= 0; j <= 11; j++){
						cell=row.insertCell(j);
						if(inn.isCurrentInning.toUpperCase() == 'YES') {
							switch (i){
								case 0:
									switch(j){
										case 0:
											if(inn.battingTeamId == dataToProcess.homeTeamId){	
												cell.innerHTML = dataToProcess.homeTeam.shortname;
											}
											else if(inn.battingTeamId == dataToProcess.awayTeamId){
												cell.innerHTML = dataToProcess.awayTeam.shortname;
											}
												break;
										case 1:
											inn.bowlingCard.forEach(function(boc,index,arr2){
												if(boc.status == 'CURRENTBOWLER'){
													cell.innerHTML = 'This Over:-' +  boc.totalRunsThisOver;
												}
												else if(boc.status == 'LASTBOWLER'){
													cell.innerHTML = 'This Over:-' +  boc.totalRunsThisOver;
												}
											});
											break;
										}
										break;
									case 1:
										switch(j){
											case 0:
												cell.innerHTML = inn.totalRuns+'-'+inn.totalWickets+'('+inn.totalOvers+'.'+inn.totalBalls+')';
												break;
											case 1:
												cell.innerHTML = 'Ball Since Last Boundary' ;
												cell.style.border = "thin dotted red";
												break;
										}
											break;
									case 2:
										switch(j){
											case 0:
												cell.innerHTML = 'RR-' + inn.runRate;
												break;
											case 1:
												cell.innerHTML = 'Last 30 Balls' ;
												cell.style.border = "thin dotted red";
												break;
										}
											break;
									case 3:
										switch(j){
											case 1:
												cell.innerHTML ='BATSMAN';
												cell.style='color:#2E008B';
												cell.style.textAlign = "center"
												break;
											case 3:
												cell.innerHTML ='BOWLER';
												cell.style='color:#2E008B';
												cell.style.textAlign = "center"
												break;
											case 4:
												cell.innerHTML ='BATTING CARD';
												cell.style='color:#2E008B';
												cell.style.textAlign = "center"
												break;
										}
										break;
									case 4:
										cell.style.textAlign = "center"
										switch(j){
											case 0:
												inn.battingCard.forEach(function(bc,index,arr1){
													if(bc.status == 'NOT OUT' && bc.onStrike == 'YES'){
														cell.innerHTML = bc.player.surname+'*'+"<br />"+bc.runs +"<br />"+ bc.strikeRate+"<br />"+ bc.fours+'/'+bc.sixes;
														cell.style.border = "thin dotted blue";
													}
												});
													break;
											case 1:
												inn.battingCard.forEach(function(bc,index,arr1){
													if(bc.status == 'NOT OUT' && bc.onStrike == 'YES'){
														cell.innerHTML ='Name'+"<br />"+'Runs'+"<br />"+'Strike Rate'+"<br />"+'4s/6s';
														cell.style.border = "thin dotted blue";
													}
												});
												break;				
											case 2:
												inn.battingCard.forEach(function(bc,index,arr1){
													if(bc.status == 'NOT OUT' &&bc.onStrike == 'NO'){
														cell.innerHTML = bc.player.surname+"<br />"+bc.runs +"<br />"+ bc.strikeRate+"<br />"+ bc.fours+'/'+bc.sixes;
														cell.style.border = "thin dotted blue";	
													}
												});
												break;	
											case 3:
												cell.style.border = "thin dotted blue";
												inn.bowlingCard.forEach(function(boc,index,arr2){
													if(boc.status == 'CURRENTBOWLER'){
														cell.innerHTML = boc.player.surname+"<br />"+boc.wickets+'-'+boc.runs+'('+boc.overs+'.'+boc.balls+')'+"<br />"+'Dot Balls:'+boc.dots+"<br />"+'Economy:'+boc.economyRate;
														
													}
													else if(boc.status == 'LASTBOWLER'){
														cell.innerHTML = boc.player.surname+"<br />"+boc.wickets+'-'+boc.runs+'('+boc.overs+'.'+boc.balls+')'+"<br />"+'Dot Balls:'+boc.dots+"<br />"+'Economy:'+boc.economyRate;
													}
												});
												break;			
										}
										break;
									case 5:
										cell.style.textAlign = "center"
										inn.partnerships.forEach(function(ps,index,arr4){
											switch(j){
												case 0:
													cell.innerHTML = ps.firstBatterRuns+'('+ps.firstBatterBalls+')';
													cell.style.border = "thin dotted blue";
													break;
												case 1:
													cell.innerHTML = 'Partnership Runs'+"<br />"+ ps.totalRuns+'('+ps.totalBalls+')';
													cell.style.border = "thin dotted blue";
													break;
												case 2:
													cell.innerHTML = ps.secondBatterRuns+'('+ps.secondBatterBalls+')';
													cell.style.border = "thin dotted blue";
													break;
											}
										});
										break;
									case 6:
										switch(j){
											case 0:
												cell.innerHTML = 'Last Wickets:';
												cell.style='color:#2E008B';
												break;
											case 1:
												inn.fallsOfWickets.forEach(function(fow,index,arr3){
													//cell.innerHTML = 'Wicket Number:'+fow.fowNumber+'|'+'Runs:'+fow.fowRuns;
												});
												break;
										}
										break;
									case 7:
										switch(j){
											case 0:
												cell.innerHTML = 'Fall Of Wickets:';
												cell.style='color:#2E008B';
												break;
											case 1: case 2: case 3: case 4: case 5: case 6: case 7: case 8: case 9: case 10:
												var k=j;
												if(k<=10){
													cell.innerHTML = k;
													cell.style.border = "thin dotted blue";
													k++;
												}
												break;
										}
										break;
									case 8:
										switch(j){
											case 0:
												if(inn.battingTeamId == dataToProcess.homeTeamId){	
													cell.innerHTML = dataToProcess.homeTeam.shortname;
												}
												else if(inn.battingTeamId == dataToProcess.awayTeamId){
													cell.innerHTML = dataToProcess.awayTeam.shortname;
												}
												break;
											case 1: case 2: case 3: case 4: case 5: case 6: case 7: case 8: case 9: case 10:
												inn.fallsOfWickets.forEach(function(fow,index,arr3){
													var k=j;
													//if(k<=fow.fowNumber){
														cell.innerHTML = fow.fowRuns+"<br />"+'('+fow.fowOvers+'.'+fow.fowBalls+')';
													//}
													cell.style.border = "thin dotted blue";
												});
												break;
										}
										break;
									case 9:
										switch(j){
											case 0:
												if(inn.bowlingTeamId == dataToProcess.homeTeamId){	
													cell.innerHTML = dataToProcess.homeTeam.shortname;
												}
												else if(inn.bowlingTeamId == dataToProcess.awayTeamId){
													cell.innerHTML = dataToProcess.awayTeam.shortname;
												}
												break;
											case 1: case 2: case 3: case 4: case 5: case 6: case 7: case 8: case 9: case 10:
												inn.fallsOfWickets.forEach(function(fow,index,arr3){
													var k=j;
													//if(k<=fow.fowNumber){
														cell.innerHTML = fow.fowRuns+"<br />"+'('+fow.fowOvers+'.'+fow.fowBalls+')';
													//}
													cell.style.border = "thin dotted blue";
												});
												break;
											case 11:
												cell.innerHTML = 'Extras-' + inn.totalExtras+' '+'('+inn.totalWides+'wd, '+inn.totalByes+'b, '+inn.totalLegByes+'lb, '+inn.totalNoBalls+'nb'+')';
												break;
										}
										break;		
										
								}
								row.appendChild(cell);
						}
						/*else{
							switch(i){
								case 9:
									switch(j){
										case 0:
											if(inn.inningNumber == 1){
												if(inn.battingTeamId == dataToProcess.homeTeamId){	
													cell.innerHTML = dataToProcess.homeTeam.shortname;
												}
												else if(inn.battingTeamId == dataToProcess.awayTeamId){
													cell.innerHTML = dataToProcess.awayTeam.shortname;
												}
											}
											break;
										case 1:
											inn.fallsOfWickets.forEach(function(fow,index,arr3){
													var k=j;
													//if(k<=fow.fowNumber){
														cell.innerHTML = fow.fowRuns+'('+fow.fowOvers+'.'+fow.fowBalls+')';
													//}
													cell.style.border = "thin dotted blue";
												});
											break;
									}
									break;
							}
							row.appendChild(cell);
							
						}*/

					}
					row.style='color:#008cff';
					tr.appendChild(row);
				}
				tbody = document.createElement('tbody');
				tbody.appendChild(tr);
				table.appendChild(tbody);
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