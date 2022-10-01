package com.cricket.containers;

import java.util.List;

import com.cricket.model.Event;
import com.cricket.model.Inning;
import com.cricket.model.Match;
import com.cricket.util.CricketUtil;
//import com.cricket.util.CricketFunctions;

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
	
	public static String ProjectedScore(Match match) {
		
		String PS_1="", PS_2="", PS_3="", PS_Curr="";
		String RR1="",RR2="",RR3="",RR_Curr="";
		int Over_val = 0;
		if(match.getTargetOvers() > 0) {
			Over_val = match.getTargetOvers();
		}else {
			Over_val = match.getMaxOvers();
		}
		int remaining_balls = ((Over_val*6) - ((match.getInning().get(0).getTotalOvers()*6)+match.getInning().get(0).getTotalBalls()));
		double value = (remaining_balls * Double.valueOf(match.getInning().get(0).getRunRate()));
		value = value/6;
		
		
		PS_Curr = String.valueOf(Math.round(value + match.getInning().get(0).getTotalRuns()));
		RR_Curr = match.getInning().get(0).getRunRate();
		
		String[] arr = match.getInning().get(0).getRunRate().split("\\.");
		double[] intArr= new double[2];
	    intArr[0]=Integer.parseInt(arr[0]);
	    
		for(int i=2;i<=6;i = i+2) {
			if(i==2) {
				value = (remaining_balls * (intArr[0] + i));
				value = value / 6;
				PS_1 = String.valueOf(Math.round(match.getInning().get(0).getTotalRuns() + value));
				RR1 = String.valueOf((int)intArr[0] + i);
			}
			else if(i==4) {
				value = (remaining_balls * (intArr[0] + i));
				value = value / 6;
				PS_2 = String.valueOf(Math.round(match.getInning().get(0).getTotalRuns() + value));
				RR2 = String.valueOf((int)intArr[0] + i);
			}
			else if(i==6) {
				value = (remaining_balls * (intArr[0] + i));
				value = value / 6;
				PS_3 = String.valueOf(Math.round(match.getInning().get(0).getTotalRuns() + value));
				RR3 = String.valueOf((int)intArr[0] + i);
			}
		}
		return String.valueOf(PS_Curr)+","+RR_Curr+","+PS_1+","+ RR1 +","+ PS_2 +","+ RR2 +","+ PS_3 +","+ RR3 ;
	}
}
