package com.cricket.controller;

import java.io.File;
import java.io.FileFilter;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
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
import com.cricket.containers.Functions;
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
				
				
				Map<String, String> this_stats = new HashMap<String,String>();
				for(Inning inn : session_match.getInning()){
					this_stats.put(CricketUtil.OVER + inn.getInningNumber(), CricketFunctions.OverBalls(inn.getTotalOvers(), inn.getTotalBalls()));
					this_stats.put(CricketUtil.COMPARE , CricketFunctions.compareInningData(session_match,"-",1,session_event_file.getEvents()));
					this_stats.put(CricketUtil.TOSS, CricketFunctions.generateTossResult(session_match, "", "", CricketUtil.SHORT));
					this_stats.put("DOTBALLS" + inn.getInningNumber(), Functions.countDotBalls(inn.getInningNumber(), session_event_file.getEvents()));
					if(inn.getIsCurrentInning().equalsIgnoreCase(CricketUtil.YES)) {
						this_stats.put(CricketUtil.POWERPLAY, CricketFunctions.processPowerPlay(CricketUtil.MINI, inn, inn.getTotalOvers(), inn.getTotalBalls()));
						this_stats.put(CricketUtil.INNING_STATUS, CricketFunctions.generateMatchSummaryStatus(inn.getInningNumber(), session_match, CricketUtil.SHORT).toUpperCase());
						this_stats.put(CricketUtil.PLURAL,CricketFunctions.Plural(inn.getTotalOvers()));
						this_stats.put("Req_RR", CricketFunctions.generateRunRate(CricketFunctions.getRequiredRuns(session_match), 0, CricketFunctions.getRequiredBalls(session_match), 2));
						this_stats.put("PS", Functions.ProjectedScore(session_match));
						//this_stats.put("PPS", CricketFunctions.getPowerPlayScore(inn,inn.getInningNumber(),'-', session_event_file.getEvents()));
						
						Collections.reverse(session_event_file.getEvents());
							this_stats.put("ThisOver",CricketFunctions.processThisOverRunsCount(session_event_file.getEvents()));
							this_stats.put(CricketUtil.OVER, CricketFunctions.getEventsText(CricketUtil.OVER, ",", session_event_file.getEvents()));
							this_stats.put(CricketUtil.BOUNDARY, CricketFunctions.lastFewOversData(CricketUtil.BOUNDARY, session_event_file.getEvents()));
					}
					inn.setStats(this_stats);
				}
			}

			return JSONObject.fromObject(session_match).toString();

		default:
			return JSONObject.fromObject(null).toString();
		}
	}
}