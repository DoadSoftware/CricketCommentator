package com.cricket.controller;

import java.io.File;
import java.io.FileFilter;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.net.Socket;
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

import com.cricket.model.Event;
import com.cricket.model.EventFile;
import com.cricket.model.Inning;
import com.cricket.model.Match;
import com.cricket.service.CricketService;
import com.cricket.util.CricketFunctions;
import com.cricket.util.CricketUtil;


import net.sf.json.JSONObject;

@Controller
@SessionAttributes(value={"session_match","session_selected_inning","session_event_file","session_selected_match","session_selected_broadcaster"})
public class IndexController 
{
	@Autowired
	CricketService cricketService;

	@RequestMapping(value = {"/","/initialise"}, method={RequestMethod.GET,RequestMethod.POST}) 
	public String initialisePage(ModelMap model)  
	{
		model.addAttribute("match_files", new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.MATCHES_DIRECTORY).listFiles(new FileFilter() {
			@Override
		    public boolean accept(File pathname) {
		        String name = pathname.getName().toLowerCase();
		        return name.endsWith(".xml") && pathname.isFile();
		    }
		}));
		
		return "initialise";
	}

	@RequestMapping(value = {"/commentator"}, method={RequestMethod.GET,RequestMethod.POST}) 
	public String commentatorPage(ModelMap model,
			@ModelAttribute("session_selected_match") String session_selected_match,
			@ModelAttribute("session_match") Match session_match,
			@ModelAttribute("session_event_file") EventFile session_event_file,
			@ModelAttribute("session_selected_broadcaster") String session_selected_broadcaster,
			@ModelAttribute("session_selected_inning") int session_selected_inning,
			@RequestParam(value = "select_inning", required = false, defaultValue = "") String select_inning,
			@RequestParam(value = "select_broadcaster", required = false, defaultValue = "") String select_broadcaster,
			@RequestParam(value = "select_cricket_matches", required = false, defaultValue = "") String selectedMatch) 
					throws IllegalAccessException, InvocationTargetException, JAXBException
	{
		session_selected_match = selectedMatch; session_selected_broadcaster = select_broadcaster;
		
		session_match = CricketFunctions.populateMatchVariables(cricketService, (Match) JAXBContext.newInstance(Match.class).createUnmarshaller().unmarshal(
				new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.MATCHES_DIRECTORY + session_selected_match)));
		
		session_event_file = (EventFile) JAXBContext.newInstance(EventFile.class).createUnmarshaller().unmarshal(
				new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.EVENT_DIRECTORY + session_selected_match));
		
		session_match.setMatchFileTimeStamp(new SimpleDateFormat("dd-MM-yyyy HH:mm:ss").format(new Date()));
		
		session_selected_inning = Integer.valueOf(select_inning);
		
		for(Inning inn : session_match.getInning()) {
			if(inn.getInningNumber() == session_selected_inning) {
				inn.setIsCurrentInning(CricketUtil.YES);
			} else {
				inn.setIsCurrentInning(CricketUtil.NO);
			}
		}
		
		model.addAttribute("session_match", session_match);
		model.addAttribute("session_selected_inning", session_selected_inning);
		model.addAttribute("session_selected_match", session_selected_match);
		model.addAttribute("session_selected_broadcaster", session_selected_broadcaster);
		
		return "fruit";
	}
	
	@RequestMapping(value = {"/processCricketProcedures"}, method={RequestMethod.GET,RequestMethod.POST})    
	public @ResponseBody String processCricketProcedures(
			@ModelAttribute("session_match") Match session_match,
			@ModelAttribute("session_event_file") EventFile session_event_file,
			@ModelAttribute("session_socket") Socket session_socket,
			@ModelAttribute("session_viz_scene") String session_viz_scene,
			@ModelAttribute("session_selected_match") String session_selected_match,
			@ModelAttribute("session_selected_broadcaster") String session_selected_broadcaster,
			@ModelAttribute("session_which_graphics_onscreen") String session_which_graphics_onscreen,
			@ModelAttribute("session_selected_inning") int session_selected_inning,
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
					new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.MATCHES_DIRECTORY + session_selected_match).lastModified())))
			{
				session_match = CricketFunctions.populateMatchVariables(cricketService, (Match) JAXBContext.newInstance(Match.class).createUnmarshaller().unmarshal(
						new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.MATCHES_DIRECTORY + session_selected_match)));
				
				session_event_file = (EventFile) JAXBContext.newInstance(EventFile.class).createUnmarshaller().unmarshal(
						new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.EVENT_DIRECTORY + session_selected_match));
				Collections.reverse(session_event_file.getEvents());
				
				session_match.setMatchFileTimeStamp(new SimpleDateFormat("dd-MM-yyyy HH:mm:ss").format(
						new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.MATCHES_DIRECTORY + session_selected_match).lastModified()));
				
				for(Inning inn : session_match.getInning()) {
					if(inn.getInningNumber() == session_selected_inning) {
						inn.setIsCurrentInning(CricketUtil.YES);
					} else {
						inn.setIsCurrentInning(CricketUtil.NO);
					}
					
				}
				
				Map<String, String> this_stats = new HashMap<String,String>();
				for(Inning inn : session_match.getInning()){
					this_stats.put(CricketUtil.OVER + inn.getInningNumber(), CricketFunctions.OverBalls(inn.getTotalOvers(), inn.getTotalBalls()));
				
					if(inn.getIsCurrentInning().equalsIgnoreCase("YES")) {	
						this_stats.put(CricketUtil.OVER, getEventsText(CricketUtil.OVER, ",", session_event_file.getEvents()));
						this_stats.put(CricketUtil.BOUNDARY, getLastBoundary(CricketUtil.BOUNDARY, session_event_file.getEvents()));
					}
					inn.setStats(this_stats);
				}
			}

			return JSONObject.fromObject(session_match).toString();

		default:
			return JSONObject.fromObject(null).toString();
		}
	}
	
	
	public static String getEventsText(String whatToProcess, String seperatorType, List<Event> events)
	  {
	    int total_runs = 0;
	    String this_over = "";String this_ball_data = "";

	    if ((events != null) && (events.size() > 0)) {
	      for (Event evnt : events)
	      {
	    	if(whatToProcess.equalsIgnoreCase(CricketUtil.OVER) && evnt.getEventType().equalsIgnoreCase("CHANGE_BOWLER")) {
	    		break;
	    	}
	    	  
	        this_ball_data = "";
	        switch (evnt.getEventType())
	        {
	        case "1": 
	        case "2": 
	        case "3": 
	        case "0": 
	        case "5": 
	        case "4": 
	        case "6": 
	          this_ball_data = String.valueOf(evnt.getEventRuns());
	          total_runs += evnt.getEventRuns();
	          break;
	        case "WIDE": 
	        case "NO_BALL": 
	        case "BYE": 
	        case "LEG_BYE": 
	        case "PENALTY": 
	          this_ball_data = String.valueOf(evnt.getEventRuns()) + evnt.getEventType();
	          switch (evnt.getEventType())
	          {
	          case "WIDE": 
	          case "NO_BALL": 
	            total_runs = total_runs + evnt.getEventRuns() + evnt.getEventExtraRuns() + evnt.getEventSubExtraRuns();
	          }
	          break;
	        case "LOG_WICKET": 
	          if (evnt.getEventRuns() > 0) {
	            this_ball_data = String.valueOf(evnt.getEventRuns()) + evnt.getEventType();
	          } else {
	            this_ball_data = evnt.getEventType();
	          }
	          total_runs = total_runs + evnt.getEventRuns() + evnt.getEventExtraRuns() + evnt.getEventSubExtraRuns();
	          break;
	        case "LOG_ANY_BALL": 
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
	          if (evnt.getEventHowOut() != null) {
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
	
	public static String getLastBoundary(String whatToProcess, List<Event> events) {
		String last_boundary = "";
		int count_lb = 0;
		if((events != null) && (events.size() > 0)) {
			for(Event evnt : events) {
				if(whatToProcess.equalsIgnoreCase(CricketUtil.BOUNDARY) && evnt.getEventType().equalsIgnoreCase(CricketUtil.SIX) || evnt.getEventType().equalsIgnoreCase(CricketUtil.FOUR)) {
					last_boundary = String.valueOf(count_lb);
					break;
				}
				
				//System.out.println(evnt.getEventType());
				switch(evnt.getEventType()) {
				case "0": case "1": case "2": case "3": case "5": 
				case "WIDE": case "NO_BALL": case "BYE": case "LEG_BYE": case "PENALTY":
				case "LOG_WICKET":
					count_lb = count_lb + 1;
					break;
				/*case "LOG_ANY_BALL":
					if(evnt.getEventRuns() == 4 || evnt.getEventRuns() == 6) {
						if(evnt.getEventWasABoundary().equalsIgnoreCase(CricketUtil.YES)) {
							count_lb = count_lb - count_lb;
							last_boundary = String.valueOf(count_lb);
							break;
						}
					}
					else {
						count_lb = count_lb + 1;
					}
					break;*/
				}
				last_boundary = String.valueOf(count_lb);
				System.out.println("count " + count_lb);
			}
			
		}
		return last_boundary;
	}

	@ModelAttribute("session_selected_match")
	public String session_selected_match(){
		return new String();
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
	@SuppressWarnings("removal")
	@ModelAttribute("session_selected_inning")
	public int session_selected_inning(){
		return new Integer(0);
	}
}