package com.cricket.containers;

import java.util.Collections;
import java.util.List;

import com.cricket.model.Event;
import com.cricket.model.Inning;
import com.cricket.model.Match;
import com.cricket.util.CricketFunctions;
import com.cricket.util.CricketUtil;

public class Functions 
{
	public static String generateMatchSummaryStatus(int whichInning, Match match, String teamNameType)
	  {
	    if (match.getMaxOvers() <= 0) {
	      System.out.println("EROR: generateMatchSummaryStatus NOT available for test matches");
	    } else {
	      switch (whichInning)
	      {
	      case 1: 
	      case 2: 
	        break;
	      default: 
	        System.out.println("EROR: Selected inning is wrong [" + whichInning + "]");
	        return null;
	      }
	    }
	    String TeamNameToUse = "";String BottomLineText = "";
	    if (CricketFunctions.getRequiredRuns(match) <= 0) {
	    	switch (teamNameType)
		    {
		    case "SHORT": 
		      TeamNameToUse = (match.getInning().get(1)).getBatting_team().getShortname();
		      break;
		    default: 
		      TeamNameToUse = (match.getInning().get(1)).getBatting_team().getFullname();
		    }
	    }
	    else {
	    	switch (teamNameType)
		    {
		    case "SHORT": 
		      TeamNameToUse = (match.getInning().get(0)).getBatting_team().getShortname();
		      break;
		    default: 
		      TeamNameToUse = (match.getInning().get(0)).getBatting_team().getFullname();
		    }
	    }
	    switch (whichInning) {
	    case 1: 
	    	if (((match.getInning().get(whichInning - 1)).getTotalRuns() > 0) || 
	  		      ((match.getInning().get(whichInning - 1)).getTotalOvers() > 0) || 
	  		      ((match.getInning().get(whichInning - 1)).getTotalBalls() > 0)) {
	  		      return "Current RunRate " + (match.getInning().get(0)).getRunRate();
	  		    }
	    	else {
	    		return CricketFunctions.TossResult(match, "FULL", "FIELD", "FULL");
	    	}
	    case 2:
		    if ((CricketFunctions.getRequiredRuns(match) > 0) && (CricketFunctions.getRequiredBalls(match) > 0) && (CricketFunctions.getWicketsLeft(match) > 0))
		    {
		      switch (teamNameType)
		      {
		      case "SHORT": 
		        BottomLineText = TeamNameToUse + " need " + CricketFunctions.getRequiredRuns(match) + " more run" + CricketFunctions.Plural(CricketFunctions.getRequiredRuns(match)) + " to win from ";
		        break;
		      default: 
		        BottomLineText = TeamNameToUse + " need " + CricketFunctions.getRequiredRuns(match) + " more run" + CricketFunctions.Plural(CricketFunctions.getRequiredRuns(match)) + " to win from ";
		      }
		      if (CricketFunctions.getRequiredBalls(match) >= 150) {
		        BottomLineText = BottomLineText + CricketFunctions.OverBalls((match.getInning().get(1)).getTotalOvers(), (match.getInning().get(1)).getTotalBalls()) + " over";
		      } else {
		        BottomLineText = BottomLineText + CricketFunctions.getRequiredBalls(match) + " ball" + CricketFunctions.Plural(CricketFunctions.getRequiredBalls(match));
		      }
		    }
		    else if (CricketFunctions.getRequiredRuns(match) <= 0)
		    {
		      BottomLineText = TeamNameToUse + " win by " + CricketFunctions.getWicketsLeft(match) + " wicket" + CricketFunctions.Plural(CricketFunctions.getWicketsLeft(match));
		    }
		    else if (CricketFunctions.getRequiredBalls(match) <= 0 || CricketFunctions.getWicketsLeft(match) <= 0)
		    {
		      BottomLineText = TeamNameToUse + " win by " + (CricketFunctions.getRequiredRuns(match) - 1) + " run" + CricketFunctions.Plural(CricketFunctions.getRequiredRuns(match) - 1);
		    }
	    }
		    return BottomLineText;
		  
	}
	
	public static String countDotBalls(int inn_num,List<Event> events) {
		int countBalls=0;
		if((events != null) && (events.size() > 0)) {
			for(Event evnt : events) {
				if(evnt.getEventInningNumber() == inn_num) {
					switch(evnt.getEventType()) {
					case CricketUtil.DOT: case CricketUtil.BYE: case CricketUtil.LEG_BYE: case CricketUtil.LOG_WICKET:
						countBalls++;
						break;
					}
				}
			}
		}
		return String.valueOf(countBalls);
	}
	
