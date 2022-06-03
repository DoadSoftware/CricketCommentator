package com.cricket.controller;

import java.io.File;
import java.io.FileFilter;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cricket.containers.Configurations;
import com.cricket.model.Event;
import com.cricket.model.EventFile;
import com.cricket.model.Inning;
import com.cricket.model.Match;
import com.cricket.service.CricketService;
import com.cricket.util.CricketFunctions;
import com.cricket.util.CricketUtil;


import net.sf.json.JSONObject;

@Controller
public class IndexController 
{
	@Autowired
	CricketService cricketService;

	public static Configurations session_Configurations;
	public static Match session_match;
	public static EventFile session_event_file;
	public static String session_selected_broadcaster;

	@RequestMapping(value = {"/","/initialise"}, method={RequestMethod.GET,RequestMethod.POST}) 
	public String initialisePage(ModelMap model) throws JAXBException  
	{
		model.addAttribute("match_files", new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.MATCHES_DIRECTORY).listFiles(new FileFilter() {
			@Override
		    public boolean accept(File pathname) {
		        String name = pathname.getName().toLowerCase();
		        return name.endsWith(".xml") && pathname.isFile();
		    }
		}));
		
		if(new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.CONFIGURATIONS_DIRECTORY + CricketUtil.COMMENTATOR_XML).exists()) {
            session_Configurations = (Configurations)JAXBContext.newInstance(Configurations.class).createUnmarshaller().unmarshal(
                    new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.CONFIGURATIONS_DIRECTORY + CricketUtil.COMMENTATOR_XML));
        } else {
            session_Configurations = new Configurations();
			JAXBContext.newInstance(Configurations.class).createMarshaller().marshal(session_Configurations, 
					new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.CONFIGURATIONS_DIRECTORY + CricketUtil.COMMENTATOR_XML));
        }
		return "initialise";
	}

	@RequestMapping(value = {"/commentator"}, method={RequestMethod.GET,RequestMethod.POST}) 
	public String commentatorPage(ModelMap model,
			@RequestParam(value = "select_inning", required = false, defaultValue = "") String select_inning,
			@RequestParam(value = "select_broadcaster", required = false, defaultValue = "") String select_broadcaster,
			@RequestParam(value = "select_cricket_matches", required = false, defaultValue = "") String selectedMatch) 
					throws IllegalAccessException, InvocationTargetException, JAXBException
	{
		session_selected_broadcaster = select_broadcaster;
		
		session_Configurations = new Configurations(selectedMatch, select_broadcaster);
		
		JAXBContext.newInstance(Configurations.class).createMarshaller().marshal(session_Configurations,
				new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.CONFIGURATIONS_DIRECTORY + CricketUtil.COMMENTATOR_XML));
		
		session_match = CricketFunctions.populateMatchVariables(cricketService, (Match) JAXBContext.newInstance(Match.class).createUnmarshaller().unmarshal(
				new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.MATCHES_DIRECTORY + selectedMatch)));
