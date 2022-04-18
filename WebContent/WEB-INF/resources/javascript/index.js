var session_match;
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
		processUserSelection(document.getElementById('select_cricket_matches'));
		break;
	}
}
function processUserSelection(whichInput)
{	
	switch (whichInput.id) {
	case 'select_cricket_matches':
		processCricketProcedures('CHECK-NUMBER-INNINGS');
		break;
	}
}
function processCricketProcedures(whatToProcess)
{
	var valueToProcess;
	
	processWaitingButtonSpinner('START_WAIT_TIMER');
	
	switch(whatToProcess) {
	case 'CHECK-NUMBER-INNINGS':
		valueToProcess = $('#select_cricket_matches').val();
		break;
	case 'READ-MATCH-AND-POPULATE':
		if(session_match) {
			if(session_match.matchFileTimeStamp === $('#matchFileTimeStamp').val()) {
				return false;
			}
		}
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
			case 'CHECK-NUMBER-INNINGS':
				addItemsToList(whatToProcess,data);
				break;
			case 'READ-MATCH-AND-POPULATE':
				addItemsToList(whatToProcess,data);
				document.getElementById('matchFileTimeStamp').value = data.matchFileTimeStamp;
				session_match = data;
				break;
        	}
			processWaitingButtonSpinner('END_WAIT_TIMER');
	    },    
	    error : function(e) {    
	  	 	console.log('Error occured in ' + whatToProcess + ' with error description = ' + e);     
	    }    
	});
	processWaitingButtonSpinner('END_WAIT_TIMER');
}
function addItemsToList(whatToProcess, dataToProcess)
{
	switch (whatToProcess) {
	case 'CHECK-NUMBER-INNINGS':
		
		var option,drop_down;
		drop_down = document.getElementById('select_inning');
		
		$('#select_inning').empty();
		
		dataToProcess.inning.forEach(function(inn,index,arr){
			option = document.createElement('option');
			option.value = inn.inningNumber;
			option.innerHTML = "Inning " + inn.inningNumber;
			drop_down.appendChild(option);
			if(inn.isCurrentInning.toUpperCase().includes('YES')){	
				option.selected = true;	
			}
		});
		break;

	case 'READ-MATCH-AND-POPULATE':
		
		var table,tbody,row,cell;
		
		$('#fruit_captions_div').empty();
		
		if(dataToProcess) {

			table = document.createElement('table');
			table.setAttribute('class', 'table table-bordered');
			table.setAttribute('id', 'setup_teams');
			tbody = document.createElement('tbody');
			table.appendChild(tbody);

			for (var i = 1; i <= 11; i++){
				row = tbody.insertRow(tbody.rows.length);
				for (var j = 0; j <= 11; j++){
					cell = row.insertCell(j-1);
					switch (i){
					case 1:
						switch(j) {
						case 1:
							dataToProcess.inning.forEach(function(inn,index,arr){
								if(inn.isCurrentInning == 'YES'){
									for(var key in inn.stats){
										if(inn.battingTeamId == dataToProcess.homeTeamId){	
											cell.innerHTML = dataToProcess.homeTeam.shortname +"<br />"+inn.totalRuns+'-'+inn.totalWickets+'('+inn.stats[key]+')';
										}
										else {
											cell.innerHTML = dataToProcess.awayTeam.shortname+"<br />"+inn.totalRuns+'-'+inn.totalWickets+'('+inn.stats[key]+')';
										}
									}
								}
							});
						break;
						case 2:
							dataToProcess.inning.forEach(function(inn,index,arr){
								if(inn.isCurrentInning == 'YES'){
									inn.bowlingCard.forEach(function(boc,index,arr2){
										if(boc.status == 'CURRENTBOWLER'){
											cell.innerHTML = 'This Over:-' +  boc.totalRunsThisOver+"<br />";
										}
										else if(boc.status == 'LASTBOWLER'){
											cell.innerHTML = 'This Over:-' +  boc.totalRunsThisOver+"<br />";
										}
									});
								}
							});
						break;
						case 3:
							cell.style.textAlign = "center";
							dataToProcess.inning.forEach(function(inn,index,arr){
								if(inn.inningNumber == 1){
									if(inn.battingTeamId == dataToProcess.homeTeamId){	
										cell.innerHTML = dataToProcess.homeTeam.shortname +"<br />"+inn.totalRuns+'-'+inn.totalWickets+'('+inn.stats[key]+')';
									}
									else if(inn.battingTeamId == dataToProcess.awayTeamId){
										cell.innerHTML = dataToProcess.awayTeam.shortname+"<br />"+inn.totalRuns+'-'+inn.totalWickets+'('+inn.stats[key]+')';
									}
								}
							});
						break;
						case 4:
							dataToProcess.inning.forEach(function(inn,index,arr){
								cell.innerHTML = 'TEAM NAME'+"<br />"+'TEAM RUNS'
								cell.style.textAlign = "center";
							});
						break;
						case 5:
							cell.style.textAlign = "center";
							dataToProcess.inning.forEach(function(inn,index,arr){
								if(inn.inningNumber == 2){
									if(inn.battingTeamId == dataToProcess.homeTeamId){	
										cell.innerHTML = dataToProcess.homeTeam.shortname +"<br />"+inn.totalRuns+'-'+inn.totalWickets+'('+inn.stats[key]+')';
									}
									else if(inn.battingTeamId == dataToProcess.awayTeamId){
										cell.innerHTML = dataToProcess.awayTeam.shortname+"<br />"+inn.totalRuns+'-'+inn.totalWickets+'('+inn.stats[key]+')';
									}
								}
							});
						break;
						}
					break;
					case 2:
						switch(j){
							case 1:
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.isCurrentInning == 'YES'){
										cell.innerHTML = 'CRR-' + inn.runRate;
									}
								});
							break;
							case 2:
								dataToProcess.inning.forEach(function(inn,index,arr){
									cell.innerHTML = 'Ball Since Last Boundary:-';
								});
							break;
							case 3:
								cell.style.textAlign = "center";
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.inningNumber == 1){
										if(inn.battingTeamId == dataToProcess.homeTeamId){	
											cell.innerHTML = inn.totalFours+'/'+inn.totalSixes+"<br />"+dataToProcess.reviewsPerTeam;
										}
										else if(inn.battingTeamId == dataToProcess.awayTeamId){
											cell.innerHTML = inn.totalFours+'/'+inn.totalSixes+"<br />"+dataToProcess.reviewsPerTeam;
										}
									}
								});
							break;
							case 4:
								dataToProcess.inning.forEach(function(inn,index,arr){
									cell.innerHTML = '4s/6s'+"<br />"+'REVIEWS'
									cell.style.textAlign = "center";
								});
							break;
							case 5:
								cell.style.textAlign = "center";
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.inningNumber == 2){
										if(inn.battingTeamId == dataToProcess.homeTeamId){	
											cell.innerHTML = inn.totalFours+'/'+inn.totalSixes+"<br />"+dataToProcess.reviewsPerTeam;
										}
										else if(inn.battingTeamId == dataToProcess.awayTeamId){
											cell.innerHTML = inn.totalFours+'/'+inn.totalSixes+"<br />"+dataToProcess.reviewsPerTeam;
										}
									}
								});
							break;
						}
					break;
					case 3:
						switch(j){
							case 1:
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.inningNumber == 2 && inn.isCurrentInning == 'YES'){
										if(dataToProcess.inning.at(0).totalRuns > dataToProcess.inning.at(1).totalRuns){
											var RRR = ((dataToProcess.inning.at(0).totalRuns - dataToProcess.inning.at(1).totalRuns)/((dataToProcess.maxOvers*6) - (dataToProcess.inning.at(1).totalOvers*6 + dataToProcess.inning.at(1).totalBalls)));
											cell.innerHTML =  'Req. RR-'+ Math.round((RRR*6) * 100) / 100
										}
										else{
											cell.innerHTML = 'Req. RR-'+'0.00';
										}
									}
								});
							break;
							case 2:
								dataToProcess.inning.forEach(function(inn,index,arr){
									cell.innerHTML = 'Last 30 Balls:-' ;
								});
							break;
							case 3:
								cell.style.textAlign = "center";
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.inningNumber == 1){
										if(inn.battingTeamId == dataToProcess.homeTeamId){	
											//cell.innerHTML = 'compare' ;
										}
										else if(inn.battingTeamId == dataToProcess.awayTeamId){
											//cell.innerHTML = 'compare' ;
										}
									}
								});
							break;
							case 4:
								dataToProcess.inning.forEach(function(inn,index,arr){
									//cell.innerHTML = 'at this stage';
									cell.style.textAlign = "center";
								});
							break;
							case 5:
								cell.style.textAlign = "center";
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.inningNumber == 2){
										if(inn.battingTeamId == dataToProcess.homeTeamId){	
											//cell.innerHTML = 'compare' ;
										}
										else if(inn.battingTeamId == dataToProcess.awayTeamId){
											//cell.innerHTML = 'compare' ;
										}
									}
								});
							break;
						}
					break;
					case 4:
					break;
					case 5:
						switch(j){
							case 1:
							break;
							case 2:
								dataToProcess.inning.forEach(function(inn,index,arr){
									cell.innerHTML = 'BATSMAN';
									cell.style='color:#2E008B';
									cell.style.textAlign = "center";
								});
							break;
							case 3:
							break;
							case 4:
								dataToProcess.inning.forEach(function(inn,index,arr){
									cell.innerHTML = 'BOWLER';
									cell.style='color:#2E008B';
									cell.style.textAlign = "center";
								});
							break;
						}
					break;
					case 6:
						cell.style.textAlign = "center";
						switch(j){
							case 1:
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.isCurrentInning == 'YES'){
										inn.battingCard.forEach(function(bc,index,arr1){
											if(bc.status == 'NOT OUT' && bc.onStrike == 'YES'){
												cell.innerHTML = bc.player.surname+'*'+"<br />"+bc.runs +"<br />"+ bc.strikeRate+"<br />"+ bc.fours+'/'+bc.sixes;
											}
										});
									}
								});
							break;
							case 2:
								dataToProcess.inning.forEach(function(inn,index,arr){
									cell.innerHTML ='Name'+"<br />"+'Runs'+"<br />"+'Strike Rate'+"<br />"+'4s/6s';
								});
							break;
							case 3:
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.isCurrentInning == 'YES'){
										inn.battingCard.forEach(function(bc,index,arr1){
											if(bc.status == 'NOT OUT' && bc.onStrike == 'NO'){
												cell.innerHTML = bc.player.surname+"<br />"+bc.runs +"<br />"+ bc.strikeRate+"<br />"+ bc.fours+'/'+bc.sixes;
											}
										});
									}
								});
							break;
							case 4:
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.isCurrentInning == 'YES'){
										inn.bowlingCard.forEach(function(boc,index,arr2){
											if(boc.status == 'CURRENTBOWLER'){
												cell.innerHTML = boc.player.surname+"<br />"+boc.wickets+'-'+boc.runs+'('+boc.overs+'.'+boc.balls+')'+"<br />"+'Dot Balls:'+boc.dots+"<br />"+'Economy:'+boc.economyRate;			
											}
											else if(boc.status == 'LASTBOWLER'){
												cell.innerHTML = boc.player.surname+"<br />"+boc.wickets+'-'+boc.runs+'('+boc.overs+'.'+boc.balls+')'+"<br />"+'Dot Balls:'+boc.dots+"<br />"+'Economy:'+boc.economyRate;		
											}
										});
									}
								});
							break;
						}
					break;
					case 7:
						cell.style.textAlign = "center";
						switch(j){
							case 1:
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.isCurrentInning == 'YES'){
										inn.partnerships.forEach(function(ps,index,arr4){
												cell.innerHTML = ps.firstBatterRuns+'('+ps.firstBatterBalls+')';
										});
									}
								});
							break;
							case 2:
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.isCurrentInning == 'YES'){
										inn.partnerships.forEach(function(ps,index,arr4){
												cell.innerHTML = 'Partnership Runs'+"<br />"+ ps.totalRuns+'('+ps.totalBalls+')';
										});
									}
								});
							break;
							case 3:
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.isCurrentInning == 'YES'){
										inn.partnerships.forEach(function(ps,index,arr4){
												cell.innerHTML = ps.secondBatterRuns+'('+ps.secondBatterBalls+')';
										});
									}
								});
							break;
							case 4:
								dataToProcess.inning.forEach(function(inn,index,arr){
									cell.innerHTML = 'Extras-' + inn.totalExtras+"<br />"+'('+inn.totalWides+'wd, '+inn.totalByes+'b, '+inn.totalLegByes+'lb, '+inn.totalNoBalls+'nb'+')';
								});
							break;
						}
					break;
					case 8:
						switch(j){
							case 1:
								dataToProcess.inning.forEach(function(inn,index,arr){
									cell.innerHTML = 'Last Wickets:';
									cell.style='color:#2E008B';
								});
							break;
							case 2:
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.isCurrentInning == 'YES'){
										inn.battingCard.forEach(function(bc,index,arr1){
										inn.fallsOfWickets.forEach(function(fow,index,arr3){
											if(fow.fowPlayerID == bc.playerId){
											cell.innerHTML = bc.player.surname +' '+ bc.runs+'('+bc.balls+')'+"<br />"+bc.howOutText;
											}
										});
										});
									}
								});
							break;
						}
					break;
					case 9:
						switch(j){
							case 1:
								dataToProcess.inning.forEach(function(inn,index,arr){
									cell.innerHTML = 'Fall Of Wickets:';
									cell.style='color:#2E008B';
								});
							break;
							case 2: case 3: case 4: case 5: case 6: case 7: case 8: case 9: case 10: case 11:
								dataToProcess.inning.forEach(function(inn,index,arr){
									var k=j-1;
										if(k<=11){
											cell.innerHTML = k;
											k++;
										}
								});
							break;
						}
					break;
					case 10:
						switch(j){
							case 1:
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.inningNumber == 1){
										if(inn.battingTeamId == dataToProcess.homeTeamId){	
											cell.innerHTML = dataToProcess.homeTeam.shortname;
										}
										else if(inn.battingTeamId == dataToProcess.awayTeamId){
											cell.innerHTML = dataToProcess.awayTeam.shortname;
										}
									
									}
									cell.style='color:#2E008B';
								});
							break;
							case 2: case 3: case 4: case 5: case 6: case 7: case 8: case 9: case 10: case 11:
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.inningNumber == 1){
										inn.fallsOfWickets.forEach(function(fow,index,arr3){
											var k=j-1;
											if(k==fow.fowNumber){
												cell.innerHTML = fow.fowRuns+'('+fow.fowOvers+'.'+fow.fowBalls+')';
											}
										});
									}
								});
							break;
						}
					break;
					case 11:
						switch(j){
							case 1:
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.inningNumber == 2){
										if(inn.battingTeamId == dataToProcess.homeTeamId){	
											cell.innerHTML = dataToProcess.homeTeam.shortname;
										}
										else if(inn.battingTeamId == dataToProcess.awayTeamId){
											cell.innerHTML = dataToProcess.awayTeam.shortname;
										}
									}
									cell.style='color:#2E008B';
								});
							break;
							case 2: case 3: case 4: case 5: case 6: case 7: case 8: case 9: case 10: case 11:
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.inningNumber == 2){
										inn.fallsOfWickets.forEach(function(fow,index,arr3){
											var k=j-1;
											if(k==fow.fowNumber){
												cell.innerHTML = fow.fowRuns+'('+fow.fowOvers+'.'+fow.fowBalls+')';
											}
										});
									}
								});
							break;
						}
					break;
					}
				}
			}
			$('#match_file_timestamp').attr('value',dataToProcess.match_file_timestamp);
		}
		$('#fruit_captions_div').append(table);
		//document.getElementById('fruit_captions_div').appendChild(table);
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