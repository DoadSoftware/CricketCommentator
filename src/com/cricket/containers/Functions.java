package com.cricket.containers;

import java.util.List;

import com.cricket.model.Event;
import com.cricket.model.Inning;
import com.cricket.model.Match;
import com.cricket.util.CricketUtil;
import com.cricket.util.CricketFunctions;

public class Functions 
{
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
	
	public static String generateMatchSummaryStatus(int whichInning, Match match, String teamNameType)
	  {
	    if (match.getMaxOvers() <= 0) {
	    	System.out.println("EROR: generateMatchSummaryStatus NOT available for test matches");
	    } else {
	      switch (whichInning) {
	      case 1: case 2: 
	        break;
	      default: 
	        System.out.println("EROR: Selected inning is wrong [" + whichInning + "]");
	        return null;
	      }
	    }
	    String teamNameToUse = "", bottomLineText = "";
	    if (CricketFunctions.getRequiredRuns(match) <= 0 || CricketFunctions.getRequiredRuns(match) > 0) {
	    	switch (teamNameType) {
		    case CricketUtil.SHORT: 
		    	teamNameToUse = (match.getInning().get(1)).getBatting_team().getShortname();
		      break;
		    default: 
		    	teamNameToUse = (match.getInning().get(1)).getBatting_team().getFullname();
		    	break;
		    }
	    }
	    else {
	    	switch (teamNameType) {
		    case CricketUtil.SHORT: 
		    	teamNameToUse = (match.getInning().get(0)).getBatting_team().getShortname();
		      break;
		    default: 
		    	teamNameToUse = (match.getInning().get(0)).getBatting_team().getFullname();
		    	break;
		    }
	    }
	    switch (whichInning) {
	    case 1: 
	    	if (((match.getInning().get(whichInning - 1)).getTotalRuns() > 0) || 
	  		      ((match.getInning().get(whichInning - 1)).getTotalOvers() > 0) || 
	  		      ((match.getInning().get(whichInning - 1)).getTotalBalls() > 0)) {
	  		      return "CURRENT RUNRATE" + (match.getInning().get(0)).getRunRate();
	  		    }
	    	else {
	    		return CricketFunctions.generateTossResult(match, CricketUtil.FULL, CricketUtil.FIELD, CricketUtil.FULL);
	    	}
	    case 2:
		    if ((CricketFunctions.getRequiredRuns(match) > 0) && (CricketFunctions.getRequiredBalls(match) > 0) && (CricketFunctions.getWicketsLeft(match) > 0))
		    {
		      switch (teamNameType)
		      {
		      case "SHORT": 
		        bottomLineText = teamNameToUse + " NEED " + CricketFunctions.getRequiredRuns(match) + " MORE RUN" + CricketFunctions.Plural(CricketFunctions.getRequiredRuns(match)) + " TO WIN FROM ";
		        break;
		      default: 
		        bottomLineText = teamNameToUse + " NEED " + CricketFunctions.getRequiredRuns(match) + " MORE RUN" + CricketFunctions.Plural(CricketFunctions.getRequiredRuns(match)) + " TO WIN FROM ";
		      }
		      if (CricketFunctions.getRequiredBalls(match) >= 150) {
		        bottomLineText = bottomLineText + CricketFunctions.OverBalls((match.getInning().get(1)).getTotalOvers(), (match.getInning().get(1)).getTotalBalls()) + " OVER";
		      } else {
		        bottomLineText = bottomLineText + CricketFunctions.getRequiredBalls(match) + " BALL" + CricketFunctions.Plural(CricketFunctions.getRequiredBalls(match));
		      }
		    }
		    else if (CricketFunctions.getRequiredRuns(match) <= 0)
		    {
		    	bottomLineText = teamNameToUse + " WIN BY " + CricketFunctions.getWicketsLeft(match) + " WICKET" + CricketFunctions.Plural(CricketFunctions.getWicketsLeft(match));
		    }
		    else if (CricketFunctions.getRequiredBalls(match) <= 0 || CricketFunctions.getWicketsLeft(match) <= 0)
		    {
		    	bottomLineText = teamNameToUse + " WIN BY " + (CricketFunctions.getRequiredRuns(match) - 1) + " RUN" + CricketFunctions.Plural(CricketFunctions.getRequiredRuns(match) - 1);
		    }
	    }
		return bottomLineText;
		  
	}
}
