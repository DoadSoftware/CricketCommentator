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
				if($('#matchFileTimeStamp').val() != data.matchFileTimeStamp) {
					addItemsToList(whatToProcess,data);
					document.getElementById('matchFileTimeStamp').value = data.matchFileTimeStamp;
				}
				break;
        	}
	    },    
	    error : function(e) {    
	  	 	console.log('Error occured in ' + whatToProcess + ' with error description = ' + e);     
	    }    
	});
}
function addItemsToList(whatToProcess, dataToProcess)
{
	switch (whatToProcess) {
	case 'READ-MATCH-AND-POPULATE':
		
		var table,tbody,row,cell,count;
		
		$('#fruit_captions_div').empty();
		
		if(dataToProcess) {

			table = document.createElement('table');
			table.setAttribute('class', 'table table-bordered');
			table.setAttribute('id', 'setup_teams');
			tbody = document.createElement('tbody');
			table.appendChild(tbody);

			for (var i = 1; i <= 11; i++){
				row = tbody.insertRow(tbody.rows.length);
				switch(i){
					case 1: case 2: case 3: 
						count = 5;
						break;
					case 4:
						count = 0
						row.style = "color: #FFFFFF"
						row.style.fontWeight = "1000"
						dataToProcess.inning.forEach(function(inn,index,arr){
							if(inn.isCurrentInning == 'YES' && inn.totalOvers > 6){
								for(var key in inn.stats){
									if(key == 'PS'){
										row.innerHTML = 'Projected Score-' + inn.stats[key] ;
									}
								}
							}
							if(inn.inningNumber == 2 && inn.isCurrentInning == 'YES'){
								for(var key in inn.stats){
									if(key == "INNING_STATUS"){
										row.innerHTML = inn.stats[key];
									}
								}
							}
						});
						break;
					case 5: case 6: case 7:
						count = 4	
						break;
					case 8:
						count = 2
						break;	
					case 9: case 10:
						count = 11;
						break;
				}
				for (var j = 1; j <= count; j++){
					cell = row.insertCell(j-1);
					switch (i){
					case 1:
						switch(j) {
						case 1:
							cell.style = "background: red ; color: #FFFFFF ; width:10%";
							cell.style.textAlign = "center";
							cell.style.fontWeight = "900";
							dataToProcess.inning.forEach(function(inn,index,arr){
								if(inn.isCurrentInning == 'YES'){
									if(inn.battingTeamId == dataToProcess.homeTeamId){	
										cell.innerHTML = dataToProcess.homeTeam.shortname + "<br />" + inn.totalRuns + '-' + inn.totalWickets ;
									}
									else {
										cell.innerHTML = dataToProcess.awayTeam.shortname + "<br />" + inn.totalRuns + '-' + inn.totalWickets ;
									}
									for(var key in inn.stats){
										if(key == 'OVER' + inn.inningNumber){
											cell.innerHTML = cell.innerHTML + '(' + inn.stats[key] + ')';
										}
									}
									for(var key in inn.stats){
										if(key == 'POWERPLAY'){
											cell.innerHTML = cell.innerHTML + ' (' + inn.stats[key] + ')';
											
										}
									}
								}
							});
							break;
						case 2:
							cell.style= "background: linear-gradient(to top, lightgray 50%, yellow 50%)";
							cell.style.fontWeight = "700";
							dataToProcess.inning.forEach(function(inn,index,arr){
								if(inn.isCurrentInning == 'YES'){
									inn.bowlingCard.forEach(function(boc,index,arr2){
										for(var key in inn.stats){
											if(key == "OVER"){
												if(boc.status == 'CURRENTBOWLER'){
													cell.innerHTML = 'This Over:-' +  boc.totalRunsThisOver + "<br />" + inn.stats[key];
												}
												else if(boc.status == 'LASTBOWLER'){
													cell.innerHTML = 'This Over:-' +  boc.totalRunsThisOver + "<br />" + inn.stats[key];
												}
											}
										}
									});
								}
							});
							break;
						case 3:
							cell.style = "background: silver ; width:10%";
							cell.style.textAlign = "center";
							cell.style.fontWeight = "900";
							dataToProcess.inning.forEach(function(inn,index,arr){
								if(inn.inningNumber == 1){
									for(var key in inn.stats){
										if(key == "OVER" + inn.inningNumber){
											if(inn.battingTeamId == dataToProcess.homeTeamId){	
												cell.innerHTML = dataToProcess.homeTeam.shortname + "<br />" + inn.totalRuns + '-' + inn.totalWickets + '(' + inn.stats[key] + ')';
											}
											else if(inn.battingTeamId == dataToProcess.awayTeamId){
												cell.innerHTML = dataToProcess.awayTeam.shortname + "<br />" + inn.totalRuns + '-' + inn.totalWickets + '(' + inn.stats[key] + ')';
											}
										}
									}
								}
							});
							break;
						case 4:
							cell.innerHTML = 'TEAMS' + "<br />" + 'SCORES'
							cell.style = "background: black ; color:#FFFFFF";
							cell.style.textAlign = "center";
							break;
						case 5:
							cell.style = "background: silver ; width:10%";
							cell.style.textAlign = "center";
							cell.style.fontWeight = "900";
							dataToProcess.inning.forEach(function(inn,index,arr){
								if(inn.inningNumber == 2){
									for(var key in inn.stats){
										if(key == "OVER"+ inn.inningNumber){
											if(inn.battingTeamId == dataToProcess.homeTeamId){	
												cell.innerHTML = dataToProcess.homeTeam.shortname + "<br />" + inn.totalRuns + '-' + inn.totalWickets + '(' + inn.stats[key] + ')';
											}
											else if(inn.battingTeamId == dataToProcess.awayTeamId){
												cell.innerHTML = dataToProcess.awayTeam.shortname + "<br />" + inn.totalRuns + '-' + inn.totalWickets + '(' + inn.stats[key] + ')';
											}
										}
									}
								}
							});
							break;
						/*case 6:
							break;
						case 7:
							dataToProcess.daysSessions.forEach(function(ds,index,arr){
								if(dataToProcess.matchType == 'TEST'){
									cell.innerHTML = 'Day-' + ds.dayNumber + "<br />" + 'Session-' + ds.sessionNumber;
								}
							});
							break;*/
						}
						break;
					case 2:
						switch(j){
							case 1:
								cell.style= "background: linear-gradient(to top, lightgray 50%, yellow 50%);";
								cell.style.fontWeight = "700";
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.isCurrentInning == 'YES'){
										cell.innerHTML = 'CRR-' + inn.runRate;
									}
									if(inn.inningNumber == 2 && inn.isCurrentInning == 'YES'){
										if(dataToProcess.inning[0].totalRuns > dataToProcess.inning[1].totalRuns){
											for(var key in inn.stats){
												if(key == 'Req_RR'){
													cell.innerHTML = 'CRR-' + inn.runRate + "<br />" + 'Req.RR-' + inn.stats[key];
												}
											}
										}
										else{
											cell.innerHTML = 'CRR-' + inn.runRate + "<br />" + 'Req. RR- 0.00'
										}
									}
								});
								break;
							case 2:
								cell.style = "background: silver";
								cell.style.fontWeight = "700";
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.isCurrentInning == 'YES'){
										for(var key in inn.stats){
											if(key == "BOUNDARY"){
												cell.innerHTML = 'Ball Since Last Boundary:-' + inn.stats[key];
											}
										}
									}
								});
								break;
							case 3:
								cell.style = "background: silver";
								cell.style.textAlign = "center";
								cell.style.fontWeight = "900";
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.inningNumber == 1){
										if(inn.battingTeamId == dataToProcess.homeTeamId){	
											cell.innerHTML = inn.totalFours + '/' + inn.totalSixes + "<br />" + dataToProcess.reviewsPerTeam;
										}
										else if(inn.battingTeamId == dataToProcess.awayTeamId){
											cell.innerHTML = inn.totalFours + '/' + inn.totalSixes + "<br />" + dataToProcess.reviewsPerTeam;
										}
									}
								});
								break;
							case 4:
								cell.innerHTML = '4s/6s' + "<br />" + 'REVIEWS'
								cell.style = "background: black ; color:#FFFFFF";
								cell.style.textAlign = "center";
								break;
							case 5:
								cell.style = "background: silver ";
								cell.style.textAlign = "center";
								cell.style.fontWeight = "900";
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.inningNumber == 2){
										if(inn.battingTeamId == dataToProcess.homeTeamId){	
											cell.innerHTML = inn.totalFours + '/' + inn.totalSixes + "<br />" + dataToProcess.reviewsPerTeam;
										}
										else if(inn.battingTeamId == dataToProcess.awayTeamId){
											cell.innerHTML = inn.totalFours + '/' + inn.totalSixes + "<br />" + dataToProcess.reviewsPerTeam;
										}
									}
								});
								break;
						}
						break;
					case 3:
						cell.style = "background: silver ";
						cell.style.fontWeight = "700";
						switch(j){
							case 1:
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.isCurrentInning == 'YES'){
										if(inn.spells.length > 0) {
											cell.innerHTML = 'SPELL-' + inn.spells[inn.spells.length-1].spellNumber + "<br />" + 
											'(' + inn.spells[inn.spells.length-1].runs + '-' + inn.spells[inn.spells.length-1].wickets+ ')';
										} else {
											cell.innerHTML = '';
										}
									}
								});
								break;
							case 2:
								dataToProcess.inning.forEach(function(inn,index,arr){
									cell.innerHTML = 'Last 30 Balls:-' ;
								});
								break;
							/*case 3:
								cell.style.textAlign = "center";
								cell.style.fontWeight = "900";
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.inningNumber == 1 && inn.isCurrentInning == 'NO'){
										for(var key in inn.stats){
											if(key == 'COMPARE' + inn.inningNumber){
												cell.innerHTML = inn.stats[key] ;
											}
										}
									}
								});
								break;
							case 4:
								cell.style = "background: black ; color:#FFFFFF";
								dataToProcess.inning.forEach(function(inn,index,arr){
									for(var key in inn.stats){
										if(inn.inningNumber == 2 && inn.isCurrentInning == 'YES'){
											cell.innerHTML = 'at this stage' + "<br />" + "Over - " +  inn.stats[key] ;
											cell.style.textAlign = "center";
										}		
									}							
								});
								break;
							case 5:
								cell.style.textAlign = "center";
								cell.style.fontWeight = "900";
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.inningNumber == 2 && inn.isCurrentInning == 'YES'){
										cell.innerHTML = inn.totalRuns + '-' + inn.totalWickets ;
									}
								});
								break;*/
							}
						break;
					/*case 4:
						//cell.style.backgroundColor = "silver";
						//row.style.fontWeight = "900";
						dataToProcess.inning.forEach(function(inn,index,arr){
							if(inn.inningNumber == 2 && inn.isCurrentInning == 'YES'){
								for(var key in inn.stats){
									if(key == "INNING_STATUS"){
										row.innerHTML = inn.stats[key]
									}
								}
							}
						});
						break;*/
					case 5:
						switch(j){
							case 1:
								cell.style = "background:green "
								cell.style.borderLeft = "thick solid #C0C0C0";
								cell.style.borderTop = "thick solid #C0C0C0";
								cell.style.borderBottom = "thick solid #C0C0C0";
								break;
							case 2:
								cell.innerHTML = 'BATSMAN';
								cell.style = "background: green ; color: #FFFFFF";
								cell.style.textAlign = "center";
								cell.style.fontWeight = "700";
								cell.style.borderTop = "thick solid #C0C0C0";
								cell.style.borderBottom = "thick solid #C0C0C0";
								break;
							case 3:
								cell.style = "background: green";
								cell.style.borderTop = "thick solid #C0C0C0";
								cell.style.borderRight = "thick solid #C0C0C0";
								cell.style.borderBottom = "thick solid #C0C0C0";
								break;
							case 4:
								cell.innerHTML = 'BOWLER';
								cell.style = "background: blue ; color: #FFFFFF";
								cell.style.textAlign = "center";
								cell.style.fontWeight = "700";
								cell.style.borderTop = "thick solid #C0C0C0";
								cell.style.borderRight = "thick solid #C0C0C0";
								cell.style.borderBottom = "thick solid #C0C0C0";
								break;
						}
						break;
					case 6:
						cell.style = "background: green ; color: #FFFFFF";
						cell.style.textAlign = "center";
						cell.style.fontWeight = "700";
						switch(j){
							case 1:
								cell.style.borderLeft = "thick solid #C0C0C0";
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.isCurrentInning == 'YES'){
										inn.battingCard.forEach(function(bc,index,arr1){
											if(bc.status == 'NOT OUT' && bc.onStrike == 'YES'){
												cell.innerHTML = bc.player.surname + '*' + "<br />" + bc.runs +'('+bc.balls+')'+ "<br />" + bc.strikeRate +"<br />" + bc.fours + '/' + bc.sixes;
											}
										});
									}
								});
								break;
							case 2:
								cell.innerHTML ='Name' + "<br />" + 'Runs' + "<br />" + 'Strike Rate' + "<br />" + '4s/6s';
								break;
							case 3:
								cell.style.borderRight = "thick solid #C0C0C0";
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.isCurrentInning == 'YES'){
										inn.battingCard.forEach(function(bc,index,arr1){
											if(bc.status == 'NOT OUT' && bc.onStrike == 'NO'){
												cell.innerHTML = bc.player.surname + "<br />" + bc.runs +'('+bc.balls+')'+ "<br />" + bc.strikeRate + "<br />" + bc.fours + '/' + bc.sixes;
											}
										});
									}
								});
								break;
							case 4:
								cell.style = "background: blue ; color: #FFFFFF ";
								cell.style.textAlign = "center";
								cell.style.fontWeight = "700";
								cell.style.borderRight = "thick solid #C0C0C0";
								cell.style.borderBottom = "thick solid #C0C0C0";
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.isCurrentInning == 'YES'){
										inn.bowlingCard.forEach(function(boc,index,arr2){
											if(boc.status == 'CURRENTBOWLER'){
												cell.innerHTML = boc.player.surname + "<br />" + boc.wickets + '-' + boc.runs + '(' + boc.overs + '.' + boc.balls + ')' + "<br />" + 'Dot Balls:' + boc.dots + "<br />" + 'Economy:' + boc.economyRate;			
											}
											else if(boc.status == 'LASTBOWLER'){
												cell.innerHTML = boc.player.surname + "<br />" + boc.wickets + '-' + boc.runs + '(' + boc.overs + '.' + boc.balls + ')' + "<br />" + 'Dot Balls:' + boc.dots + "<br />" + 'Economy:' + boc.economyRate;		
											}
										});
									}
								});
								break;
						}
						break;
					case 7:
						cell.style = "background: yellow";
						cell.style.textAlign = "center";
						cell.style.fontWeight = "700";
						switch(j){
							case 1:
								cell.style.borderLeft = "thick solid #C0C0C0";
								cell.style.borderTop = "thick solid #C0C0C0";
								cell.style.borderBottom = "thick solid #C0C0C0";
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.isCurrentInning == 'YES'){
										if(inn.partnerships.length > 0) {
											cell.innerHTML = inn.partnerships[inn.partnerships.length-1].firstBatterRuns + '(' + inn.partnerships[inn.partnerships.length-1].firstBatterBalls + ')';
										} else {
											cell.innerHTML = '';
										}
									}
								});
								break;
							case 2:
								cell.style.borderTop = "thick solid #C0C0C0";
								cell.style.borderBottom = "thick solid #C0C0C0";
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.isCurrentInning == 'YES'){
										inn.partnerships.forEach(function(ps,index,arr4){
											cell.innerHTML = 'Partnership Runs' + "<br />" + ps.totalRuns + '(' + ps.totalBalls + ')';
										});
									}
								});
								break;
							case 3:
								cell.style.borderTop = "thick solid #C0C0C0";
								cell.style.borderRight = "thick solid #C0C0C0";
								cell.style.borderBottom = "thick solid #C0C0C0";
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.isCurrentInning == 'YES'){
										if(inn.partnerships.length > 0) {
											cell.innerHTML = inn.partnerships[inn.partnerships.length-1].secondBatterRuns + '(' + inn.partnerships[inn.partnerships.length-1].secondBatterBalls + ')';
										} else {
											cell.innerHTML = '';
										}
									}
								});
								break;
							case 4:
								cell.style= "background: linear-gradient(to top, gray 50%, black 50%); color:#FFFFFF"
								cell.style.fontWeight = "700";
								cell.style.borderRight = "thick solid #C0C0C0";
								cell.style.borderBottom = "thick solid #C0C0C0";
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.isCurrentInning == 'YES'){
										cell.innerHTML = 'Extras-' + inn.totalExtras + "<br />" + '(' + 'WD:' + inn.totalWides + ' NB:' + inn.totalNoBalls + ' B:' + inn.totalByes + ' LB:' + inn.totalLegByes  + ' Pen:' + inn.totalPenalties + ')';
									}
								});
								break;
						}
						break;
					case 8:
						cell.style.fontWeight = "700";
						switch(j){
							case 1:
									cell.innerHTML = 'Last Wickets:';
									cell.style = "background: black ; color: #FFFFFF";
									cell.style.border = "thick solid #C0C0C0";
								break;
							case 2:
								cell.style.border = "thick solid #C0C0C0";
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.isCurrentInning == 'YES'){
										inn.battingCard.forEach(function(bc,index,arr1){
											if(inn.fallsOfWickets.length > 0){
												if(inn.fallsOfWickets[inn.fallsOfWickets.length - 1].fowPlayerID == bc.playerId) {
													cell.innerHTML = bc.player.surname + ' ' + bc.runs + '(' + bc.balls + ')' + " " + bc.howOutText;
												}
											}
										});
									}
								});
								break;
						}
						break;
					case 9:
						switch(j){
							case 1:
									cell.innerHTML = 'F.O.W:';
									cell.style = "background: black ; color: #FFFFFF";
									cell.style.fontWeight = "700";
									cell.style.border = "thick solid #C0C0C0";
								break;
							case 2: case 3: case 4: case 5: case 6: case 7: case 8: case 9: case 10: case 11:
								cell.style = "background: black ; color: #FFFFFF";
								cell.style.fontWeight = "600";
								cell.style.border = "thick solid #C0C0C0"
								cell.innerHTML = j - 1;
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
									cell.style = "background: black ; color: #FFFFFF";
									cell.style.fontWeight = "700";
									cell.style.border = "thick solid #C0C0C0";
								});
								break;
							case 2: case 3: case 4: case 5: case 6: case 7: case 8: case 9: case 10: case 11:
								cell.style.border = "thick solid #C0C0C0";
								cell.style.fontWeight = "600";
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.inningNumber == 1){
										if(inn.fallsOfWickets.length >= j-1){
											cell.innerHTML = inn.fallsOfWickets[j-2].fowRuns + '(' + inn.fallsOfWickets[j-2].fowOvers + '.' + inn.fallsOfWickets[j-2].fowBalls + ')' ;
										}
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
									cell.style = "background: black ; color: #FFFFFF";
									cell.style.fontWeight = "700";
									cell.style.border = "thick solid #C0C0C0";
								});
								break;
							case 2: case 3: case 4: case 5: case 6: case 7: case 8: case 9: case 10: case 11:
								cell.style = "background: black ; color: #FFFFFF";
								cell.style.fontWeight = "600";
								cell.style.border = "thick solid #C0C0C0"
								dataToProcess.inning.forEach(function(inn,index,arr){
									if(inn.inningNumber == 2){
										if(inn.fallsOfWickets.length >= j-1){
											cell.innerHTML = inn.fallsOfWickets[j-2].fowRuns + '(' + inn.fallsOfWickets[j-2].fowOvers + '.' + inn.fallsOfWickets[j-2].fowBalls + ')' ;
										}
									}
								});
								break;
						}
						break;
					}
				}
			}
//			$('#match_file_timestamp').attr('value',dataToProcess.match_file_timestamp);
		}
		$('#fruit_captions_div').append(table);
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