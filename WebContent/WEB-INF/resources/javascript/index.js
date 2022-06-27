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
		
		var table_head,table_bat,table_score,table_detail,table_Bowl,table_Other,table_Other1,table_PS,table_fow,tbody,row,cell,count;
		
		$('#fruit_captions_div').empty();
		
		if(dataToProcess) {
			
			table_head = document.createElement('table');
			table_head.style = 'width:98%; margin-left:1%;';
			table_head.setAttribute('class', 'table table-bordered');
			tbody = document.createElement('tbody');
			table_head.appendChild(tbody);
			
			for (var i = 1; i <= 1; i++){
				row = tbody.insertRow(tbody.rows.length);
				switch(i){
					case 1:
						row.style="background-color: #3074b4 ; color: #FFFFFF; font-size:25px; font-weight: bold;";
						row.style.textAlign = "center";
						row.innerHTML = dataToProcess.homeTeam.fullname + " v " + dataToProcess.awayTeam.fullname +' - '+ dataToProcess.tournament + ' ('+dataToProcess.matchIdent + ')';
						break;
				}
			}
			
			table_bat = document.createElement('table');
			table_bat.style = 'width:25%; margin-left:1%;';
			table_bat.setAttribute('class', 'table table-bordered');
			tbody = document.createElement('tbody');
			table_bat.appendChild(tbody);

			for (var i = 1; i <= 4; i++){
				row = tbody.insertRow(tbody.rows.length);
				row.style = "background: #3074b4; color: #FFFFFF; "
				switch(i){
					case 1: case 2: case 3: case 4:
						count = 6;
						break;
				}
				for (var j = 1; j <= count; j++){
					cell = row.insertCell(j-1);
					switch (i){
						case 1:
							cell.style = "text-align:center;";
							cell.style.fontWeight = "900";
							switch(j){
								case 1:
									break;
								case 2:
									cell.innerHTML = 'RUNS';
									break;
								case 3:
									cell.innerHTML = '4s/6s';
									break;
								case 4:
									cell.innerHTML = 'S/R';
									break;
								case 5:
									cell.innerHTML = 'MINS';
									break;
								case 6:
									dataToProcess.inning.forEach(function(inn,index,arr){
										if(inn.isCurrentInning == 'YES'){
											inn.partnerships.forEach(function(ps,index,arr4){
												cell.innerHTML = 'PARTNERSHIP ' + ps.totalRuns + '(' + ps.totalBalls + ')';
											});
										}
									});
									break;
							}
							break;
						case 2:
							cell.style = 'text-align:center';
							dataToProcess.inning.forEach(function(inn,index,arr){
								if(inn.isCurrentInning == 'YES'){
									inn.battingCard.forEach(function(bc,index,arr1){
										if(bc.status == 'NOT OUT' && bc.onStrike == 'YES'){
											switch(j){
												case 1:
													cell.innerHTML = bc.player.surname + '*';
													cell.style.fontWeight = "900";
													break;
												case 2:
													cell.innerHTML = bc.runs +'('+bc.balls+')';
													break;
												case 3:
													cell.innerHTML = bc.fours + '/' + bc.sixes;
													break;
												case 4:
													cell.innerHTML = bc.strikeRate;
													break;
												case 5:
													if(bc.seconds > '60'){
														cell.innerHTML = Math.floor(bc.seconds / 60);
													}else{
														cell.innerHTML = bc.seconds;
													}
													break;
												case 6:
													if(inn.partnerships.length > 0) {
														if(bc.playerId == inn.partnerships[inn.partnerships.length-1].firstBatterNo){
															cell.innerHTML = inn.partnerships[inn.partnerships.length-1].firstBatterRuns + '(' + inn.partnerships[inn.partnerships.length-1].firstBatterBalls + ')';
														}
														else{
															cell.innerHTML = inn.partnerships[inn.partnerships.length-1].secondBatterRuns + '(' + inn.partnerships[inn.partnerships.length-1].secondBatterBalls + ')';
														}
														
													} else {
														cell.innerHTML = '';
													}
													break;
												
											}
										}
									});
								}				
							});		
							break;
						case 3:
							cell.style = 'text-align:center';
							dataToProcess.inning.forEach(function(inn,index,arr){
								if(inn.isCurrentInning == 'YES'){
									inn.battingCard.forEach(function(bc,index,arr1){
										if(bc.status == 'NOT OUT' && bc.onStrike == 'NO'){
											switch(j){
												case 1:
													cell.innerHTML = bc.player.surname;
													cell.style.fontWeight = "900";
													break;
												case 2:
													cell.innerHTML = bc.runs +'('+bc.balls+')';
													break;
												case 3:
													cell.innerHTML = bc.fours + '/' + bc.sixes;
													break;
												case 4:
													cell.innerHTML = bc.strikeRate;
													break;
												case 5:
													if(bc.seconds > '60'){
														cell.innerHTML = Math.floor(bc.seconds / 60);
													}else{
														cell.innerHTML = bc.seconds;
													}
													break;
												case 6:
													if(inn.partnerships.length > 0) {
														if(bc.playerId == inn.partnerships[inn.partnerships.length-1].firstBatterNo){
															cell.innerHTML = inn.partnerships[inn.partnerships.length-1].firstBatterRuns + '(' + inn.partnerships[inn.partnerships.length-1].firstBatterBalls + ')';
														}
														else{
															cell.innerHTML = inn.partnerships[inn.partnerships.length-1].secondBatterRuns + '(' + inn.partnerships[inn.partnerships.length-1].secondBatterBalls + ')';
														}
														
													} else {
														cell.innerHTML = '';
													}
													break;
												
											}
										}
									});
								}				
							});		
							break;
						case 4:
							switch(j){
								case 1:
									cell.style = "background: white; color: Black;"
									cell.style.fontWeight = "900";
									cell.innerHTML = 'LAST WICKET';
									break;
								case 2: case 3: case 4:
									cell.style = "background: white; color: Black;"
									dataToProcess.inning.forEach(function(inn,index,arr){
										if(inn.isCurrentInning == 'YES'){
											inn.battingCard.forEach(function(bc,index,arr1){
												if(inn.fallsOfWickets.length > 0){
													if(inn.fallsOfWickets[inn.fallsOfWickets.length - 1].fowPlayerID == bc.playerId) {
														switch(j){
															case 2:
																cell.innerHTML = bc.player.surname ;
																break;
															case 3:
																cell.innerHTML = bc.runs + '(' + bc.balls + ')';
																break;
															case 4:
																cell.innerHTML = bc.howOutText;
																break;
														}
													}
												}
											});
										}
									});
									break;
								case 5:
									cell.style = "background: #08b4f4; color: Black;"
									cell.style.fontWeight = "900";
									dataToProcess.inning.forEach(function(inn,index,arr){
										if(inn.isCurrentInning == 'YES'){
											cell.innerHTML = 'Extras: ' + inn.totalExtras ;
										}
									});
									break;
								case 6:
									cell.style = "background: #08b4f4; color: Black;"
									dataToProcess.inning.forEach(function(inn,index,arr){
										if(inn.isCurrentInning == 'YES'){
											cell.innerHTML ='(' + 'WD:' + inn.totalWides + ' NB:' + inn.totalNoBalls + ' B:' + inn.totalByes + ' LB:' + inn.totalLegByes  + ' Pen:' + inn.totalPenalties + ')';
										}
									});
									break;
							}
							break;
					}
				}
			}
			
			table_score = document.createElement('table');
			table_score.style = 'width:20%; margin-left:1%; margin-right:1%;';
			table_score.setAttribute('class', 'table table-bordered');
			tbody = document.createElement('tbody');
			table_score.appendChild(tbody);

			for (var i = 1; i <= 2; i++){
				row = tbody.insertRow(tbody.rows.length);
				switch(i){
					case 1:
						row.style="background-color: #fff4cc; font-size:40px; font-weight: bold;";
						row.style.textAlign = "center";
						dataToProcess.inning.forEach(function(inn,index,arr){
								if(inn.isCurrentInning == 'YES'){
									if(inn.battingTeamId == dataToProcess.homeTeamId){	
										row.innerHTML = dataToProcess.homeTeam.shortname + "<br />" + inn.totalRuns + '-' + inn.totalWickets ;
									}
									else {
										row.innerHTML = dataToProcess.awayTeam.shortname + "<br />" + inn.totalRuns + '-' + inn.totalWickets ;
									}
									
									switch(dataToProcess.matchType){
										case 'DT20': case 'IT20':
											for(var key in inn.stats){
												if(key == 'POWERPLAY'){
													if(inn.stats[key] == 'P1'){
														row.innerHTML = row.innerHTML + '(P)';
													}else{
														row.innerHTML = row.innerHTML + '';
													}
												}
											}
											break;
											
										case 'ODI':
											for(var key in inn.stats){
												if(key == 'POWERPLAY'){
													row.innerHTML = row.innerHTML + '(' + inn.stats[key] + ')';
												}
											}
											break;
									} 
									
									for(var key in inn.stats){
										if(key == 'OVER' + inn.inningNumber){
											row.innerHTML = row.innerHTML + "<br />" + inn.stats[key] + ' Overs';
										}
									}
								}
							});
						break;
					case 2:
						row.style="background-color: #fffc04; font-size:18px; font-weight: 700;"
						dataToProcess.inning.forEach(function(inn,index,arr){
							if(inn.isCurrentInning == 'YES'){
								row.innerHTML = 'CURRENT RUN RATE :' + inn.runRate;
							}
							if(inn.inningNumber == 2 && inn.isCurrentInning == 'YES'){
								if(dataToProcess.inning[0].totalRuns > dataToProcess.inning[1].totalRuns){
									for(var key in inn.stats){
										if(key == 'Req_RR'){
											row.innerHTML = 'CURRENT RUN RATE :' + inn.runRate + "<br />" + 'REQUIRED RUN RATE : ' + inn.stats[key];
										}
									}
								}
								else{
									row.innerHTML = 'CURRENT RUN RATE :' + inn.runRate + "<br />" + 'REQUIRED RUN RATE : 0.00'
								}
							}
						});
						break;
				}
			}
			
			table_detail = document.createElement('table');
			table_detail.style = 'width:25%;';
			table_detail.setAttribute('class', 'table table-bordered');
			tbody = document.createElement('tbody');
			table_detail.appendChild(tbody);
			
			for (var i = 1; i <= 4; i++){
				row = tbody.insertRow(tbody.rows.length);
				switch(i){
					case 1: case 2:  case 3:  case 4:
						count = 3;
						break;
				}
				for (var j = 1; j <= count; j++){
					cell = row.insertCell(j-1);
					switch(i){
						case 1:
							row.style = "background: #ffdc64 ;";
							
							switch(j){
								case 1:
									cell.style = "font-weight: 700;";
									cell.style.textAlign = "center";
									dataToProcess.inning.forEach(function(inn,index,arr){
										if(inn.inningNumber == 1){
											for(var key in inn.stats){
												if(key == 'OVER' + inn.inningNumber){
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
								case 3:
									cell.style = "font-weight: 700;";
									cell.style.textAlign = "center";
									dataToProcess.inning.forEach(function(inn,index,arr){
										if(inn.inningNumber == 2){
											for(var key in inn.stats){
												if(key == 'OVER'+ inn.inningNumber){
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
							}
							break;
						case 2:
							cell.style = "background: #f8ccac ;font-weight: 600; ";
							cell.style.textAlign = "center";
							switch(j){
								case 1:
									dataToProcess.inning.forEach(function(inn,index,arr){
										if(inn.inningNumber == 1){
											if(inn.battingTeamId == dataToProcess.homeTeamId){	
												cell.innerHTML = inn.totalFours + '/' + inn.totalSixes;
											}
											else if(inn.battingTeamId == dataToProcess.awayTeamId){
												cell.innerHTML = inn.totalFours + '/' + inn.totalSixes;
											}
											
											for(var key in inn.stats){
												if(key == 'DOTBALLS' + inn.inningNumber){
													cell.innerHTML = cell.innerHTML + "<br />" + inn.stats[key];
												}
											}
										}
									});
									break
								case 2:
									cell.innerHTML = '4s/6s' + "<br />" +'DOTS';
									cell.style = "background: #b0d48c; font-weight: 700;";
									cell.style.textAlign = "center";
									break;
								case 3:
									dataToProcess.inning.forEach(function(inn,index,arr){
										if(inn.inningNumber == 2){
											if(inn.battingTeamId == dataToProcess.homeTeamId){	
												cell.innerHTML = inn.totalFours + '/' + inn.totalSixes;
											}
											else if(inn.battingTeamId == dataToProcess.awayTeamId){
												cell.innerHTML = inn.totalFours + '/' + inn.totalSixes;
											}
											
											for(var key in inn.stats){
												if(key == 'DOTBALLS'  + inn.inningNumber){
													cell.innerHTML = cell.innerHTML + "<br />" + inn.stats[key];
												}
											}
										}
									});
									break;
							}
							break;
						case 3:
							cell.style = "background: #f8ccac; font-weight: 600;";
							cell.style.textAlign = "center";
							switch(j){
								case 1:
									dataToProcess.inning.forEach(function(inn,index,arr){
										if(inn.inningNumber == 1){
											for(var key in inn.stats){
												if(key == 'COMPARE'){
													cell.innerHTML = inn.stats[key] ;
												}
											}
										}
									});
									break;
								case 2:
									cell.innerHTML = 'AT THIS STAGE';
									cell.style = "background: #b0d48c; font-weight: 700;";
									cell.style.textAlign = "center";		
									break;
								case 3:
									dataToProcess.inning.forEach(function(inn,index,arr){
										if(inn.inningNumber == 2 && inn.isCurrentInning == 'YES'){
											cell.innerHTML = inn.totalRuns + '-' + inn.totalWickets ;
										}
									});
									break;
							}
							break;	
						case 4:
							cell.style = "background: #f8ccac; font-weight: 600;";
							cell.style.textAlign = "center";
							switch(j){
								case 1:
									dataToProcess.inning.forEach(function(inn,index,arr){
										if(inn.inningNumber == 1){
											cell.innerHTML = inn.totalExtras + "<br />" + dataToProcess.reviewsPerTeam ;
										}
									});
									break;
								case 2:
									cell.innerHTML = 'EXTRAS' + "<br />" + 'REVIEWS';
									cell.style = "background: #b0d48c; font-weight: 700;";
									cell.style.textAlign = "center";
									break;
								case 3:
									dataToProcess.inning.forEach(function(inn,index,arr){
										if(inn.inningNumber == 2){
											cell.innerHTML = inn.totalExtras + "<br />" + dataToProcess.reviewsPerTeam;
										}
									});
									break;
							}
							break;			
					}
				}
			}
			
			table_Bowl = document.createElement('table');
			table_Bowl.style = 'width:30%; margin-left:1%;';
			table_Bowl.setAttribute('class', 'table table-bordered');
			tbody = document.createElement('tbody');
			table_Bowl.appendChild(tbody);
			
			for (var i = 1; i <= 2; i++){
				row = tbody.insertRow(tbody.rows.length);
				row.style = "background: #3074b4; color: #FFFFFF;"
				switch(i){
					case 1: case 2:
						count = 5;
						break;
				}
				for (var j = 1; j <= count; j++){
					cell = row.insertCell(j-1);
					switch (i){
						case 1:
							cell.style = 'text-align:center';
							cell.style.fontWeight = "900";
							switch(j){
								case 1:
									break;
								case 2:
									cell.innerHTML = 'FIG';
									break;
								case 3:
									cell.innerHTML = 'OVERS';
									break;
								case 4:
									cell.innerHTML = 'DOTS';
									break;
								case 5:
									cell.innerHTML = 'ECON';
									break;
							}
							break;
						case 2:
							cell.style = 'text-align:center';
							dataToProcess.inning.forEach(function(inn,index,arr){
								if(inn.isCurrentInning == 'YES'){
									inn.bowlingCard.forEach(function(boc,index,arr2){
										if(boc.status == 'CURRENTBOWLER' || boc.status == 'LASTBOWLER'){
											switch(j){
												case 1:
													cell.innerHTML = boc.player.surname;
													break;
												case 2:
													cell.innerHTML = boc.wickets + '-' + boc.runs;
													break;
												case 3:
													cell.innerHTML = boc.overs + '.' + boc.balls;
													break;
												case 4:
													cell.innerHTML = boc.dots;
													break;
												case 5:
													cell.innerHTML = boc.economyRate;
													break;
											}
										}
									});
								}
							});
							break;
					}
				}
			}
			
			table_Other = document.createElement('table');
			table_Other.style = 'width:14%; margin-left:1%; margin-right:1%;';
			table_Other.setAttribute('class', 'table table-bordered');
			tbody = document.createElement('tbody');
			table_Other.appendChild(tbody);

			for (var i = 1; i <= 3; i++){
				row = tbody.insertRow(tbody.rows.length);
				switch(i){
					case 1:
						row.style="background-color: Red; color: #FFFFFF;";
						row.style.textAlign = "center";
						dataToProcess.inning.forEach(function(inn,index,arr){
								row.innerHTML = 'INFORMATIVE POP-UP';
						});
						break;
					case 2:
						row.style="background-color: white ;";
						row.style.textAlign = "center";
						dataToProcess.inning.forEach(function(inn,index,arr){
								row.innerHTML = 'Speed';
						});
						break;
					case 3:
						row.style="background-color: white ;";
						row.style.textAlign = "center";
						dataToProcess.inning.forEach(function(inn,index,arr){
								row.innerHTML = 'KPH';
						});
						break;
				}
			}
			
			table_Other1 = document.createElement('table');
			table_Other1.style = 'width:35%; margin-left:1%; margin-right:1%;';
			table_Other1.setAttribute('class', 'table table-bordered');
			tbody = document.createElement('tbody');
			table_Other1.appendChild(tbody);

			for (var i = 1; i <= 3; i++){
				row = tbody.insertRow(tbody.rows.length);
				switch(i){
					case 1:
						row.style="background-color: #f8b484 ; font-size:25px; font-weight: bold;";
						row.style.textAlign = "center";
						dataToProcess.inning.forEach(function(inn,index,arr){
							if(inn.inningNumber == 1 && inn.isCurrentInning == 'YES'){
								for(var key in inn.stats){
									if(key == 'TOSS'){
										row.innerHTML = inn.stats[key];
									}
								}		
							}
							if(inn.inningNumber == 2 && inn.isCurrentInning == 'YES'){
								for(var key in inn.stats){
									if(key == 'INNING_STATUS'){
										row.innerHTML = inn.stats[key];
									}
								}
							}	
						});
						break;
					case 2:
						row.style="background-color: #c8eccc; font-size:20px;  font-weight: 600; ";
						dataToProcess.inning.forEach(function(inn,index,arr){
							if(inn.isCurrentInning == 'YES'){
								inn.bowlingCard.forEach(function(boc,index,arr2){
									for(var key in inn.stats){
										if(key == 'ThisOver'){
											if(boc.status == 'CURRENTBOWLER'){
												row.innerHTML = 'This Over:-'  + inn.stats[key];
											}
											else if(boc.status == 'LASTBOWLER'){
												row.innerHTML = 'This Over:-' + inn.stats[key];
											}
										}
									}
									for(var key in inn.stats){
										if(key == 'OVER'){
											if(boc.status == 'CURRENTBOWLER'){
												row.innerHTML = row.innerHTML + "<br />" + inn.stats[key] ;
											}
											else if(boc.status == 'LASTBOWLER'){
												row.innerHTML = row.innerHTML + "<br />" + inn.stats[key] ;
											}
										}
									}
								});
							}
						});					
						break;
					case 3:
						row.style="background-color: #b0d48c; font-size:20px; font-weight: 600; margin-left:1%;";
						dataToProcess.inning.forEach(function(inn,index,arr){
							if(inn.isCurrentInning == 'YES'){
								for(var key in inn.stats){
									if(key == 'BOUNDARY'){
										row.innerHTML = 'Ball Since Last Boundary:-' + inn.stats[key];
									}
								}
							}
						});
						break;
				}
			}
			
			table_PS = document.createElement('table');
			table_PS.style = 'width:20%; margin-left:1%;';
			table_PS.setAttribute('class', 'table table-bordered');
			tbody = document.createElement('tbody');
			table_PS.appendChild(tbody);

			for (var i = 1; i <= 2; i++){
				row = tbody.insertRow(tbody.rows.length);
				row.style="background-color: #ffe49c ; ";
				switch(i){
					case 1: case 2:
						count = 5;
						break;
				}
				for (var j=1;j<=count;j++){
					cell = row.insertCell(j-1);
					switch(i){
						case 1:
							switch(j){
								case 1:
									cell.innerHTML = 'Projected Score';
									cell.style.fontWeight = "700";
									break;
								case 2 : case 3: case 4: case 5:
									cell.style.fontWeight = "600";
									dataToProcess.inning.forEach(function(inn,index,arr){
										if(inn.isCurrentInning == 'YES'){
											for(var key in inn.stats){
												if(key == 'PS'){
													const myArray = inn.stats[key].split(",");
													switch(j){
														case 2:
															cell.innerHTML = myArray[1] ;
															break;
														case 3:
															cell.innerHTML = myArray[3] ;
															break;
														case 4:
															cell.innerHTML = myArray[5] ;
															break;
														case 5:
															cell.innerHTML = myArray[7] ;
															break;
													}
												}
											}
										}
									});
									break;
							}
							break;
						case 2:
							switch(j){
								case 2 : case 3: case 4: case 5:
									cell.style.fontWeight = "600";
									dataToProcess.inning.forEach(function(inn,index,arr){
										if(inn.isCurrentInning == 'YES'){
											for(var key in inn.stats){
												if(key == 'PS'){
													const myArray = inn.stats[key].split(",");
													switch(j){
														case 2:
															cell.innerHTML = myArray[0] ;
															break;
														case 3:
															cell.innerHTML = myArray[2] ;
															break;
														case 4:
															cell.innerHTML = myArray[4] ;
															break;
														case 5:
															cell.innerHTML = myArray[6] ;
															break;
													}
												}
											}
										}
									});
									break;
							}
							break;
					}
				}
			}
			
				table_fow = document.createElement('table');
			table_fow.style = 'width:70%; margin-left:1%;';
			table_fow.setAttribute('class', 'table table-bordered');
			tbody = document.createElement('tbody');
			table_fow.appendChild(tbody);

			for (var i = 1; i <= 3; i++){
				row = tbody.insertRow(tbody.rows.length);
				row.style = "background: #fff4cc ;"
				switch(i){
					case 1: case 2: case 3:
						count = 11;
						break;
				}
				for (var j = 1; j <= count; j++){
					cell = row.insertCell(j-1);
					switch(i){
						case 1:
							switch(j){
							case 1:
								cell.innerHTML = 'Falls Of Wickets:';
								cell.style = "background: #08b454; color: #FFFFFF; width:130px;";
								cell.style.fontWeight = "700";
								break;
							case 2: case 3: case 4: case 5: case 6: case 7: case 8: case 9: case 10: case 11:
								cell.style = "background: #ffc404; width:130px;";
								cell.style.fontWeight = "600";
								cell.innerHTML = j - 1;
								break;
							}
							break;
						case 2:
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
									cell.style = "background: #08b454; color: #FFFFFF; width:130px;";
									cell.style.fontWeight = "700";
								});
								break;
							case 2: case 3: case 4: case 5: case 6: case 7: case 8: case 9: case 10: case 11:
								cell.style = "background: #ffc404 ; width:130px;";
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
						case 3:
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
									cell.style = "background: #08b454; color: #FFFFFF; width:130px;";
									cell.style.fontWeight = "700";
								});
								
								
								break;
							case 2: case 3: case 4: case 5: case 6: case 7: case 8: case 9: case 10: case 11:
								cell.style = "background: #ffc404; width:130px;";
								cell.style.fontWeight = "600";
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
			
			
			
		}
		$('#fruit_captions_div').append(table_head);
		$('#fruit_captions_div').append(table_bat);
		$('#fruit_captions_div').append(table_score);
		$('#fruit_captions_div').append(table_detail);
		$('#fruit_captions_div').append(table_Bowl);
		$('#fruit_captions_div').append(table_Other);
		$('#fruit_captions_div').append(table_Other1);
		$('#fruit_captions_div').append(table_PS);
		$('#fruit_captions_div').append(table_fow);
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