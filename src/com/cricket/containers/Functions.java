package com.cricket.containers;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import com.cricket.model.DuckWorthLewis;
import com.cricket.model.Event;
import com.cricket.model.Inning;
import com.cricket.model.Match;
import com.cricket.model.MatchAllData;
import com.cricket.util.CricketFunctions;
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
	
	public static String ProjectedScore(MatchAllData match) {
		
		String PS_1="", PS_2="", PS_3="", PS_Curr="";
		String RR1="",RR2="",RR3="",RR_Curr="";
		int Over_val = 0;
		if(!match.getSetup().getTargetOvers().isEmpty() && Double.valueOf(match.getSetup().getTargetOvers()) > 0) {
			if(match.getSetup().getTargetOvers().contains(".")) {
				Over_val = (Integer.valueOf(match.getSetup().getTargetOvers().split("\\.")[0]) * 6) 
					+ Integer.valueOf(match.getSetup().getTargetOvers().split("\\.")[1]);
			}else {
				Over_val = Integer.valueOf(match.getSetup().getTargetOvers()) * 6;
			}
		}else {
			Over_val = match.getSetup().getMaxOvers()*6;
		}
		int remaining_balls = ((Over_val) - ((match.getMatch().getInning().get(0).getTotalOvers()*6)+match.getMatch().getInning().get(0).getTotalBalls()));
		double value = (remaining_balls * Double.valueOf(match.getMatch().getInning().get(0).getRunRate()));
		value = value/6;
		
		
		PS_Curr = String.valueOf(Math.round(value + match.getMatch().getInning().get(0).getTotalRuns()));
		RR_Curr = match.getMatch().getInning().get(0).getRunRate();
		
		String[] arr = match.getMatch().getInning().get(0).getRunRate().split("\\.");
		double[] intArr= new double[2];
	    intArr[0]=Integer.parseInt(arr[0]);
	    
		for(int i=2;i<=6;i = i+2) {
			if(i==2) {
				value = (remaining_balls * (intArr[0] + i));
				value = value / 6;
				PS_1 = String.valueOf(Math.round(match.getMatch().getInning().get(0).getTotalRuns() + value));
				RR1 = String.valueOf((int)intArr[0] + i);
			}
			else if(i==4) {
				value = (remaining_balls * (intArr[0] + i));
				value = value / 6;
				PS_2 = String.valueOf(Math.round(match.getMatch().getInning().get(0).getTotalRuns() + value));
				RR2 = String.valueOf((int)intArr[0] + i);
			}
			else if(i==6) {
				value = (remaining_balls * (intArr[0] + i));
				value = value / 6;
				PS_3 = String.valueOf(Math.round(match.getMatch().getInning().get(0).getTotalRuns() + value));
				RR3 = String.valueOf((int)intArr[0] + i);
			}
		}
		return String.valueOf(PS_Curr)+","+RR_Curr+","+PS_1+","+ RR1 +","+ PS_2 +","+ RR2 +","+ PS_3 +","+ RR3 ;
	}
	public static String dls(MatchAllData match) {
		String balls="",data = ""; 
		Document htmlFile = null;
		if(new File("C:\\Sports\\ParScores BB.html").exists()) {
			try { 
				for(Inning inn : match.getMatch().getInning()) {
					if (inn.getIsCurrentInning().toUpperCase().equalsIgnoreCase(CricketUtil.YES)) {
						htmlFile = Jsoup.parse(new File("C:\\Sports\\ParScores BB.html"), "ISO-8859-1");
						balls = CricketFunctions.OverBalls(inn.getTotalOvers(), inn.getTotalBalls());
						
					}
				}
			} catch (IOException e) {  
				e.printStackTrace(); 
			} 
			
			List<DuckWorthLewis> this_dls = new ArrayList<DuckWorthLewis>();
			for(int i=14; i<htmlFile.body().getElementsByTag("font").size() - 1;i++) {
				if(htmlFile.body().getElementsByTag("font").get(i).text().contains("TableID")) {
					i = i + 15;
					if(i > htmlFile.body().getElementsByTag("font").size()) {
						break;
					}
				}
				
				for(Inning inn : match.getMatch().getInning()) {
					if (inn.getIsCurrentInning().toUpperCase().equalsIgnoreCase(CricketUtil.YES)) {
						//System.out.println(" i = " + (i+(1+(inn.getTotalWickets()))));
						this_dls.add(new DuckWorthLewis(htmlFile.body().getElementsByTag("font").get(i).text(),
								htmlFile.body().getElementsByTag("font").get(i+(2+(inn.getTotalWickets()))).text()));
					}
				}
				i = i +11;
				
			}
			for(int i = 0; i<= this_dls.size() -1;i++) {
				if(this_dls.get(i).getOver_left().equalsIgnoreCase(balls)) {
					data = this_dls.get(i).getWkts_down();
				}
			}
		}else {
			data = "";
		}
		
		return data;
	}
	public static String populateDls(MatchAllData match) throws InterruptedException 
	{
		String team="",ahead_behind="";
		int runs = 0;
		
		String balls="",data = ""; 
		Document htmlFile = null; 
		if(new File("C:\\Sports\\ParScores BB.html").exists()) {
			try { 
				for(Inning inn : match.getMatch().getInning()) {
					if (inn.getIsCurrentInning().toUpperCase().equalsIgnoreCase(CricketUtil.YES)) {
						htmlFile = Jsoup.parse(new File("C:\\Sports\\ParScores BB.html"), "ISO-8859-1");
						balls = CricketFunctions.OverBalls(inn.getTotalOvers(), inn.getTotalBalls());
						
					}
				}
			} catch (IOException e) {  
				e.printStackTrace(); 
			} 
			
			List<DuckWorthLewis> this_dls = new ArrayList<DuckWorthLewis>();
			for(int i=14; i<htmlFile.body().getElementsByTag("font").size() - 1;i++) {
				if(htmlFile.body().getElementsByTag("font").get(i).text().contains("TableID")) {
					i = i + 15;
					if(i > htmlFile.body().getElementsByTag("font").size()) {
						break;
					}
				}
				
				for(Inning inn : match.getMatch().getInning()) {
					if (inn.getIsCurrentInning().toUpperCase().equalsIgnoreCase(CricketUtil.YES)) {
						//System.out.println(" i = " + (i+(1+(inn.getTotalWickets()))));
						this_dls.add(new DuckWorthLewis(htmlFile.body().getElementsByTag("font").get(i).text(),
								htmlFile.body().getElementsByTag("font").get(i+(2+(inn.getTotalWickets()))).text()));
					}
				}
				i = i +11;
				
			}
			for(int i = 0; i<= this_dls.size() -1;i++) {
				if(this_dls.get(i).getOver_left().equalsIgnoreCase(balls)) {
					data = this_dls.get(i).getWkts_down();
				}
			}
			
			for(Inning inn : match.getMatch().getInning()) {
				if (inn.getIsCurrentInning().toUpperCase().equalsIgnoreCase(CricketUtil.YES)) {
					if(inn.getBattingTeamId() == match.getSetup().getHomeTeamId()) {
						team = match.getSetup().getHomeTeam().getTeamName4();
					}
					if(inn.getBattingTeamId() == match.getSetup().getAwayTeamId()) {
						team = match.getSetup().getAwayTeam().getTeamName4();
					}
					
					for(int i = 0; i<= this_dls.size() -1;i++) {
						if(this_dls.get(i).getOver_left().equalsIgnoreCase(balls)) {
							runs = (inn.getTotalRuns() - Integer.valueOf(this_dls.get(i).getWkts_down()));
						}
					}
					if(runs < 0)
	                {
	                    ahead_behind = team + " ARE " + (Math.abs(runs)) + " RUNS BEHIND";
	                }

	                if (runs > 0)
	                {
	                    ahead_behind = team + " ARE " + runs + " RUNS AHEAD";
	                }
	                
	                if (runs == 0)
	                {
	                	ahead_behind = "DLS SCORE ARE LEVEL";
	                }
				}
			}
		}else {
			ahead_behind = "";
		}
		
		return ahead_behind;
	}
}