	public static String getPowerPlayScore(Inning inning,int inn_num,List<Event> events) {
		int total_run_PP=0, total_wickets_PP=0;
		if((events != null) && (events.size() > 0)) {
			for(Event evnt : events) {
				if(evnt.getEventInningNumber() == inn_num) {
					int Event_overs = ((evnt.getEventOverNo()*6)+evnt.getEventBallNo());
					if((Event_overs) <= (inning.getFirstPowerplayEndOver()*6)) {
						switch(evnt.getEventType()) {
						case CricketUtil.ONE : case CricketUtil.TWO: case CricketUtil.THREE:  case CricketUtil.FIVE : case CricketUtil.DOT:
						case CricketUtil.FOUR: case CricketUtil.SIX: 
							total_run_PP += evnt.getEventRuns();
							break;
			          
						case CricketUtil.WIDE: case CricketUtil.NO_BALL: case CricketUtil.BYE: case CricketUtil.LEG_BYE: case CricketUtil.PENALTY:
							total_run_PP += evnt.getEventRuns();
							break;
			        	
						case CricketUtil.LOG_WICKET:
							total_wickets_PP += 1;
							break;
			        
						case CricketUtil.LOG_ANY_BALL:
							total_run_PP += evnt.getEventRuns();
							if (evnt.getEventExtra() != null) {
								total_run_PP += evnt.getEventExtraRuns();
							}
							if (evnt.getEventSubExtra() != null) {
								total_run_PP += evnt.getEventSubExtraRuns();
							}
							if (evnt.getEventHowOut() != null && !evnt.getEventHowOut().isEmpty()) {
								total_wickets_PP += 1;
							}
							break;
						}
					}
				}
			}
		}
		return String.valueOf(total_run_PP)+"-"+String.valueOf(total_wickets_PP);
	}
	
	public static String processThisOverRunsCount(List<Event> events) {
		int total_runs=0;
		if((events != null) && (events.size() > 0)) {
			for(Event evnt : events) {
				if ((evnt.getEventType().equalsIgnoreCase("CHANGE_BOWLER"))) {
					break;
				}
				switch(evnt.getEventType()) {
				case CricketUtil.ONE : case CricketUtil.TWO: case CricketUtil.THREE:  case CricketUtil.FIVE : case CricketUtil.DOT:
		        case CricketUtil.FOUR: case CricketUtil.SIX: 
		        	total_runs += evnt.getEventRuns();
		          break;
		          
		        case CricketUtil.WIDE: case CricketUtil.NO_BALL: case CricketUtil.BYE: case CricketUtil.LEG_BYE: case CricketUtil.PENALTY:
		        	total_runs += evnt.getEventRuns();
		        	break;
		        
		        case CricketUtil.LOG_ANY_BALL:
		        	total_runs += evnt.getEventRuns();
			          if (evnt.getEventExtra() != null) {
			        	 total_runs += evnt.getEventExtraRuns();
			          }
			          if (evnt.getEventSubExtra() != null) {
			        	 total_runs += evnt.getEventSubExtraRuns();
			          }
			          break;
				}
			}
		}
		return String.valueOf(total_runs);
	}
	
	public static String lastFewOversData(String whatToProcess, List<Event> events)
	  {
	    int count_lb = 0;
	    boolean exitLoop = false;
	    if ((events != null) && (events.size() > 0)) {
	      for (Event evnt : events)
	      {
	        if (((whatToProcess.equalsIgnoreCase("BOUNDARY")) && (evnt.getEventType().equalsIgnoreCase(CricketUtil.SIX))) || (evnt.getEventType().equalsIgnoreCase(CricketUtil.FOUR))) {
	          break;
	        }
	        switch (evnt.getEventType())
	        {
	        case CricketUtil.ONE: case CricketUtil.TWO: case CricketUtil.THREE: case CricketUtil.DOT: case CricketUtil.FIVE: case CricketUtil.BYE: 
	        case CricketUtil.LEG_BYE: case CricketUtil.PENALTY: case CricketUtil.LOG_WICKET: 
	          count_lb += 1;
	          break;
	        case CricketUtil.LOG_ANY_BALL: 
	          if (((evnt.getEventRuns() == 4) || (evnt.getEventRuns() == 6)) && (evnt.getEventWasABoundary() != null) && 
	            (evnt.getEventWasABoundary().equalsIgnoreCase("YES"))) {
	            exitLoop = true;
	          }
	          break;
	        }
	        if (exitLoop == true) {
	          break;
	        }
	      }
	    }
	    return String.valueOf(count_lb);
	  }
	