//		session_match.setMatchFileName(selectedMatch);
		session_match.setMatchFileTimeStamp(new SimpleDateFormat("dd-MM-yyyy HH:mm:ss").format(new Date()));
		
		session_event_file = (EventFile) JAXBContext.newInstance(EventFile.class).createUnmarshaller().unmarshal(
				new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.EVENT_DIRECTORY + selectedMatch));
		
		model.addAttribute("session_match", session_match);
		model.addAttribute("session_selected_broadcaster", session_selected_broadcaster);
		
		return "fruit";
	}
	
	@RequestMapping(value = {"/processCricketProcedures"}, method={RequestMethod.GET,RequestMethod.POST})    
	public @ResponseBody String processCricketProcedures(
			@RequestParam(value = "whatToProcess", required = false, defaultValue = "") String whatToProcess,
			@RequestParam(value = "valueToProcess", required = false, defaultValue = "") String valueToProcess) 
					throws IOException, IllegalAccessException, InvocationTargetException, JAXBException
	{	
		switch (whatToProcess.toUpperCase()) {
		case "CHECK-NUMBER-INNINGS":

			session_match = CricketFunctions.populateMatchVariables(cricketService, (Match) JAXBContext.newInstance(Match.class).createUnmarshaller().unmarshal(
					new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.MATCHES_DIRECTORY + valueToProcess)));
			
			return JSONObject.fromObject(session_match).toString();

		case "READ-MATCH-AND-POPULATE":
			
			if(!valueToProcess.equalsIgnoreCase(new SimpleDateFormat("dd-MM-yyyy HH:mm:ss").format(
					new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.MATCHES_DIRECTORY + session_match.getMatchFileName()).lastModified())))
			{
				session_match = CricketFunctions.populateMatchVariables(cricketService, (Match) JAXBContext.newInstance(Match.class).createUnmarshaller().unmarshal(
						new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.MATCHES_DIRECTORY + session_match.getMatchFileName())));

				session_match.setMatchFileTimeStamp(new SimpleDateFormat("dd-MM-yyyy HH:mm:ss").format(
						new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.MATCHES_DIRECTORY + session_match.getMatchFileName()).lastModified()));
				
				session_event_file = (EventFile) JAXBContext.newInstance(EventFile.class).createUnmarshaller().unmarshal(
						new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.EVENT_DIRECTORY + session_match.getMatchFileName()));
				
				Collections.reverse(session_event_file.getEvents());
				
				Map<String, String> this_stats = new HashMap<String,String>();
				for(Inning inn : session_match.getInning()){
					this_stats.put(CricketUtil.OVER + inn.getInningNumber(), CricketFunctions.OverBalls(inn.getTotalOvers(), inn.getTotalBalls()));
					this_stats.put(CricketUtil.COMPARE + inn.getInningNumber() , compareInningData(CricketUtil.COMPARE, "-", inn, session_event_file.getEvents()));
					if(inn.getIsCurrentInning().equalsIgnoreCase(CricketUtil.YES)) {
						this_stats.put(CricketUtil.POWERPLAY, processPowerPlay(CricketUtil.SHORT, inn, inn.getTotalOvers(), inn.getTotalBalls()));
						this_stats.put(CricketUtil.OVER, CricketFunctions.getEventsText(CricketUtil.OVER, ",", session_event_file.getEvents()));
						this_stats.put(CricketUtil.BOUNDARY, CricketFunctions.lastFewOversData(CricketUtil.BOUNDARY, inn, session_event_file.getEvents()));
						this_stats.put(CricketUtil.INNING_STATUS, CricketFunctions.generateMatchSummaryStatus(inn.getInningNumber(), session_match, CricketUtil.SHORT));
						this_stats.put(CricketUtil.PLURAL,CricketFunctions.Plural(inn.getTotalOvers()));
						this_stats.put("Req_RR", CricketFunctions.GenerateRunRate(CricketFunctions.getRequiredRuns(session_match), 0, CricketFunctions.getRequiredBalls(session_match), 2));
						this_stats.put("PS", ProjectedScore(inn));
						this_stats.put("ThisOver", processThisOversRunsCount(session_event_file.getEvents()));
						this_stats.put("PPS", getPowerPlayScore(inn,inn.getInningNumber(),session_event_file.getEvents()));
						this_stats.put("DOTBALLS", countDotBalls(session_match, inn,inn.getInningNumber() , session_event_file.getEvents()));
						
					}
					inn.setStats(this_stats);
					//System.out.println(this_stats.get(CricketUtil.DOT));
					//System.out.println("traget runs:" + (CricketFunctions.getTargetRuns(session_match) - inn.getTotalRuns()) +" "+ "traget balls:" + CricketFunctions.getRequiredBalls(session_match));
				}
			}

			return JSONObject.fromObject(session_match).toString();

		default:
			return JSONObject.fromObject(null).toString();
		}
	}
	
	public static String countDotBalls(Match match,Inning inning,int inn_num,List<Event> events) {
		int countBalls=0;
		if((events != null) && (events.size() > 0)) {
			for(Event evnt : events) {
				if(evnt.getEventInningNumber() == inn_num) {
					int Event_overs = ((evnt.getEventOverNo()*6)+evnt.getEventBallNo());
					if(Event_overs <= (match.getMaxOvers()*6)) {
						switch(evnt.getEventType()) {
						case CricketUtil.DOT:
							countBalls++;
						}
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
	
	
	public static String processThisOversRunsCount(List<Event> events) {
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
	
	public static String ProjectedScore(Inning inn) {
		
		int PS_Curr=0;
		String PS_1="", PS_2="", PS_3="";
		String RR1_count="",RR2_count="",RR3_count="";
		int remaining_overs = (session_match.getMaxOvers() - inn.getTotalOvers());
		
		PS_Curr = (int) (inn.getTotalRuns() + remaining_overs * Double.valueOf(inn.getRunRate()));
		
		String[] arr = inn.getRunRate().split("\\.");
	    int[] intArr=new int[2];
	    intArr[0]=Integer.parseInt(arr[0]);
	    
		for(int i=1;i<=3;i++) {
			if(i==1) {
				PS_1 = String.valueOf((inn.getTotalRuns() + remaining_overs * (intArr[0]=Integer.parseInt(arr[0]) + i)));
				RR1_count = String.valueOf(intArr[0]=Integer.parseInt(arr[0]) + i);
			}
			else if(i==2) {
				PS_2 = String.valueOf((inn.getTotalRuns() + remaining_overs * (intArr[0]=Integer.parseInt(arr[0]) + i)));
				RR2_count = String.valueOf(intArr[0]=Integer.parseInt(arr[0]) + i);
			}
			else if(i==3) {
				PS_3 = String.valueOf((inn.getTotalRuns() + remaining_overs * (intArr[0]=Integer.parseInt(arr[0]) + i)));
				RR3_count = String.valueOf(intArr[0]=Integer.parseInt(arr[0]) + i);
			}
		}
		return String.valueOf(PS_Curr)+"("+inn.getRunRate()+")" +" | "+ PS_1 +"("+RR1_count+")" +" | "+ PS_2 +"("+RR2_count+")" +" | "+ PS_3 +"("+RR3_count+")";
	}
	
	public static String compareInningData(String whatToProcess, String separator, Inning inning, List<Event> events) {
		int total_runs = 0,total_wickets=0,count_balls=0;
		if(inning.getInningNumber() == 2) {
			count_balls=((inning.getTotalOvers()*6)+inning.getTotalBalls());
		}
		if((events != null) && (events.size() > 0)) {
			for (Event evnt : events) {
				if(evnt.getEventInningNumber() == 1) {
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
					if(count_balls == ((evnt.getEventOverNo()*6)+evnt.getEventBallNo())) {
						break;
					}
					System.out.println();
				}
			}
		}
		return total_runs + "-" + total_wickets;
	}
}