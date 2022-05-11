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
	
	String COMMENTATOR_CONFIG = CricketUtil.COMMENTATOR_XML;

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
		
		if(new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.CONFIGURATIONS_DIRECTORY + COMMENTATOR_CONFIG).exists()) {
            session_Configurations = (Configurations)JAXBContext.newInstance(Configurations.class).createUnmarshaller().unmarshal(
                    new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.CONFIGURATIONS_DIRECTORY + COMMENTATOR_CONFIG));
        }
        else {
            session_Configurations = new Configurations();
            System.out.println(CricketUtil.CRICKET_DIRECTORY + CricketUtil.CONFIGURATIONS_DIRECTORY + COMMENTATOR_CONFIG);
            JAXBContext.newInstance(Configurations.class).createMarshaller().marshal(session_Configurations,
                    new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.CONFIGURATIONS_DIRECTORY + COMMENTATOR_CONFIG));
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
		
		session_Configurations = new Configurations(selectedMatch, select_broadcaster);
		
		JAXBContext.newInstance(Configurations.class).createMarshaller().marshal(session_Configurations,
				new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.CONFIGURATIONS_DIRECTORY + COMMENTATOR_CONFIG));

		
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
					this_stats.put(CricketUtil.COMPARE + inn.getInningNumber() , compareInningData(CricketUtil.COMPARE, "-", inn, session_event_file.getEvents()));
					if(inn.getIsCurrentInning().equalsIgnoreCase(CricketUtil.YES)) {
						this_stats.put(CricketUtil.POWERPLAY, CricketFunctions.processPowerPlay(CricketUtil.SHORT, inn, inn.getTotalOvers(), inn.getTotalBalls()));
						this_stats.put(CricketUtil.OVER, CricketFunctions.getEventsText(CricketUtil.OVER, ",", session_event_file.getEvents()));
						this_stats.put(CricketUtil.BOUNDARY, CricketFunctions.lastFewOversData(CricketUtil.BOUNDARY, inn, session_event_file.getEvents()));
						this_stats.put(CricketUtil.INNING_STATUS, CricketFunctions.generateMatchSummaryStatus(inn.getInningNumber(), session_match, CricketUtil.SHORT));
						this_stats.put(CricketUtil.PLURAL,CricketFunctions.Plural(inn.getTotalOvers()));
					}
					inn.setStats(this_stats);
				}
			}

			return JSONObject.fromObject(session_match).toString();

		default:
			return JSONObject.fromObject(null).toString();
		}
	}
	
	public static String compareInningData(String whatToProcess, String separator, Inning inning, List<Event> events) {
		int total_runs = 0,total_wickets=0;
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
					if((evnt.getEventOverNo() == inning.getTotalOvers()) && (evnt.getEventBallNo() == inning.getTotalBalls())) {
						break;
					}
				}
			}
		}
		return total_runs + "-" + total_wickets;
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