	public static String processPowerPlay(String powerplay_return_type, Inning inning, int total_overs, int total_balls)
	  {
	    int cuEcoent_over = total_overs;
	    if (total_balls > 0) {
	      cuEcoent_over += 1;
	    }
	    String return_pp_txt = "";
	    switch (powerplay_return_type)
	    {
	    case "FULL": 
	      return_pp_txt = "POWERPLAY ";
	      break;
	    case "SHORT": 
	      return_pp_txt = "PP";
	    }
	    
	    if((inning.getFirstPowerplayEndOver() >= cuEcoent_over)) {
	    	return_pp_txt = return_pp_txt + "1";
	    }else if ((inning.getSecondPowerplayEndOver() >= cuEcoent_over) || (inning.getSecondPowerplayStartOver() <= cuEcoent_over )) {
	    	return_pp_txt = return_pp_txt + "2";
	    }else if ((inning.getThirdPowerplayEndOver() >= cuEcoent_over) || (inning.getThirdPowerplayStartOver() <= cuEcoent_over )) {
	    	return_pp_txt = return_pp_txt + "3";
	    }
	    
	    return return_pp_txt;
	  }
	
	public static String ProjectedScore(Match match,Inning inn) {
		
		int PS_Curr=0;
		String PS_1="", PS_2="", PS_3="";
		String RR1="",RR2="",RR3="",RR_Curr="";
		int remaining_overs = ((match.getMaxOvers()*6) - ((inn.getTotalOvers()*6)+inn.getTotalBalls()));
		
		PS_Curr = (int) ((inn.getTotalRuns() + (remaining_overs * Double.valueOf(inn.getRunRate())))/6);
		RR_Curr = inn.getRunRate();
		
		String[] arr = inn.getRunRate().split("\\.");
	    int[] intArr=new int[2];
	    intArr[0]=Integer.parseInt(arr[0]);
	    
		for(int i=2;i<=6;i = i+2) {
			if(i==2) {
				PS_1 = String.valueOf((inn.getTotalRuns() + remaining_overs * (intArr[0]+ i))/6);
				RR1 = String.valueOf(intArr[0] + i);
			}
			else if(i==4) {
				PS_2 = String.valueOf((inn.getTotalRuns() + remaining_overs * (intArr[0] + i))/6);
				RR2 = String.valueOf(intArr[0] + i);
			}
			else if(i==6) {
				PS_3 = String.valueOf((inn.getTotalRuns() + remaining_overs * (intArr[0] + i))/6);
				RR3 = String.valueOf(intArr[0] + i);
			}
		}
		return String.valueOf(PS_Curr)+","+RR_Curr+","+PS_1+","+ RR1 +","+ PS_2 +","+ RR2 +","+ PS_3 +","+ RR3 ;
	}
	
	public static String compareInningData(String whatToProcess, String separator, Match match,int inn, List<Event> events) {
		int total_runs = 0,total_wickets=0;
		String t_count="";
		Collections.reverse(events);
		if((events != null) && (events.size() > 0)) {
			for (Event evnt : events) {
				if(evnt.getEventInningNumber() == inn) {
					//System.out.println(evnt.getEventType());
					switch (evnt.getEventType()) 
					{
					case CricketUtil.ONE : case CricketUtil.TWO: case CricketUtil.THREE:  case CricketUtil.FIVE : case CricketUtil.DOT:
			        case CricketUtil.FOUR: case CricketUtil.SIX: 
			        	total_runs += evnt.getEventRuns();
			          break;
			          
			        case CricketUtil.WIDE: case CricketUtil.NO_BALL: case CricketUtil.BYE: case CricketUtil.LEG_BYE: case CricketUtil.PENALTY:
			        	total_runs += evnt.getEventRuns();
			        	break;
			        	
			        case CricketUtil.LOG_WICKET:
			        	total_wickets += 1;
			        	break;
			        
			        case CricketUtil.LOG_ANY_BALL:
			        	total_runs += evnt.getEventRuns();
				          if (evnt.getEventExtra() != null) {
				        	 total_runs += evnt.getEventExtraRuns();
				          }
				          if (evnt.getEventSubExtra() != null) {
				        	 total_runs += evnt.getEventSubExtraRuns();
				          }
				          if (evnt.getEventHowOut() != null && !evnt.getEventHowOut().isEmpty()) {
				        	  total_wickets += 1;
				          }
				          break;
					}
					if(evnt.getEventOverNo() == match.getInning().get(1).getTotalOvers() && evnt.getEventBallNo() == match.getInning().get(1).getTotalBalls()) {
						t_count = total_runs + separator + total_wickets;
				        //break; 
					}
				}
			}
		}
		return t_count;
	}
}
