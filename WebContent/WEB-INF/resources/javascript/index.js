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
				if(data){
					addItemsToList(whatToProcess,data);
					document.getElementById('matchFileTimeStamp').value = data.setup.matchFileTimeStamp;
				}
				/*if($('#matchFileTimeStamp').val() != data.setup.matchFileTimeStamp) {
					addItemsToList(whatToProcess,data);
					document.getElementById('matchFileTimeStamp').value = data.setup.matchFileTimeStamp;
				}*/
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
		
		var table_head,table_bat,table_score,table_detail,table_Bowl,table_Other,table_Other1,table_PS,table_fow,tbody,row,cell,count,table_BC,table_BOC;
		
		$('#fruit_captions_div').empty();
		
		if(dataToProcess) {
			
			table_head = document.createElement('table');
			table_head.style = 'table-layout:fixed;width:100%';
			table_head.style.marginTop = "-16px";
			table_head.setAttribute('class', 'table table-bordered');
			tbody = document.createElement('tbody');
			table_head.appendChild(tbody);
			
			for (var i = 1; i <= 1; i++){
				row = tbody.insertRow(tbody.rows.length);
				switch(i){
					case 1:
						row.style="background-color: #000000 ; color: #FFFF00; font-size:25px; font-weight: bold;";
						row.style.fontFamily = 'Rockwell';
						row.style.textAlign = "center";
						row.innerHTML = dataToProcess.setup.homeTeam.teamName1 + " v " + dataToProcess.setup.awayTeam.teamName1 +' - '+ dataToProcess.setup.tournament +
						 ' ('+dataToProcess.setup.matchIdent + ')';
						break;
				}
			}
			
			table_bat = document.createElement('table');
			table_bat.style = 'table-layout:fixed;width:850px;';
			table_bat.style.height = '234px';
			table_bat.style.marginTop = "-16px";
			table_bat.style.marginRight = "-12px";
			table_bat.setAttribute('class', 'table table-bordered');
			tbody = document.createElement('tbody');
			table_bat.appendChild(tbody);

			for (var i = 1; i <= 4; i++){
				row = tbody.insertRow(tbody.rows.length);
				row.style = "background: #D8E4BC; color: #0A0B0A; border-color: Black;border-width: 3px;font-weight: bold;"
				row.style.fontFamily = 'Rockwell';
				var player1_found = false;
				var player2_found = false;
				switch(i){
					case 1: case 2: case 3: case 4:
						count = 6;
						break;
				}
				for (var j = 1; j <= count; j++){
					cell = row.insertCell(j-1);
					switch (i){
						case 1:
							cell.style = "text-align:center;border-color: Black;border-width: 3px;font-weight: bold;";
							cell.style.fontFamily = 'Rockwell';
							cell.style.fontWeight = "900";
							switch(j){
								case 1:
									cell.innerHTML = 'BATTER';
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
									cell.innerHTML = 'DOTS';
									break;
								case 6:
									cell.style = "text-align:center;border-color: Black;border-width: 3px;font-size: 15px;";
									cell.style.fontFamily = 'Rockwell';
									cell.style.fontWeight = "750";
									dataToProcess.match.inning.forEach(function(inn,index,arr){
										if(inn.isCurrentInning == 'YES'){
											inn.partnerships.forEach(function(ps,index,arr4){
												cell.innerHTML = 'PARTNERSHIP <br>' + ps.totalRuns + ' (' + ps.totalBalls + ')';
											});
										}
									});
									break;
							}
							break;
						case 2:
							
							cell.style.fontFamily = 'Rockwell';
							dataToProcess.match.inning.forEach(function(inn,index,arr){
								if(inn.isCurrentInning == 'YES'){
									inn.battingCard.forEach(function(bc,index,arr1){
										if(bc.status == 'NOT OUT' && bc.onStrike == 'YES'){
											switch(j){
												case 1:
													cell.style="font-size:15px; font-weight: bold;border-color: Black;border-width: 3px;";
													cell.innerHTML = bc.player.ticker_name.slice(0,10) + '*';
													//cell.style.fontWeight = "600";
													break;
												case 2:
													cell.style = 'text-align:center;border-color: Black;border-width: 3px;font-weight: bold;font-size:18px;';
													cell.innerHTML = bc.runs +' ('+bc.balls+')';
													break;
												case 3:
													cell.style = 'text-align:center;border-color: Black;border-width: 3px;font-weight: bold;font-size:18px;';
													cell.innerHTML = bc.fours + '/' + bc.sixes;
													break;
												case 4:
													cell.style = 'text-align:center;border-color: Black;border-width: 3px;font-weight: bold;font-size:18px;';
													if(bc.strikeRate == 0){
														cell.innerHTML = '-';
													}else{
														cell.innerHTML = bc.strikeRate;
													}
													break;
												case 5:
													cell.style = 'text-align:center;border-color: Black;border-width: 3px;font-weight: bold;font-size:18px;';
													for(var key in inn.stats){
														if(key == 'BATSMAN1DOTS'){
															cell.innerHTML = inn.stats[key].split(',')[0];
														}
													}
													break;
												case 6:
													cell.style = 'text-align:center;border-color: Black;border-width: 3px;font-weight: bold;font-size:18px;';
													if(inn.partnerships.length > 0) {
														if(bc.playerId == inn.partnerships[inn.partnerships.length-1].firstBatterNo){
															cell.innerHTML = inn.partnerships[inn.partnerships.length-1].firstBatterRuns + ' (' + inn.partnerships[inn.partnerships.length-1].firstBatterBalls + ')';
														}
														else{
															cell.innerHTML = inn.partnerships[inn.partnerships.length-1].secondBatterRuns + ' (' + inn.partnerships[inn.partnerships.length-1].secondBatterBalls + ')';
														}
														
													} else {
														cell.innerHTML = '';
													}
													break;
												
											}
											player1_found = true;
										}
									});
									
									if(player1_found == false){
										//alert(player1_found)
										switch(j){
											case 1:
												var size = inn.fallsOfWickets.length;
												/*dataToProcess.eventFile.events.forEach(function(evnt,index,arr){
													if(evnt[evnt.length-1].eventType == 'LOG_WICKET'){
														if(evnt[evnt.length-1].eventHowOut == 'RETIRED_HURT'){
															cell.innerHTML = '-';
														}
													}
												});*/
													
												dataToProcess.setup.homeSquad.forEach(function(hs,index,arr){
												//alert(hs.playerId)
													if(inn.fallsOfWickets.length > 0){
														//alert(inn.fallsOfWickets[size - 1].playerId)
														if(inn.fallsOfWickets[size - 1].fowPlayerID == hs.playerId){
															cell.style="background: #FF0000;font-size:15px; font-weight: bold;border-color: Black;border-width: 3px;";
															cell.innerHTML = hs.ticker_name.slice(0,10);
														}
													}else{
														cell.innerHTML = '';
													}
													
												});
												dataToProcess.setup.homeOtherSquad.forEach(function(hos,index,arr){
												//alert(hs.playerId)
													if(inn.fallsOfWickets.length > 0){
														//alert(inn.fallsOfWickets[size - 1].playerId)
														if(inn.fallsOfWickets[size - 1].fowPlayerID == hos.playerId){
															cell.style="background: #FF0000;font-size:15px; font-weight: bold;border-color: Black;border-width: 3px;";
															cell.innerHTML = hos.ticker_name.slice(0,10);
														}
													}else{
														cell.innerHTML = '';
													}
													
												});
												dataToProcess.setup.homeSubstitutes.forEach(function(hsub,index,arr){
												//alert(hs.playerId)
													if(inn.fallsOfWickets.length > 0){
														//alert(inn.fallsOfWickets[size - 1].playerId)
														if(inn.fallsOfWickets[size - 1].fowPlayerID == hsub.playerId){
															cell.style="background: #FF0000;font-size:15px; font-weight: bold;border-color: Black;border-width: 3px;";
															cell.innerHTML = hsub.ticker_name.slice(0,10);
														}
													}else{
														cell.innerHTML = '';
													}
													
												});
												dataToProcess.setup.awaySquad.forEach(function(as,index,arr){
													if(inn.fallsOfWickets.length > 0){
														//alert(inn.fallsOfWickets[inn.fallsOfWickets.length - 1].playerId)
														if(inn.fallsOfWickets[size - 1].fowPlayerID == as.playerId){
															cell.style="background: #FF0000;font-size:15px; font-weight: bold;border-color: Black;border-width: 3px;";
															cell.innerHTML = as.ticker_name.slice(0,10);
														}
													}else{
														cell.innerHTML = '';
													}
													
												});
												dataToProcess.setup.awayOtherSquad.forEach(function(aos,index,arr){
													if(inn.fallsOfWickets.length > 0){
														//alert(inn.fallsOfWickets[inn.fallsOfWickets.length - 1].playerId)
														if(inn.fallsOfWickets[size - 1].fowPlayerID == aos.playerId){
															cell.style="background: #FF0000;font-size:15px; font-weight: bold;border-color: Black;border-width: 3px;";
															cell.innerHTML = aos.ticker_name.slice(0,10);
														}
													}else{
														cell.innerHTML = '';
													}
													
												});
												dataToProcess.setup.awaySubstitutes.forEach(function(asub,index,arr){
													if(inn.fallsOfWickets.length > 0){
														//alert(inn.fallsOfWickets[inn.fallsOfWickets.length - 1].playerId)
														if(inn.fallsOfWickets[size - 1].fowPlayerID == asub.playerId){
															cell.style="background: #FF0000;font-size:15px; font-weight: bold;border-color: Black;border-width: 3px;";
															cell.innerHTML = asub.ticker_name.slice(0,10);
														}
													}else{
														cell.innerHTML = '';
													}
													
												});
												break;
											case 2:
												if(inn.fallsOfWickets.length > 0){
													inn.battingCard.forEach(function(bc,index,arr){
														if(inn.fallsOfWickets[inn.fallsOfWickets.length - 1].fowPlayerID == bc.playerId){
															//alert(bc.runs +' ('+bc.balls+')')
															cell.style="background: #FF0000;font-size:18px; font-weight: bold;text-align:center;border-color: Black;border-width: 3px;";
															cell.innerHTML = bc.runs +' ('+bc.balls+')';
														}
													});
												}
												break;
											case 3:
												if(inn.fallsOfWickets.length > 0){
													inn.battingCard.forEach(function(bc,index,arr){
														if(inn.fallsOfWickets[inn.fallsOfWickets.length - 1].fowPlayerID == bc.playerId){
															cell.style="background: #FF0000;font-size:18px; font-weight: bold;text-align:center;border-color: Black;border-width: 3px;";
															cell.innerHTML = bc.fours + '/' + bc.sixes;
														}
													});
												}
												break;
											case 4:
												if(inn.fallsOfWickets.length > 0){
													inn.battingCard.forEach(function(bc,index,arr){
														if(inn.fallsOfWickets[inn.fallsOfWickets.length - 1].fowPlayerID == bc.playerId){
															if(bc.strikeRate == 0){
																cell.style="background: #FF0000;font-size:18px; font-weight: bold;text-align:center;border-color: Black;border-width: 3px;";
																cell.innerHTML = '-';
															}else{
																cell.style="background: #FF0000;font-size:18px; font-weight: bold;text-align:center;border-color: Black;border-width: 3px;";
																cell.innerHTML = bc.strikeRate;
															}
														}
													});
												}
												break;
											case 5:
												for(var key in inn.stats){
													if(key == 'BATSMAN_OUT'){
														cell.style="background: #FF0000;font-size:15px; font-weight: bold;text-align:center;border-color: Black;border-width: 3px;";
														cell.innerHTML = inn.stats[key].split(',')[0];
													}
												}
												break;
											case 6:
												if(inn.partnerships.length > 0 && inn.fallsOfWickets.length > 0) {
													if(inn.fallsOfWickets[inn.fallsOfWickets.length - 1].fowPlayerID == inn.partnerships[inn.partnerships.length-1].firstBatterNo){
														cell.style="background: #FF0000;font-size:18px; font-weight: bold;text-align:center;border-color: Black;border-width: 3px;";
														cell.innerHTML = inn.partnerships[inn.partnerships.length-1].firstBatterRuns + ' (' + inn.partnerships[inn.partnerships.length-1].firstBatterBalls + ')';
													}
													else{
														cell.style="background: #FF0000;font-size:18px; font-weight: bold;text-align:center;border-color: Black;border-width: 3px;";
														cell.innerHTML = inn.partnerships[inn.partnerships.length-1].secondBatterRuns + ' (' + inn.partnerships[inn.partnerships.length-1].secondBatterBalls + ')';
													}
													
												} else {
													cell.style="font-size:15px; font-weight: bold;text-align:center;border-color: Black;border-width: 3px;";
													cell.innerHTML = '';
												}
												break;
										}
									}
								}				
							});		
							break;
						case 3:
							cell.style = 'text-align:center; border-color: Black;border-width: 3px;font-weight: bold;';
							cell.style.fontFamily = 'Rockwell';
							dataToProcess.match.inning.forEach(function(inn,index,arr){
								if(inn.isCurrentInning == 'YES'){
									inn.battingCard.forEach(function(bc,index,arr1){
										if(bc.status == 'NOT OUT' && bc.onStrike == 'NO'){
											switch(j){
												case 1:
													cell.style="font-size:15px; font-weight: bold;border-color: Black;";
													cell.innerHTML = bc.player.ticker_name.slice(0,10);
													//cell.style.fontWeight = "900";
													break;
												case 2:
													cell.style = 'text-align:center;border-color: Black;border-width: 3px;font-weight: bold;font-size:18px;';
													cell.innerHTML = bc.runs +' ('+bc.balls+')';
													break;
												case 3:
													cell.style = 'text-align:center;border-color: Black;border-width: 3px;font-weight: bold;font-size:18px;';
													cell.innerHTML = bc.fours + '/' + bc.sixes;
													break;
												case 4:
													cell.style = 'text-align:center;border-color: Black;border-width: 3px;font-weight: bold;font-size:18px;';
													if(bc.strikeRate == 0){
														cell.innerHTML = '-';
													}else{
														cell.innerHTML = bc.strikeRate;
													}
													break;
												case 5:
													cell.style = 'text-align:center;border-color: Black;border-width: 3px;font-weight: bold;font-size:18px;';
													for(var key in inn.stats){
														if(key == 'BATSMAN2DOTS'){
															cell.innerHTML = inn.stats[key].split(',')[0];
														}
													}
													break;
												case 6:
													cell.style = 'text-align:center;border-color: Black;border-width: 3px;font-weight: bold;font-size:18px;';
													if(inn.partnerships.length > 0) {
														if(bc.playerId == inn.partnerships[inn.partnerships.length-1].firstBatterNo){
															cell.innerHTML = inn.partnerships[inn.partnerships.length-1].firstBatterRuns + ' (' + inn.partnerships[inn.partnerships.length-1].firstBatterBalls + ')';
														}
														else{
															cell.innerHTML = inn.partnerships[inn.partnerships.length-1].secondBatterRuns + ' (' + inn.partnerships[inn.partnerships.length-1].secondBatterBalls + ')';
														}
														
													} else {
														cell.innerHTML = '';
													}
													break;
												
											}
											player2_found = true;
										}
									});
									if(player2_found == false){
										//alert(player1_found)
										switch(j){
											case 1:
												var size = inn.fallsOfWickets.length;
												
												dataToProcess.setup.homeSquad.forEach(function(hs,index,arr){
												//alert(hs.playerId)
													if(inn.fallsOfWickets.length > 0){
														//alert(inn.fallsOfWickets[size - 1].playerId)
														if(inn.fallsOfWickets[size - 1].fowPlayerID == hs.playerId){
															cell.style="background: #FF0000;font-size:15px; font-weight: bold;border-color: Black;";
															cell.innerHTML = hs.ticker_name.slice(0,10);
														}
													}else{
														cell.innerHTML = '';
													}
													
												});
												dataToProcess.setup.homeOtherSquad.forEach(function(hos,index,arr){
												//alert(hs.playerId)
													if(inn.fallsOfWickets.length > 0){
														//alert(inn.fallsOfWickets[size - 1].playerId)
														if(inn.fallsOfWickets[size - 1].fowPlayerID == hos.playerId){
															cell.style="background: #FF0000;font-size:15px; font-weight: bold;border-color: Black;";
															cell.innerHTML = hos.ticker_name.slice(0,10);
														}
													}else{
														cell.innerHTML = '';
													}
													
												});
												dataToProcess.setup.homeSubstitutes.forEach(function(hsub,index,arr){
												//alert(hs.playerId)
													if(inn.fallsOfWickets.length > 0){
														//alert(inn.fallsOfWickets[size - 1].playerId)
														if(inn.fallsOfWickets[size - 1].fowPlayerID == hsub.playerId){
															cell.style="background: #FF0000;font-size:15px; font-weight: bold;border-color: Black;";
															cell.innerHTML = hsub.ticker_name.slice(0,10);
														}
													}else{
														cell.innerHTML = '';
													}
													
												});
												dataToProcess.setup.awaySquad.forEach(function(as,index,arr){
													if(inn.fallsOfWickets.length > 0){
														//alert(inn.fallsOfWickets[inn.fallsOfWickets.length - 1].playerId)
														if(inn.fallsOfWickets[size - 1].fowPlayerID == as.playerId){
															cell.style="background: #FF0000;font-size:15px; font-weight: bold;border-color: Black;";
															cell.innerHTML = as.ticker_name.slice(0,10);
														}
													}else{
														cell.innerHTML = '';
													}
													
												});
												dataToProcess.setup.awayOtherSquad.forEach(function(aos,index,arr){
													if(inn.fallsOfWickets.length > 0){
														//alert(inn.fallsOfWickets[inn.fallsOfWickets.length - 1].playerId)
														if(inn.fallsOfWickets[size - 1].fowPlayerID == aos.playerId){
															cell.style="background: #FF0000;font-size:15px; font-weight: bold;border-color: Black;";
															cell.innerHTML = aos.ticker_name.slice(0,10);
														}
													}else{
														cell.innerHTML = '';
													}
													
												});
												dataToProcess.setup.awaySubstitutes.forEach(function(asub,index,arr){
													if(inn.fallsOfWickets.length > 0){
														//alert(inn.fallsOfWickets[inn.fallsOfWickets.length - 1].playerId)
														if(inn.fallsOfWickets[size - 1].fowPlayerID == asub.playerId){
															cell.style="background: #FF0000;font-size:15px; font-weight: bold;border-color: Black;";
															cell.innerHTML = asub.ticker_name.slice(0,10);
														}
													}else{
														cell.innerHTML = '';
													}
													
												});
												break;
											case 2:
												if(inn.fallsOfWickets.length > 0){
													inn.battingCard.forEach(function(bc,index,arr){
														if(inn.fallsOfWickets[inn.fallsOfWickets.length - 1].fowPlayerID == bc.playerId){
															//alert(bc.runs +' ('+bc.balls+')')
															cell.style="background: #FF0000;font-size:18px; font-weight: bold;text-align:center;border-color: Black;";
															cell.innerHTML = bc.runs +' ('+bc.balls+')';
														}
													});
												}
												break;
											case 3:
												if(inn.fallsOfWickets.length > 0){
													inn.battingCard.forEach(function(bc,index,arr){
														if(inn.fallsOfWickets[inn.fallsOfWickets.length - 1].fowPlayerID == bc.playerId){
															cell.style="background: #FF0000;font-size:18px; font-weight: bold;text-align:center;border-color: Black;";
															cell.innerHTML = bc.fours + '/' + bc.sixes;
														}
													});
												}
												break;
											case 4:
												if(inn.fallsOfWickets.length > 0){
													inn.battingCard.forEach(function(bc,index,arr){
														if(inn.fallsOfWickets[inn.fallsOfWickets.length - 1].fowPlayerID == bc.playerId){
															if(bc.strikeRate == 0){
																cell.style="background: #FF0000;font-size:18px; font-weight: bold;text-align:center;border-color: Black;";
																cell.innerHTML = '-';
															}else{
																cell.style="background: #FF0000;font-size:18px; font-weight: bold;text-align:center;border-color: Black;";
																cell.innerHTML = bc.strikeRate;
															}
														}
													});
												}
												break;
											case 5:
												for(var key in inn.stats){
													if(key == 'BATSMAN_OUT'){
														cell.style="background: #FF0000;font-size:15px; font-weight: bold;text-align:center;border-color: Black;";
														cell.innerHTML = inn.stats[key].split(',')[0];
													}
												}
												break;
											case 6:
												if(inn.partnerships.length > 0) {
													if(inn.fallsOfWickets[inn.fallsOfWickets.length - 1].fowPlayerID == inn.partnerships[inn.partnerships.length-1].firstBatterNo){
														cell.style="background: #FF0000;font-size:18px; font-weight: bold;text-align:center;border-color: Black;";
														cell.innerHTML = inn.partnerships[inn.partnerships.length-1].firstBatterRuns + ' (' + inn.partnerships[inn.partnerships.length-1].firstBatterBalls + ')';
													}
													else{
														cell.style="background: #FF0000;font-size:18px; font-weight: bold;text-align:center;border-color: Black;";
														cell.innerHTML = inn.partnerships[inn.partnerships.length-1].secondBatterRuns + ' (' + inn.partnerships[inn.partnerships.length-1].secondBatterBalls + ')';
													}
													
												} else {
													cell.style="font-size:15px; font-weight: bold;text-align:center; border-color: Black;";
													cell.innerHTML = '';
												}
												break;
										}
									}
								}				
							});	
							break;
						case 4:
							switch(j){
								case 1:
									cell.style = "background: D8E4BC; color: Black; border-color: Black;border-width: 3px;font-weight: bold;"
									cell.style.fontFamily = 'Rockwell';
									cell.style.fontWeight = "800";
									cell.style.maxWidth = '180px'
									cell.innerHTML = 'LAST WICKET';
									break;
								case 2: case 3: case 4:
									
									cell.style.fontFamily = 'Rockwell';
									dataToProcess.match.inning.forEach(function(inn,index,arr){
										if(inn.isCurrentInning == 'YES'){
											inn.battingCard.forEach(function(bc,index,arr1){
												if(inn.fallsOfWickets.length > 0){
													if(inn.fallsOfWickets[inn.fallsOfWickets.length - 1].fowPlayerID == bc.playerId) {
														switch(j){
															case 2:
																cell.innerHTML = bc.player.ticker_name.slice(0,10) ;
																break;
															case 3:
																cell.style = "background: D8E4BC; color: Black; border-color: Black;border-width: 3px;font-weight: bold;font-size:18px;"
																cell.style.textAlign = "center";
																cell.innerHTML = bc.runs + ' (' + bc.balls + ')';
																break;
															case 4:
																cell.style = "background: D8E4BC; color: Black; border-color: Black;border-width: 3px;font-weight: bold;"
																//cell.innerHTML = bc.howOutText;
																//alert(bc.howOutText)
																if(bc.howOut == 'obstructing_fielder' || bc.howOut == 'handled_the_ball'){
																	cell.innerHTML = bc.howOutText.split(' ')[0] + '<br>' + bc.howOutText.split(' ')[1] + ' ' + bc.howOutText.split(' ')[2];
																}else if(bc.howOut == 'hit_ball_twice'){
																	cell.innerHTML = 'hit ball <br> twice';
																}else{
																	cell.innerHTML = bc.howOutPartOne.slice(0,11) + '<br>' + bc.howOutPartTwo.slice(0,11);
																}
																break;
														}
													}
												}
											});
										}
									});
									break;
								case 5:
									cell.style = "background: #D8E4BC; color: Black; border-color: Black;border-width: 3px;font-weight: bold;"
									cell.style.textAlign = "center";
									cell.style.fontFamily = 'Rockwell';
									cell.style.fontWeight = "900";
									dataToProcess.match.inning.forEach(function(inn,index,arr){
										if(inn.isCurrentInning == 'YES'){
											cell.innerHTML = 'EXTRAS: ' + inn.totalExtras ;
										}
									});
									break;
								case 6:
									cell.style = "background: #D8E4BC; color: Black; border-color: Black;border-width: 3px;font-weight: bold;"
									cell.style.fontFamily = 'Rockwell';
									dataToProcess.match.inning.forEach(function(inn,index,arr){
										if(inn.isCurrentInning == 'YES'){
											cell.innerHTML ='(' + 'WD:' + inn.totalWides + ' NB:' + inn.totalNoBalls + ' B:' + inn.totalByes + '<br> LB:' + inn.totalLegByes  + ' PEN:' + inn.totalPenalties + ')';
										}
									});
									break;
							}
							break;
					}
				}
			}
			
			table_score = document.createElement('table');
			//table_score.style.maxWidth = '50px';
			table_score.style = 'table-layout:fixed;width:20%; margin-left:1%;';
			table_score.style.height = "234px";
			table_score.style.marginTop = "-16px";
			table_score.style.marginLeft = "12px";
			table_score.style.marginRight = "-12px";
			table_score.setAttribute('class', 'table table-bordered');
			tbody = document.createElement('tbody');
			table_score.appendChild(tbody);

			for (var i = 1; i <= 3; i++){
				row = tbody.insertRow(tbody.rows.length);
				switch(i){
					case 1:
						row.style="background-color: #E36C09; color: #FFFFFF; font-size:42px; font-weight: bold;border-color: Black;border-width: 2px;";
						row.style.fontFamily = 'Rockwell';
						row.style.textAlign = "center";
						dataToProcess.match.inning.forEach(function(inn,index,arr){
								if(inn.isCurrentInning == 'YES'){
									if(inn.battingTeamId == dataToProcess.setup.homeTeamId){
										//row.innerHTML = '<br>';	
										row.innerHTML = dataToProcess.setup.homeTeam.teamName4 ;
									}
									else {
										//row.innerHTML = '<br>';	
										row.innerHTML = dataToProcess.setup.awayTeam.teamName4 ;
									}
									
									switch(dataToProcess.setup.matchType){
										case 'DT20': case 'IT20':
										//alert(row.innerHTML)
											for(var key in inn.stats){
												if(key == 'POWERPLAY'){
													if(inn.stats[key] == 'P1'){
														row.innerHTML = row.innerHTML + ' (P)';
													}else if(inn.stats[key] == ''){
														row.innerHTML = row.innerHTML + ' ';
													}
												}
											}
											break;
											
										case 'ODI': case 'OD':
											for(var key in inn.stats){
												if(key == 'POWERPLAY'){
													if(inn.stats[key] == 'P1'){
														row.innerHTML = row.innerHTML + ' (' + inn.stats[key] + ')';
													}else if(inn.stats[key] == 'P2'){
														row.innerHTML = row.innerHTML + ' (' + inn.stats[key] + ')';
													}else if(inn.stats[key] == 'P3'){
														row.innerHTML = row.innerHTML + ' (' + inn.stats[key] + ')';
													}else{
														row.innerHTML = row.innerHTML + '';
													}
												}
											}
											break;
									}
									
									if(inn.battingTeamId == dataToProcess.setup.homeTeamId){	
										row.innerHTML = row.innerHTML + "<br />" + inn.totalRuns + '-' + inn.totalWickets ;
									}
									else {
										row.innerHTML = row.innerHTML + "<br />" + inn.totalRuns + '-' + inn.totalWickets ;
									}
									
									for(var key in inn.stats){
										if(key == 'OVER' + inn.inningNumber){
											row.innerHTML = row.innerHTML + ' ('+ inn.stats[key] + ')';
										}
									}
								}
							});
						break;
					case 2:
						row.style="background-color: #E6B8B8; color: #733C98; font-size:19px; font-weight: 700;font-weight: bold;border-color: Black;border-width: 2px;"
						row.style.textAlign = "center";
						row.style.fontFamily = 'Rockwell';
						dataToProcess.match.inning.forEach(function(inn,index,arr){
							if(inn.isCurrentInning == 'YES'){
								row.innerHTML = 'CURRENT RUN RATE :' + inn.runRate;
							}
							if(inn.inningNumber == 2 && inn.isCurrentInning == 'YES'){
								if(dataToProcess.match.inning[0].totalRuns > dataToProcess.match.inning[1].totalRuns){
									for(var key in inn.stats){
										if(key == 'Req_RR'){
											row.innerHTML = 'CURR. RUN RATE : ' + inn.runRate + "<br />" + 'REQ. RUN RATE : ' + inn.stats[key];
										}
									}
								}
								else{
									row.innerHTML = 'CUR. RUN RATE :' + inn.runRate + "<br />" + 'REQ. RUN RATE : 0.00'
								}
							}
						});
						break;
					case 3:
						row.style="background-color: #C2DBF0; color: #000000; font-size:25px; font-weight: bold;font-weight: bold;border-color: Black;border-width: 2px;"
						row.style.textAlign = "center";
						row.style.fontFamily = 'Rockwell';
						row.innerHTML = 'SPEED';
						break;	
				}
			}
			
			table_detail = document.createElement('table');
			table_detail.style = 'table-layout:fixed;';
			table_detail.style.height = "233px";
			table_detail.style.width = "375px";
			table_detail.style.marginTop = "-16px";
			table_detail.style.marginLeft = "11px";
			table_detail.style.marginRight = "-12px";
			table_detail.setAttribute('class', 'table table-bordered');
			tbody = document.createElement('tbody');
			table_detail.appendChild(tbody);
			
			for (var i = 1; i <= 5; i++){
				row = tbody.insertRow(tbody.rows.length);
				row.style = "background: #92CDDB ; color: #05285D;font-weight: bold;border-color: Black;border-width: 2px;";
				switch(i){
					case 1: case 2:  case 3:  case 4: case 5:
						count = 3;
						break;
				}
				for (var j = 1; j <= count; j++){
					cell = row.insertCell(j-1);
					switch(i){
						case 1:
							row.style = "background: #92CDDB ; color: #05285D;font-weight: bold;border-color: Black;border-width: 2px;";
							row.style.fontFamily = 'Rockwell';
							switch(j){
								case 1:
									cell.style = "font-weight: 700;color: #05285D;font-weight: bold;border-color: Black;border-width: 2px;font-size:16px;";
									cell.style.fontFamily = 'Rockwell';
									cell.style.textAlign = "center";
									dataToProcess.match.inning.forEach(function(inn,index,arr){
										if(inn.inningNumber == 1){
											for(var key in inn.stats){
												if(key == 'OVER' + inn.inningNumber){
													if(inn.battingTeamId == dataToProcess.setup.homeTeamId){	
														cell.innerHTML = dataToProcess.setup.homeTeam.teamName4 + "<br />" + inn.totalRuns + '-' + inn.totalWickets + ' (' + inn.stats[key] + ')';
													}
													else if(inn.battingTeamId == dataToProcess.setup.awayTeamId){
														cell.innerHTML = dataToProcess.setup.awayTeam.teamName4 + "<br />" + inn.totalRuns + '-' + inn.totalWickets + ' (' + inn.stats[key] + ')';
													}
												}
											}
										}
									});
									break;
								case 3:
									cell.style = "font-weight: 700;color: #05285D;font-weight: bold;border-color: Black;border-width: 2px;font-size:16px;";
									cell.style.fontFamily = 'Rockwell';
									cell.style.textAlign = "center";
									dataToProcess.match.inning.forEach(function(inn,index,arr){
										if(inn.inningNumber == 2){
											for(var key in inn.stats){
												if(key == 'OVER'+ inn.inningNumber){
													if(inn.battingTeamId == dataToProcess.setup.homeTeamId){	
														cell.innerHTML = dataToProcess.setup.homeTeam.teamName4 + "<br />" + inn.totalRuns + '-' + inn.totalWickets + ' (' + inn.stats[key] + ')';
													}
													else if(inn.battingTeamId == dataToProcess.setup.awayTeamId){
														cell.innerHTML = dataToProcess.setup.awayTeam.teamName4 + "<br />" + inn.totalRuns + '-' + inn.totalWickets + ' (' + inn.stats[key] + ')';
													}
												}
											}
										}
									});
									break;
							}
							break;
						case 2:
							cell.style = "background: #92CDDB ;font-weight: 600; color: #05285D;font-weight: bold;border-color: Black;border-width: 2px;font-size:16px;";
							cell.style.fontFamily = 'Rockwell';
							cell.style.textAlign = "center";
							switch(j){
								case 1:
									dataToProcess.match.inning.forEach(function(inn,index,arr){
										if(inn.inningNumber == 1){
											if(inn.battingTeamId == dataToProcess.setup.homeTeamId){	
												cell.innerHTML = inn.totalFours + '/' + inn.totalSixes;
											}
											else if(inn.battingTeamId == dataToProcess.setup.awayTeamId){
												cell.innerHTML = inn.totalFours + '/' + inn.totalSixes;
											}
										}
									});
									break
								case 2:
									cell.innerHTML = '4s/6s';
									cell.style = "background: #92CDDB; font-weight: 700;color: #05285D;font-weight: bold;border-color: Black;border-width: 2px;font-size:16px;";
									cell.style.fontFamily = 'Rockwell';
									cell.style.textAlign = "center";
									break;
								case 3:
									dataToProcess.match.inning.forEach(function(inn,index,arr){
										if(inn.inningNumber == 2){
											if(inn.battingTeamId == dataToProcess.setup.homeTeamId){	
												cell.innerHTML = inn.totalFours + '/' + inn.totalSixes;
											}
											else if(inn.battingTeamId == dataToProcess.setup.awayTeamId){
												cell.innerHTML = inn.totalFours + '/' + inn.totalSixes;
											}
										}
									});
									break;
							}
							break;
						case 3:
							cell.style = "background: #92CDDB ;font-weight: 600; color: #05285D;font-weight: bold;border-color: Black;border-width: 2px;font-size:16px;";
							cell.style.fontFamily = 'Rockwell';
							cell.style.textAlign = "center";
							switch(j){
								case 1:
									dataToProcess.match.inning.forEach(function(inn,index,arr){
										if(inn.inningNumber == 1){
											for(var key in inn.stats){
												if(key == 'DOTBALLS' + inn.inningNumber){
													cell.innerHTML = inn.stats[key];
												}
											}
										}
									});
									break
								case 2:
									cell.innerHTML = 'DOTS';
									cell.style = "background: #92CDDB; font-weight: 700;color: #05285D;font-weight: bold;border-color: Black;border-width: 2px;font-size:16px;";
									cell.style.fontFamily = 'Rockwell';
									cell.style.textAlign = "center";
									break;
								case 3:
									dataToProcess.match.inning.forEach(function(inn,index,arr){
										if(inn.inningNumber == 2){
											for(var key in inn.stats){
												if(key == 'DOTBALLS'  + inn.inningNumber){
													cell.innerHTML = inn.stats[key];
												}
											}
										}
									});
									break;
							}
							break;	
						case 4:
							cell.style = "background: #92CDDB; font-weight: 600;color: #05285D;font-weight: bold;border-color: Black;border-width: 2px;font-size:16px;";
							cell.style.fontFamily = 'Rockwell';
							cell.style.textAlign = "center";
							switch(j){
								case 1:
									dataToProcess.match.inning.forEach(function(inn,index,arr){
										if(inn.inningNumber == 1 && inn.isCurrentInning == 'NO'){
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
									cell.style = "background: #92CDDB; font-weight: 700;color: #05285D;font-size:14px;font-weight: bold;border-color: Black;border-width: 2px;";
									cell.style.fontFamily = 'Rockwell';
									cell.style.textAlign = "center";		
									break;
								case 3:
									dataToProcess.match.inning.forEach(function(inn,index,arr){
										if(inn.inningNumber == 2 && inn.isCurrentInning == 'YES'){
											cell.innerHTML = inn.totalRuns + '-' + inn.totalWickets ;
										}
									});
									break;
							}
							break;	
						case 5:
							cell.style = "background: #92CDDB; font-weight: 600;color: #05285D;font-weight: bold;border-color: Black;border-width: 2px;font-size:16px;";
							cell.style.fontFamily = 'Rockwell';
							cell.style.textAlign = "center";
							switch(j){
								case 1:
									dataToProcess.match.inning.forEach(function(inn,index,arr){
										if(inn.inningNumber == 1){
											cell.innerHTML = inn.totalExtras ;
										}
									});
									break;
								case 2:
									cell.innerHTML = 'EXTRAS';
									cell.style = "background: #92CDDB; font-weight: 700;color: #05285D;font-weight: bold;border-color: Black;border-width: 2px;";
									cell.style.fontFamily = 'Rockwell';
									cell.style.textAlign = "center";
									break;
								case 3:
									dataToProcess.match.inning.forEach(function(inn,index,arr){
										if(inn.inningNumber == 2){
											cell.innerHTML = inn.totalExtras;
										}
									});
									break;
							}
							break;			
					}
				}
			}
			
			table_Bowl = document.createElement('table');
			table_Bowl.style = 'table-layout:fixed; width:40%;';
			table_Bowl.style.marginTop = "-16px";
			table_Bowl.style.marginRight = "-12px";
			table_Bowl.setAttribute('class', 'table table-bordered');
			tbody = document.createElement('tbody');
			table_Bowl.appendChild(tbody);
			
			for (var i = 1; i <= 3; i++){
				row = tbody.insertRow(tbody.rows.length);
				//row.id = "bowlerId";
				row.style = "background: #FABF8E; color: #000000;font-weight: bold;border-color: Black;border-width: 2px;"
				row.style.fontFamily = 'Rockwell';
				var bowler_found = false;
				switch(i){
					case 1: case 2: case 3:
						count = 5;
						break;
				}
				for (var j = 1; j <= count; j++){
					cell = row.insertCell(j-1);
					//cell.id = 'bowlerId';
					//cell.setAttribute("id","bowlerId");
					switch (i){
						case 1:
							cell.style = 'text-align:center;font-weight: bold;border-color: Black;border-width: 2px;';
							cell.style.fontFamily = 'Rockwell';
							cell.style.fontWeight = "900";
							switch(j){
								case 1:
									break;
								case 2:
									cell.innerHTML = 'FIGURES';
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
							cell.style = 'text-align:center;font-weight: bold;border-color: Black;border-width: 2px;';
							cell.style.fontFamily = 'Rockwell';
							dataToProcess.match.inning.forEach(function(inn,index,arr){
								if(inn.isCurrentInning == 'YES'){
									inn.bowlingCard.forEach(function(boc,index,arr2){
										if(boc.status == 'CURRENTBOWLER'){
											switch(j){
												case 1:
													cell.style="font-size:15px; font-weight: bold;border-color: Black;border-width: 2px;";
													cell.innerHTML = boc.player.ticker_name.slice(0,10) + '*';
													//cell.style.fontWeight = "900";
													break;
												case 2:
													cell.style = 'text-align:center;font-weight: bold;border-color: Black;border-width: 2px;font-size:17px;';
													cell.innerHTML = boc.wickets + '-' + boc.runs;
													break;
												case 3:
													cell.style = 'text-align:center;font-weight: bold;border-color: Black;border-width: 2px;font-size:17px;';
													cell.innerHTML = boc.overs + '.' + boc.balls;
													break;
												case 4:
													cell.style = 'text-align:center;font-weight: bold;border-color: Black;border-width: 2px;font-size:17px;';
													cell.innerHTML = boc.dots;
													break;
												case 5:
													cell.style = 'text-align:center;font-weight: bold;border-color: Black;border-width: 2px;font-size:17px;';
													if(boc.economyRate == 0){
														cell.innerHTML = '-';
													}else{
														cell.innerHTML = boc.economyRate;
													}
													break;
											}
											bowler_found = true;
										}
									});
								}
								//$("bowlerId").hide();
							});
							if(bowler_found == false){
								cell.style = 'text-align:center;font-weight: bold;border-color: Black;border-width: 2px;';
								cell.style.fontFamily = 'Rockwell';
								dataToProcess.match.inning.forEach(function(inn,index,arr){
									if(inn.isCurrentInning == 'YES'){
										for(var key in inn.stats){
											if(key == 'OTHER_BOWLER'){
												switch(j){
													case 1:
														if(inn.stats[key].split(',')[0] == ''){
															cell.innerHTML = '-';
														}else{
															cell.style="font-size:15px; font-weight: bold;border-color: Black;border-width: 2px;";
															cell.innerHTML = inn.stats[key].split(',')[0].slice(0,10);
															//cell.style.fontWeight = "900";
														}
														break;
													case 2:
														cell.style = 'text-align:center;font-weight: bold;border-color: Black;border-width: 2px;font-size:17px;';
														if(inn.stats[key].split(',')[0] == ''){
															cell.innerHTML = '-';
														}else{
															cell.innerHTML = inn.stats[key].split(',')[1];
														}
														break;
													case 3:
														cell.style = 'text-align:center;font-weight: bold;border-color: Black;border-width: 2px;font-size:17px;';
														if(inn.stats[key].split(',')[0] == ''){
															cell.innerHTML = '-';
														}else{
															cell.innerHTML = inn.stats[key].split(',')[4];
														}
														
														break;
													case 4:
														cell.style = 'text-align:center;font-weight: bold;border-color: Black;border-width: 2px;font-size:17px;';
														if(inn.stats[key].split(',')[0] == ''){
															cell.innerHTML = '-';
														}else{
															cell.innerHTML = inn.stats[key].split(',')[2];
														}
														
														break;
													case 5:
														cell.style = 'text-align:center;font-weight: bold;border-color: Black;border-width: 2px;font-size:17px;';
														if(inn.stats[key].split(',')[0] == ''){
															cell.innerHTML = '-';
														}else{
															if(inn.stats[key].split(',')[3] == 0){
																cell.innerHTML = '-';
															}else{
																cell.innerHTML = inn.stats[key].split(',')[3];
															}
														}
														
														break;
												}
											}
										}
									}
									//$("bowlerId").hide();
								});
							}
							break;
						case 3:
							cell.style = 'text-align:center;font-weight: bold;border-color: Black;border-width: 2px;';
							cell.style.fontFamily = 'Rockwell';
							dataToProcess.match.inning.forEach(function(inn,index,arr){
								if(inn.isCurrentInning == 'YES'){
									for(var key in inn.stats){
										if(key == 'PREVIOUS_BOWLER'){
											switch(j){
												case 1:
													if(inn.stats[key].split(',')[0] == ''){
														cell.style="font-size:15px; font-weight: bold;border-color: Black;border-width: 2px;";
														cell.innerHTML = '-';
													}else{
														cell.style="font-size:15px; font-weight: bold;border-color: Black;border-width: 2px;";
														cell.innerHTML = inn.stats[key].split(',')[0].slice(0,10);
													}
													//cell.style.fontWeight = "900";
													break;
												case 2:
													cell.style = 'text-align:center;font-weight: bold;border-color: Black;border-width: 2px;font-size:17px;';
													if(inn.stats[key].split(',')[0] == ''){
														cell.innerHTML = '-';
													}else{
														cell.innerHTML = inn.stats[key].split(',')[1];
													}
													break;
												case 3:
													cell.style = 'text-align:center;font-weight: bold;border-color: Black;border-width: 2px;font-size:17px;';
													if(inn.stats[key].split(',')[0] == ''){
														cell.innerHTML = '-';
													}else{
														cell.innerHTML = inn.stats[key].split(',')[4];
													}
													break;
												case 4:
													cell.style = 'text-align:center;font-weight: bold;border-color: Black;border-width: 2px;font-size:17px;';
													if(inn.stats[key].split(',')[0] == ''){
														cell.innerHTML = '-';
													}else{
														cell.innerHTML = inn.stats[key].split(',')[2];
													}
													break;
												case 5:
													cell.style = 'text-align:center;font-weight: bold;border-color: Black;border-width: 2px;font-size:17px;';
													if(inn.stats[key].split(',')[0] == ''){
														cell.innerHTML = '-';
													}else{
														if(inn.stats[key].split(',')[3] == 0){
															cell.innerHTML = '-';
														}else{
															cell.innerHTML = inn.stats[key].split(',')[3];
														}
													}
													break;
											}
										}
									}
								}
							});
							break;	
					}
				}
			}
			
			table_Other = document.createElement('table');
			table_Other.style = 'table_Other-layout: fixed; width:400px; margin-left:1%; margin-right:1%;';
			table_Other.style.marginTop = "-16px";
			table_Other.style.marginRight = "-12px";
			table_Other.setAttribute('class', 'table table-bordered');
			tbody = document.createElement('tbody');
			table_Other.appendChild(tbody);
			
			for (var i = 1; i <= 3; i++){
				row = tbody.insertRow(tbody.rows.length);
				switch(i){
					case 1:
						row.style="background-color: Red; color: #FFFFFF;";
						row.style.fontFamily = 'Rockwell';
						row.style.textAlign = "center";
						dataToProcess.match.inning.forEach(function(inn,index,arr){
								row.innerHTML = 'INFORMATIVE POP-UP';
						});
						break;
					case 2:
						row.style="background-color: white ;";
						row.style.fontFamily = 'Rockwell';
						row.style.textAlign = "center";
						dataToProcess.match.inning.forEach(function(inn,index,arr){
								row.innerHTML = 'Speed';
						});
						break;
					case 3:
						row.style="background-color: white ;";
						row.style.fontFamily = 'Rockwell';
						row.style.textAlign = "center";
						dataToProcess.match.inning.forEach(function(inn,index,arr){
								row.innerHTML = 'KPH';
						});
						break;
				}
			}
			
			table_Other1 = document.createElement('table');
			table_Other1.style = 'table-layout:fixed; width:32%;';
			table_Other1.style.marginTop = "-16px";
			table_Other1.style.marginLeft = "12px";
			table_Other1.style.marginRight = "-12px";
			table_Other1.setAttribute('class', 'table table-bordered');
			tbody = document.createElement('tbody');
			table_Other1.appendChild(tbody);
			
			for (var i = 1; i <= 3; i++){
				row = tbody.insertRow(tbody.rows.length);
				row.style="background-color: #415121 ; color: #FFFFFF;font-weight: bold;border-width: 2px; ";
				row.style.fontFamily = 'Rockwell';
				switch(i){
					case 1: case 3:
						count = 1;
						break;
					case 2:
						count = 2;
						break;	
						
				}
				for (var j=1;j<=count;j++){
					cell = row.insertCell(j-1);
					cell.style="background: #415121;font-weight: bold;border-width: 2px;";
					cell.style.textAlign = 'center';
					//cell.style.paddingRight = '80px';
					switch(i){
						case 1:
							switch(j){
								case 1:
									cell.colSpan = 2;
									cell.style.fontWeight = "700";
									dataToProcess.match.inning.forEach(function(inn,index,arr){
										if(inn.inningNumber == 1 && inn.isCurrentInning == 'YES'){
											for(var key in inn.stats){
												if(key == 'TOSS'){
													cell.innerHTML = inn.stats[key].toUpperCase();
												}
											}		
										}
										if(inn.inningNumber == 2 && inn.isCurrentInning == 'YES'){
											for(var key in inn.stats){
												if(key == 'INNING_STATUS'){
													//cell.innerHTML = 'OMN A NEED 999 RUNS TO WIN FROM 20.0 OVERS (DLS) adsdsadsdsdASas cXzxZ';
													cell.innerHTML = inn.stats[key].toUpperCase();
												}
											}
										}	
									});
									break;
							}
							break;
						case 2:
							switch(j){
								case 1:
									cell.style.width = "30px"
									cell.style.fontWeight = "500";
									dataToProcess.match.inning.forEach(function(inn,index,arr){
										if(inn.isCurrentInning == 'YES'){
											for(var key in inn.stats){
												if(key == 'DLS'){
													if(inn.stats[key] == ''){
														cell.innerHTML = '';
													}else{
														cell.innerHTML = 'DLS PAR SCORE: ' + inn.stats[key];	
													}
												}
											}
										}
									});	
									break;
								case 2 :
									//cell.style.width = "70px"
									cell.style="font-size:14px; font-weight: bold; font-weight: bold;border-width: 2px;";
									dataToProcess.match.inning.forEach(function(inn,index,arr){
										if(inn.isCurrentInning == 'YES'){
											for(var key in inn.stats){
												if(key == 'DLS_EQUATION'){
													//cell.innerHTML = "IND A ARE 99 RUNS BEHIND PAR SCORE";
													cell.innerHTML = inn.stats[key];
												}
											}
										}
									});
									break;	
							}
							break;
						case 3:
							switch(j){
								case 1:
									cell.style="font-size:17px; font-weight: bold; font-weight: bold;border-width: 2px;";
									cell.style.textAlign = 'center';
									cell.colSpan = 2;
									cell.style.fontWeight = "700";
									dataToProcess.match.inning.forEach(function(inn,index,arr){
										if(inn.isCurrentInning == 'YES'){
											inn.bowlingCard.forEach(function(boc,index,arr2){
												//row.innerHTML = 'This Over Runs:-';
												for(var key in inn.stats){
													if(key == 'ThisOver'){
														if(boc.status == 'CURRENTBOWLER'){
															cell.innerHTML = 'THIS OVER RUNS :- '  + inn.stats[key];
														}
														else if(boc.status == 'LASTBOWLER'){
															cell.innerHTML = 'THIS OVER RUNS :- ' + inn.stats[key];
														}
													}
												}
												for(var key in inn.stats){
													if(key == 'OVER'){
														if(boc.status == 'CURRENTBOWLER'){
															if(inn.stats[key] == ''){
																cell.innerHTML = cell.innerHTML;
															}else{
																cell.innerHTML = cell.innerHTML + ' [' + inn.stats[key] + ']';
															}
														}
														else if(boc.status == 'LASTBOWLER'){
															if(inn.stats[key] == ''){
																cell.innerHTML = cell.innerHTML;
															}else{
																cell.innerHTML = cell.innerHTML + ' [' + inn.stats[key] + ']';
															}
														}
													}
												}
											});
										}
									});
							}
							break;		
					}
				}
			}
			
			table_PS = document.createElement('table');
			table_PS.style = 'table-layout:fixed;height:90px;width:430px;';
			table_PS.style.marginTop = "-16px";
			table_PS.style.marginLeft = "12px";
			table_PS.style.marginRight = "-12px";
			table_PS.setAttribute('class', 'table table-bordered');
			tbody = document.createElement('tbody');
			table_PS.appendChild(tbody);

			for (var i = 1; i <= 3; i++){
				row = tbody.insertRow(tbody.rows.length);
				row.style="background-color: #D99697 ;color: #000000 ;border-color: Black;border-width: 2px;";
				row.style.fontFamily = 'Rockwell';
				switch(i){
					case 1: case 2:
						count = 5;
						break;
					case 3:
						count = 1;
						break;	
						
				}
				for (var j=1;j<=count;j++){
					cell = row.insertCell(j-1);
					cell.style="background: #D99697 ; font-weight: bold;font-size:16px;border-color: Black;border-width: 2px;";
					cell.style.textAlign = "center";
					switch(i){
						case 1:
							switch(j){
								case 1:
									cell.style.width = "50px"
									cell.style.height = "50px"
									dataToProcess.match.inning.forEach(function(inn,index,arr){
										if(inn.isCurrentInning == 'YES'){
											if(inn.inningNumber == 1){
												cell.innerHTML = 'RUN <br> RATE';
												cell.style.fontWeight = "700";
											}else{
												cell.innerHTML = '';
												cell.style.fontWeight = "700";
											}
										}
										
									});
									
									break;
								case 2 : case 3: case 4: case 5:
									cell.style.width = "50px"
									cell.style.height = "50px"
									cell.style.fontWeight = "600";
									dataToProcess.match.inning.forEach(function(inn,index,arr){
										//if(inn.inningNumber == 1 && inn.isCurrentInning == 'YES')
										if(inn.inningNumber == 1 && inn.isCurrentInning == 'YES'){
											for(var key in inn.stats){
												if(key == 'PS'){
													const myArray = inn.stats[key].split(",");
													switch(j){
														case 2:
															cell.innerHTML = '@' + myArray[1] + '<br>(CRR)' ;
															break;
														case 3:
															cell.innerHTML = '@' + myArray[3] ;
															break;
														case 4:
															cell.innerHTML = '@' + myArray[5] ;
															break;
														case 5:
															cell.innerHTML = '@' + myArray[7] ;
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
								case 1:
									cell.style.width = "50px"
									cell.style.height = "50px"
									dataToProcess.match.inning.forEach(function(inn,index,arr){
										if(inn.isCurrentInning == 'YES'){
											if(inn.inningNumber == 1){
												cell.innerHTML = 'SCORES';
												cell.style.fontWeight = "700";
											}else{
												cell.innerHTML = '';
												cell.style.fontWeight = "700";
											}
										}
										
									});
									
									break;
								case 2 : case 3: case 4: case 5:
									cell.style.width = "50px"
									cell.style.height = "50px"
									cell.style.fontWeight = "600";
									dataToProcess.match.inning.forEach(function(inn,index,arr){
										if(inn.inningNumber == 1 && inn.isCurrentInning == 'YES'){
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
						case 3:
							switch(j){
								case 1:
									cell.colSpan = 5;
									cell.style.fontWeight = "700";
									dataToProcess.match.inning.forEach(function(inn,index,arr){
										if(inn.isCurrentInning == 'YES'){
											for(var key in inn.stats){
												if(key == 'BOUNDARY'){
													cell.innerHTML = 'BALL SINCE LAST BOUNDARY: ' + inn.stats[key];
												}
											}
										}
									});
									break;
								/*case 1:
									cell.colSpan = 3;
									break;*/
							}
							break;		
					}
				}
			}
			
			table_BC = document.createElement('table');
			//table_BC.style = 'table-layout:fixed;';
			table_BC.style.height = "15px";
			table_BC.style.width = "635px";
			table_BC.style.marginTop = "-16px";
			table_BC.style.marginRight = "-12px";
			table_BC.setAttribute('class', 'table table-bordered');
			tbody = document.createElement('tbody');
			table_BC.appendChild(tbody);
			
			dataToProcess.match.inning.forEach(function(inn,index,arr){
				if(inn.isCurrentInning == 'YES'){
					for (var i = 1; i <= 11; i++){
						row = tbody.insertRow(tbody.rows.length);
						row.style="background-color: #D8E4BC ;border-width: 2px;";
						row.style.fontFamily = 'Rockwell';
						switch(i){
							case 1:
								count = 1;
								break;
							case 2: case 3: case 4: case 5: case 6: case 7: case 8: case 9: case 10: case 11:
								count = 3;	
								break;
						}
						for (var j=1;j<=count;j++){
							cell = row.insertCell(j-1);
							switch(i){
								case 1:
									switch(j){
										case 1:
										cell.colSpan = 3;
										cell.style = "background: #D8E4BC;font-weight: bold;border-color: Black;border-width: 2px;";
										cell.style.textAlign = "center";
										cell.style.fontWeight = "900";
										cell.innerHTML = 'BATTING CARD';
										break;
									}	
									break;
								default:
									cell.style="background-color: #D8E4BC ; font-weight: bold;text-align:center;border-color: Black;border-width: 2px;";
									cell.style.height = "39px"
									
									switch(j){
										case 1:
										cell.style.width = "10%"
										if(inn.fallsOfWickets.length > 0){
											if(inn.fallsOfWickets[i-2] != null){
												dataToProcess.setup.homeSquad.forEach(function(hs,index,arr){
													if(inn.fallsOfWickets[i-2].fowPlayerID == hs.playerId){
														cell.innerHTML = hs.ticker_name;
													}
												});
												dataToProcess.setup.homeOtherSquad.forEach(function(hos,index,arr){
													if(inn.fallsOfWickets[i-2].fowPlayerID == hos.playerId){
														cell.innerHTML = hos.ticker_name;
													}
												});
												dataToProcess.setup.homeSubstitutes.forEach(function(hsub,index,arr){
													if(inn.fallsOfWickets[i-2].fowPlayerID == hsub.playerId){
														cell.innerHTML = hsub.ticker_name;
													}
												});
												dataToProcess.setup.awaySquad.forEach(function(as,index,arr){
													if(inn.fallsOfWickets[i-2].fowPlayerID == as.playerId){
														cell.innerHTML = as.ticker_name;
													}
												});
												dataToProcess.setup.awayOtherSquad.forEach(function(aos,index,arr){
													if(inn.fallsOfWickets[i-2].fowPlayerID == aos.playerId){
														cell.innerHTML = aos.ticker_name;
													}
												});
												dataToProcess.setup.awaySubstitutes.forEach(function(asub,index,arr){
													if(inn.fallsOfWickets[i-2].fowPlayerID == asub.playerId){
														cell.innerHTML = asub.ticker_name;
													}
												});
											}else{
												cell.innerHTML = '';
											}
										}
										break;
										case 2:
										cell.style="background-color: #D8E4BC ; font-size:15px; font-weight: bold;text-align:center;border-color: Black;border-width: 2px;";
										cell.style.width = "100px"
										
										if(inn.fallsOfWickets.length >= 0){
											if(inn.fallsOfWickets[i-2] != null){
												inn.battingCard.forEach(function(bc,index,arr){
													if(inn.fallsOfWickets[i-2].fowPlayerID == bc.playerId){
														cell.innerHTML = bc.howOutText;
														//cell.style.maxWidth = "9px;";
														//cell.innerHTML = 'st KRANTHI KUMAR b CHANDRA KOUSHIK';
													}
												});
											}else{
												cell.innerHTML = '';
											}
										}
										break;
										case 3:
										cell.style="font-size:16px; font-weight: bold;text-align:center;border-color: Black;border-width: 2px;";
										cell.style.width = "80px"
										if(inn.fallsOfWickets.length >= 0){
											if(inn.fallsOfWickets[i-2] != null){
												inn.battingCard.forEach(function(bc,index,arr){
													if(inn.fallsOfWickets[i-2].fowPlayerID == bc.playerId){
														cell.innerHTML = bc.runs + ' (' + bc.balls + ')';
													}
												});
												//cell.innerHTML = inn.fallsOfWickets[i-1].fowRuns + '(' + inn.fallsOfWickets[i-1].fowBalls + ')';
											}else{
												cell.innerHTML = '';
											}
										}
										break;
									}
									break;	
							}
						}
					}
				}
			});
			
			table_BOC = document.createElement('table');
			//table_BOC.style = 'table-layout:fixed; width:40%;';
			table_BOC.style.height = "15px";
			table_BOC.style.width = "610px";
			table_BOC.style.marginTop = "-16px";
			table_BOC.style.marginLeft = "12px";
			table_BOC.style.marginRight = "-12px";
			table_BOC.setAttribute('class', 'table table-bordered');
			tbody = document.createElement('tbody');
			table_BOC.appendChild(tbody);
			
			dataToProcess.match.inning.forEach(function(inn,index,arr){
				if(inn.isCurrentInning == 'YES'){
					//alert(inn.bowlingCard.length)
					/*inn.bowlingCard.forEach(function(boc,index,arr){
						alert(inn.bowlingCard.length)
					});*/
					//inn.bowlingCard.forEach(function(boc,index,arr){
						//alert(boc.length)
						for (var i = 1; i <= 11; i++){
							row = tbody.insertRow(tbody.rows.length);
							row.style="background-color: #FABF8E ; color: #000000 ;border-color: Black;border-width: 2px;";
							row.style.fontFamily = 'Rockwell';
							switch(i){
							case 1:
								count = 1;
								break;
							case 2: case 3: case 4: case 5: case 6: case 7: case 8: case 9: case 10: case 11:
								count = 3;	
								break;
							}
							for (var j=1;j<=count;j++){
								cell = row.insertCell(j-1);
								cell.style="background: #FDD5B4 ;color: #000000 ;";
								
								switch(i){
								case 1:
									switch(j){
										case 1:
										cell.colSpan = 3;
										cell.style = "background: #FABF8E;font-weight: bold;color: #000000 ;border-color: Black;border-width: 2px;";
										cell.style.textAlign = "center";
										cell.style.fontWeight = "900";
										cell.innerHTML = 'BOWLING CARD';
										break;
									}	
									break;
								default:
									cell.style="color: #000000;font-weight: bold;text-align:center;border-color: Black;border-width: 2px;";
									cell.style.height = "38px"
									switch(j){
										case 1:
											cell.style.width = "100px"
											//cell.style="background-color: #ffe49c ; font-size:14px; font-weight: bold;";
											dataToProcess.setup.homeSquad.forEach(function(hs,index,arr){
												//alert(hs.playerId)
												if(inn.bowlingCard[i-2] != null){
													if(inn.bowlingCard[i-2].playerId == hs.playerId){
														//alert(hs.ticker_name)
														cell.innerHTML = hs.ticker_name;
													}
												}else{
													cell.innerHTML = '';
												}
												
											});
											dataToProcess.setup.homeOtherSquad.forEach(function(hos,index,arr){
												//alert(hs.playerId)
												if(inn.bowlingCard[i-2] != null){
													if(inn.bowlingCard[i-2].playerId == hos.playerId){
														//alert(hs.ticker_name)
														cell.innerHTML = hos.ticker_name;
													}
												}else{
													cell.innerHTML = '';
												}
												
											});
											dataToProcess.setup.homeSubstitutes.forEach(function(hsub,index,arr){
												//alert(hs.playerId)
												if(inn.bowlingCard[i-2] != null){
													if(inn.bowlingCard[i-2].playerId == hsub.playerId){
														//alert(hs.ticker_name)
														cell.innerHTML = hsub.ticker_name;
													}
												}else{
													cell.innerHTML = '';
												}
												
											});
											dataToProcess.setup.awaySquad.forEach(function(as,index,arr){
												if(inn.bowlingCard[i-2] != null){
													if(inn.bowlingCard[i-2].playerId == as.playerId){
														//alert(hs.ticker_name)
														cell.innerHTML = as.ticker_name;
													}
												}else{
													cell.innerHTML = '';
												}
												
											});
											dataToProcess.setup.awayOtherSquad.forEach(function(aos,index,arr){
												if(inn.bowlingCard[i-2] != null){
													if(inn.bowlingCard[i-2].playerId == aos.playerId){
														//alert(hs.ticker_name)
														cell.innerHTML = aos.ticker_name;
													}
												}else{
													cell.innerHTML = '';
												}
												
											});
											dataToProcess.setup.awaySubstitutes.forEach(function(asub,index,arr){
												if(inn.bowlingCard[i-2] != null){
													if(inn.bowlingCard[i-2].playerId == asub.playerId){
														//alert(hs.ticker_name)
														cell.innerHTML = asub.ticker_name;
													}
												}else{
													cell.innerHTML = '';
												}
												
											});
											break;
										case 2:
											cell.style.width = "20px"
											if(inn.bowlingCard[i-2] != null){
												cell.innerHTML = inn.bowlingCard[i-2].wickets + '-' + inn.bowlingCard[i-2].runs;
											}else{
												cell.innerHTML = '';
											}
												
											
											break;
										case 3:
											cell.style.width = "20px"
											//cell.style="background-color: #ffe49c ; font-size:14px; font-weight: bold;text-align:center;";
											//cell.style.height = "43px"
											//	cell.style.width = "50px"
											if(inn.bowlingCard[i-2] != null){
												cell.innerHTML = inn.bowlingCard[i-2].overs + '.' + inn.bowlingCard[i-2].balls;
											}else{
												cell.innerHTML = '';
											}
												
											
											break;	
									}
									break;	
							}
							}
						}
					//});	
				}
			});
			table_fow = document.createElement('table');
			//table_fow.style = 'table-layout:fixed;';
			table_fow.style.height = "13px";
			table_fow.style.width = "283px";
			table_fow.style.marginTop = "-16px";
			table_fow.style.marginLeft = "12px";
			table_fow.style.marginRight = "-12px";
			table_fow.setAttribute('class', 'table table-bordered');
			tbody = document.createElement('tbody');
			table_fow.appendChild(tbody);
			for (var i = 1; i <= 12; i++){
				row = tbody.insertRow(tbody.rows.length);
				row.style.height = "10px"
				row.style = "background: #0C0C0C ; color: #D7DCA2";
				row.style.fontFamily = 'Rockwell';
				switch(i){
					case 1: case 2: case 3: case 4: case 5: case 6: case 7: case 8: case 9: case 10: case 11:
						count = 3;
						break;
					case 12:
						count = 1;
						break;	
						
				}
				for (var j = 1; j <= count; j++){
					cell = row.insertCell(j-1);
					switch(i){			
						case 1:
							switch(j){
								case 1:
									dataToProcess.match.inning.forEach(function(inn,index,arr){
										if(inn.inningNumber == 1){
											if(inn.battingTeamId == dataToProcess.setup.homeTeamId){	
												cell.innerHTML = dataToProcess.setup.homeTeam.teamName4;
											}
											else if(inn.battingTeamId == dataToProcess.setup.awayTeamId){
												cell.innerHTML = dataToProcess.setup.awayTeam.teamName4;
											}
										}
										cell.style = "background: #0C0C0C; color: #D7DCA2;font-size:'19px';";
										cell.style.textAlign = "center";
										cell.style.height = "15px"
										cell.style.width = "20px"
										cell.style.fontWeight = "650";
									});
									break;
								case 2:
									cell.innerHTML = 'FOW';
									cell.style = "background: #0C0C0C; color: #D7DCA2";
									cell.style.textAlign = "center";
									cell.style.height = "15px"
									cell.style.width = "20px"
									cell.style.fontWeight = "700";
									break;
								case 3:
									dataToProcess.match.inning.forEach(function(inn,index,arr){
										if(inn.inningNumber == 2){
										if(inn.battingTeamId == dataToProcess.setup.homeTeamId){	
											cell.innerHTML = dataToProcess.setup.homeTeam.teamName4;
										}
										else if(inn.battingTeamId == dataToProcess.setup.awayTeamId){
											cell.innerHTML = dataToProcess.setup.awayTeam.teamName4;
										}
									}
										cell.style = "background: #0C0C0C; color: #D7DCA2";
										cell.style.textAlign = "center";
										cell.style.height = "15px"
										cell.style.width = "20px"
										cell.style.fontWeight = "700";
									});
									break;
							}
							break;
					case 2: case 3: case 4: case 5: case 6: case 7: case 8: case 9: case 10: case 11:
						switch(j){
							case 1:
								cell.style = "background: #0C0C0C ;font-size:13px;font-weight: bold;";
								cell.style.textAlign = "center";
								cell.style.width = "20px"
								cell.style.height = "20px"
								cell.style.fontWeight = "600";
									dataToProcess.match.inning.forEach(function(inn,index,arr){
										if(inn.inningNumber == 1){
											if(inn.fallsOfWickets.length >= i-1){
												cell.innerHTML = inn.fallsOfWickets[i-2].fowRuns + ' (' + inn.fallsOfWickets[i-2].fowOvers + '.' + 
													inn.fallsOfWickets[i-2].fowBalls + ')' ;
											}
										}
									});
								break;
							case 2:
								cell.style = "background: #0C0C0C;font-size:13px;font-weight: bold;";
								cell.style.width = "20px"
								cell.style.height = "20px"
								cell.style.textAlign = "center";
								cell.style.fontWeight = "600";
								cell.innerHTML = i - 1;
								break;
							case 3:
								cell.style = "background: #0C0C0C;font-size:13px;font-weight: bold;";
								cell.style.textAlign = "center";
								cell.style.width = "20px"
								cell.style.height = "20px"
								cell.style.fontWeight = "600";
									dataToProcess.match.inning.forEach(function(inn,index,arr){
										if(inn.inningNumber == 2){
											if(inn.fallsOfWickets.length >= i-1){
												cell.innerHTML = inn.fallsOfWickets[i-2].fowRuns + ' (' + inn.fallsOfWickets[i-2].fowOvers + '.' + 
													inn.fallsOfWickets[i-2].fowBalls + ')' ;
											}
										}
									});
								break;
						}
						break;
					case 12:
						switch(j){
						case 1:
							cell.colSpan = 3;
							cell.style = "background: #0000FF; color: #FFFFFF;font-size: '13px'; font-weight: bold;";
							cell.style.textAlign = "center";
							cell.style.height = "15px"
							cell.style.width = "20px"
							cell.innerHTML = "DESIGN ON A DIME";	
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
		//$('#fruit_captions_div').append(table_Other);
		$('#fruit_captions_div').append(table_Other1);
		$('#fruit_captions_div').append(table_PS);
		$('#fruit_captions_div').append(table_BC);
		$('#fruit_captions_div').append(table_BOC);
		$('#fruit_captions_div').append(table_fow);
		document.getElementById('fruit_captions_div').style.display = '';
		$("body").css("overflow", "hidden");
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