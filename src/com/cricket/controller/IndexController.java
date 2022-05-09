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
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;

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
@SessionAttributes(value={"session_match","session_event_file","session_selected_broadcaster"})
public class IndexController 
{
	@Autowired
	CricketService cricketService;
	public static Configurations session_Configurations;
	
	String CONFIGURATIONS_DIRECTORY = "Configurations/", COMMENTATOR_CONFIG = "COMMENTATOR.XML";

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
		
		if(new File(CricketUtil.CRICKET_DIRECTORY + CONFIGURATIONS_DIRECTORY + COMMENTATOR_CONFIG).exists()) {
            session_Configurations = (Configurations)JAXBContext.newInstance(Configurations.class).createUnmarshaller().unmarshal(
                    new File(CricketUtil.CRICKET_DIRECTORY + CONFIGURATIONS_DIRECTORY + COMMENTATOR_CONFIG));
        }
        else {
            session_Configurations = new Configurations();
            System.out.println(CricketUtil.CRICKET_DIRECTORY + CONFIGURATIONS_DIRECTORY + COMMENTATOR_CONFIG);
            JAXBContext.newInstance(Configurations.class).createMarshaller().marshal(session_Configurations,
                    new File(CricketUtil.CRICKET_DIRECTORY + CONFIGURATIONS_DIRECTORY + COMMENTATOR_CONFIG));
        }
		return "initialise";
	}

	@RequestMapping(value = {"/commentator"}, method={RequestMethod.GET,RequestMethod.POST}) 
	public String commentatorPage(ModelMap model,
			@ModelAttribute("session_match") Match session_match,
			@ModelAttribute("session_event_file") EventFile session_event_file,
			@ModelAttribute("session_selected_broadcaster") String session_selected_broadcaster,
			@RequestParam(value = "select_inning", required = false, defaultValue = "") String select_inning,
			@RequestParam(value = "select_broadcaster", required = false, defaultValue = "") String select_broadcaster,
			@RequestParam(value = "select_cricket_matches", required = false, defaultValue = "") String selectedMatch) 
					throws IllegalAccessException, InvocationTargetException, JAXBException
	{
		session_selected_broadcaster = select_broadcaster;
		
		session_Configurations = new Configurations();
		session_Configurations.setFilename(selectedMatch);
		session_Configurations.setBroadcaster(select_broadcaster);
		
		JAXBContext.newInstance(Configurations.class).createMarshaller().marshal(session_Configurations,
				new File(CricketUtil.CRICKET_DIRECTORY + CONFIGURATIONS_DIRECTORY + COMMENTATOR_CONFIG));

		
		session_match = CricketFunctions.populateMatchVariables(cricketService, (Match) JAXBContext.newInstance(Match.class).createUnmarshaller().unmarshal(
				new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.MATCHES_DIRECTORY + selectedMatch)));
		session_match.setMatchFileName(selectedMatch);
		
		session_event_file = (EventFile) JAXBContext.newInstance(EventFile.class).createUnmarshaller().unmarshal(
				new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.EVENT_DIRECTORY + selectedMatch));
		
		session_match.setMatchFileTimeStamp(new SimpleDateFormat("dd-MM-yyyy HH:mm:ss").format(new Date()));
		
		model.addAttribute("session_match", session_match);
		model.addAttribute("session_selected_broadcaster", session_selected_broadcaster);
		
		return "fruit";
	}
	
	@RequestMapping(value = {"/processCricketProcedures"}, method={RequestMethod.GET,RequestMethod.POST})    
	public @ResponseBody String processCricketProcedures(
			@ModelAttribute("session_match") Match session_match,
			@ModelAttribute("session_event_file") EventFile session_event_file,
			@ModelAttribute("session_selected_broadcaster") String session_selected_broadcaster,
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
				
				session_event_file = (EventFile) JAXBContext.newInstance(EventFile.class).createUnmarshaller().unmarshal(
						new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.EVENT_DIRECTORY + session_match.getMatchFileName()));
				
				Collections.reverse(session_event_file.getEvents());
				
				session_match.setMatchFileTimeStamp(new SimpleDateFormat("dd-MM-yyyy HH:mm:ss").format(
						new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.MATCHES_DIRECTORY + session_match.getMatchFileName()).lastModified()));
				
				Map<String, String> this_stats = new HashMap<String,String>();
				for(Inning inn : session_match.getInning()){
					this_stats.put(CricketUtil.OVER + inn.getInningNumber(), CricketFunctions.OverBalls(inn.getTotalOvers(), inn.getTotalBalls()));
					this_stats.put("COMPARE" + inn.getInningNumber(),calRunsWickets("COMPARE" ,inn , session_event_file.getEvents()));
					if(inn.getIsCurrentInning().equalsIgnoreCase(CricketUtil.YES)) {
						this_stats.put(CricketUtil.POWERPLAY, CricketFunctions.processPowerPlay(CricketUtil.SHORT, inn, inn.getTotalOvers(), inn.getTotalBalls()));
						this_stats.put(CricketUtil.OVER, getEventsText(CricketUtil.OVER, ",", session_event_file.getEvents()));
						this_stats.put(CricketUtil.BOUNDARY, lastFewOversData(CricketUtil.BOUNDARY, inn, session_event_file.getEvents()));
						this_stats.put(CricketUtil.INNING_STATUS, CricketFunctions.generateMatchSummaryStatus(inn.getInningNumber(), session_match, CricketUtil.SHORT));
						this_stats.put("PLURAL",CricketFunctions.Plural(inn.getTotalOvers()));
					}
					inn.setStats(this_stats);
					//System.out.println(this_stats.get("COMPARE" + inn.getInningNumber()));
				}
			}

			return JSONObject.fromObject(session_match).toString();

		default:
			return JSONObject.fromObject(null).toString();
		}
	}
	public static String calRunsWickets(String whatToProcess,Inning inning, List<Event> events) {
		int total_runs = 0,total_wickets=0;
		boolean exitLoop = false;
		Collections.reverse(events);
		if((events != null) && (events.size() > 0)) {
			for (Event evnt : events) {
				if((evnt.getEventOverNo() == inning.getTotalOvers()) && (evnt.getEventBallNo() == inning.getTotalBalls())) {
					break;
				}
				
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
		        	if(inning.getTotalWickets() > total_wickets) {
		        		total_wickets += 1;
		        		exitLoop = true;
		        	}
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
				if (exitLoop == true) {
		  	          break;
		  	    }
			}
		}
		return total_runs + "-" + total_wickets;
	}

	public static String lastFewOversData(String whatToProcess,Inning inning, List<Event> events)
	  {
	    int count_lb = 0;
	    boolean exitLoop = false;
	    if ((events != null) && (events.size() > 0)) {
	      for (Event evnt : events)
	      {
	    	if(inning.getInningNumber() == evnt.getEventInningNumber()) {
	    		if (((whatToProcess.equalsIgnoreCase(CricketUtil.BOUNDARY)) && (evnt.getEventType().equalsIgnoreCase(CricketUtil.SIX))) || 
	    				(evnt.getEventType().equalsIgnoreCase(CricketUtil.FOUR)) &&
	    				(evnt.getEventWasABoundary() != null) && (evnt.getEventWasABoundary().equalsIgnoreCase(CricketUtil.YES))){
	  	          break;
	  	        }
	  	        switch (evnt.getEventType())
	  	        {
	  	        case CricketUtil.ONE : case CricketUtil.TWO: case CricketUtil.THREE:  case CricketUtil.FIVE : case CricketUtil.DOT: 
	  	        case CricketUtil.WIDE: case CricketUtil.NO_BALL: case CricketUtil.BYE: case CricketUtil.LEG_BYE: case CricketUtil.PENALTY: 
	  	        case CricketUtil.LOG_WICKET: 
	  	          count_lb += 1;
	  	          break;
	  	        case CricketUtil.FOUR: case CricketUtil.SIX:
	  	    	  if(evnt.getEventWasABoundary() == null) {
	  	    		count_lb += 1;
	  	    	  }
	  	    	  break;
	  	        case CricketUtil.LOG_ANY_BALL: 
	  	          if (((evnt.getEventRuns() == 4) || (evnt.getEventRuns() == 6)) && (evnt.getEventWasABoundary() != null) && 
	  	        		  (evnt.getEventWasABoundary().equalsIgnoreCase(CricketUtil.YES))) {
	  	            exitLoop = true;
	  	          }
	  	          else {
	  	        	  count_lb += 1; 
	  	          }
	  	          break;
	  	        }
	  	        if (exitLoop == true) {
	  	          break;
	  	        }
	    	}
	      }
	    }
	    return String.valueOf(count_lb);
	  }
	
	public static String getEventsText(String whatToProcess, String seperatorType, List<Event> events)
	  {
	    int total_runs = 0;
	    String this_over = "";String this_ball_data = "";
	    if ((events != null) && (events.size() > 0)) {
	      for (Event evnt : events)
	      {
	        if ((whatToProcess.equalsIgnoreCase(CricketUtil.OVER)) && (evnt.getEventType().equalsIgnoreCase(CricketUtil.CHANGE_BOWLER))) {
	          break;
	        }
	        this_ball_data = "";
	        switch (evnt.getEventType())
	        {
	        case CricketUtil.ONE : case CricketUtil.TWO: case CricketUtil.THREE:  case CricketUtil.FIVE : case CricketUtil.DOT:
	        case CricketUtil.FOUR: case CricketUtil.SIX: 
	          this_ball_data = String.valueOf(evnt.getEventRuns());
	          total_runs += evnt.getEventRuns();
	          break;
	        case CricketUtil.WIDE: case CricketUtil.NO_BALL: case CricketUtil.BYE: case CricketUtil.LEG_BYE: case CricketUtil.PENALTY:
	          this_ball_data = String.valueOf(evnt.getEventRuns()) + evnt.getEventType();
	          switch (evnt.getEventType())
	          {
	          case CricketUtil.WIDE: case CricketUtil.NO_BALL:
	            total_runs = total_runs + evnt.getEventRuns() + evnt.getEventExtraRuns() + evnt.getEventSubExtraRuns();
	          }
	          break;
	        case CricketUtil.LOG_WICKET: 
	          if (evnt.getEventRuns() > 0) {
	            this_ball_data = String.valueOf(evnt.getEventRuns()) + "+" + evnt.getEventType();
	          } else {
	            this_ball_data = evnt.getEventType();
	          }
	          total_runs = total_runs + evnt.getEventRuns() + evnt.getEventExtraRuns() + evnt.getEventSubExtraRuns();
	          break;
	        case CricketUtil.LOG_ANY_BALL:
	          if (evnt.getEventExtra() != null) {
	            this_ball_data = evnt.getEventExtra();
	          }
	          if (evnt.getEventSubExtra() != null)
	          {
	            if (this_ball_data.isEmpty()) {
	              this_ball_data = evnt.getEventSubExtra();
	            } else {
	              this_ball_data = this_ball_data + "+" + evnt.getEventSubExtra();
	            }
	            if (evnt.getEventExtraRuns() > 0) {
	              if (this_ball_data.isEmpty()) {
	                this_ball_data = String.valueOf(evnt.getEventExtraRuns());
	              } else {
	                this_ball_data = this_ball_data + String.valueOf(evnt.getEventExtraRuns());
	              }
	            }
	          }
	          if (evnt.getEventRuns() > 0) {
	            if (this_ball_data.isEmpty()) {
	              this_ball_data = String.valueOf(evnt.getEventRuns());
	            } else {
	              this_ball_data = this_ball_data + "+" + String.valueOf(evnt.getEventRuns());
	            }
	          }
	          if (evnt.getEventHowOut() != null && !evnt.getEventHowOut().isEmpty()) {
	            if (this_ball_data.isEmpty()) {
	              this_ball_data = "WICKET";
	            } else {
	              this_ball_data = this_ball_data + "+" + "WICKET";
	            }
	          }
	          total_runs = total_runs + evnt.getEventRuns() + evnt.getEventExtraRuns() + evnt.getEventSubExtraRuns();
	        }
	        if (!this_ball_data.isEmpty()) {
	          if (this_over.isEmpty()) {
	            this_over = this_ball_data;
	          } else {
	            this_over = this_over + seperatorType + this_ball_data;
	          }
	        }
	      }
	    }
	    this_over = this_over.replace("WIDE", "wd");
	    this_over = this_over.replace("NO_BALL", "nb");
	    this_over = this_over.replace("LEG_BYE", "lb");
	    this_over = this_over.replace("BYE", "b");
	    this_over = this_over.replace("PENALTY", "pen");
	    this_over = this_over.replace("LOG_WICKET", "w");
	    this_over = this_over.replace("WICKET", "w");
	    
	    return this_over;
	  }
	
	@ModelAttribute("session_selected_broadcaster")
	public String session_selected_broadcaster(){
		return new String();
	}
	@ModelAttribute("session_match")
	public Match session_match(){
		return new Match();
	}
	@ModelAttribute("session_event_file")
	public EventFile session_event_file(){
		return new EventFile();
	}
}