package com.cricket.controller;

import java.io.File;
import java.io.FileFilter;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.net.URISyntaxException;
import java.text.SimpleDateFormat;
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
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.cricket.containers.Configurations;
import com.cricket.containers.Functions;
import com.cricket.model.BattingCard;
import com.cricket.model.BowlingCard;
import com.cricket.model.EventFile;
import com.cricket.model.Inning;
import com.cricket.model.Match;
import com.cricket.model.MatchAllData;
import com.cricket.model.Setup;
import com.cricket.service.CricketService;
import com.cricket.util.CricketFunctions;
import com.cricket.util.CricketUtil;
import com.fasterxml.jackson.core.exc.StreamWriteException;
import com.fasterxml.jackson.databind.DatabindException;
import com.fasterxml.jackson.databind.ObjectMapper;

import net.sf.json.JSONObject;

@Controller
public class IndexController 
{
	@Autowired
	CricketService cricketService;

	public static Configurations session_Configurations;
	public static MatchAllData session_match;
	public static String session_selected_broadcaster;
	String session_selected_page;
	boolean bowler_Found = false;
	public boolean match_file_change = false;
	public static long time_elapsed = 0;
	public static long last_setup_time_stamp = 0;
	public static long last_match_time_stamp = 0;
	
	int bowler = 0;
	@RequestMapping(value = {"/","/initialise"}, method={RequestMethod.GET,RequestMethod.POST}) 
	public String initialisePage(ModelMap model) throws JAXBException  
	{
		model.addAttribute("match_files", new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.MATCHES_DIRECTORY).listFiles(new FileFilter() {
			@Override
		    public boolean accept(File pathname) {
		        String name = pathname.getName().toLowerCase();
		        return name.endsWith(".json") && pathname.isFile();
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
	
	@RequestMapping(value = {"/change_to_teams","/change_to_ident","/change_to_fruit"}, method={RequestMethod.GET,RequestMethod.POST}) 
	public String processUserSelectionData(ModelMap model,MultipartHttpServletRequest request) 
					throws IllegalAccessException, InvocationTargetException, JAXBException, StreamWriteException, DatabindException, IOException, URISyntaxException
	{
		if(request.getRequestURI().contains("change_to_teams")) {
			session_selected_page = "teams";
			model.addAttribute("session_selected_page", session_selected_page);
			model.addAttribute("session_match", session_match);
			return "teams";
		}else if(request.getRequestURI().contains("change_to_ident")) {
			session_selected_page = "ident";
			model.addAttribute("session_selected_page", session_selected_page);
			model.addAttribute("session_match", session_match);
			return "ident";
		}else {
			session_selected_page = "fruit";
			model.addAttribute("session_selected_page", session_selected_page);
			model.addAttribute("session_match", session_match);
			return "fruit";
		}
	}
	
	@RequestMapping(value = {"/commentator"}, method={RequestMethod.GET,RequestMethod.POST}) 
	public String commentatorPage(ModelMap model,
			@RequestParam(value = "select_page", required = false, defaultValue = "") String select_page,
			@RequestParam(value = "select_inning", required = false, defaultValue = "") String select_inning,
			@RequestParam(value = "select_broadcaster", required = false, defaultValue = "") String select_broadcaster,
			@RequestParam(value = "select_cricket_matches", required = false, defaultValue = "") String selectedMatch) 
					throws IllegalAccessException, InvocationTargetException, JAXBException, StreamWriteException, DatabindException, IOException, URISyntaxException
	{
		session_selected_page = select_page;
		session_selected_broadcaster = select_broadcaster;
		
		last_match_time_stamp = new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.MATCHES_DIRECTORY + selectedMatch).lastModified();
		last_setup_time_stamp = new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.SETUP_DIRECTORY + selectedMatch).lastModified();
		
		session_Configurations = new Configurations(selectedMatch, select_broadcaster);
		
		JAXBContext.newInstance(Configurations.class).createMarshaller().marshal(session_Configurations,
				new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.CONFIGURATIONS_DIRECTORY + CricketUtil.COMMENTATOR_XML));
		//session_match.setMatch(new Match());
		session_match = new MatchAllData();
		if(new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.SETUP_DIRECTORY + 
				selectedMatch).exists()) {
			session_match.setSetup(new ObjectMapper().readValue(new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.SETUP_DIRECTORY + 
					selectedMatch), Setup.class));
			session_match.setMatch(new ObjectMapper().readValue(new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.MATCHES_DIRECTORY + 
					selectedMatch), Match.class));
		}
		if(new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.EVENT_DIRECTORY + 
				selectedMatch).exists()) {
			session_match.setEventFile(new ObjectMapper().readValue(new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.EVENT_DIRECTORY + 
					selectedMatch), EventFile.class));
		}
		session_match.getMatch().setMatchFileName(selectedMatch);
		session_match = CricketFunctions.populateMatchVariables(cricketService, CricketFunctions.readOrSaveMatchFile(CricketUtil.READ,CricketUtil.SETUP + "," + 
				CricketUtil.MATCH + "," + CricketUtil.EVENT, session_match));
		session_match.getSetup().setMatchFileTimeStamp(new SimpleDateFormat("dd-MM-yyyy HH:mm:ss").format(new Date()));
		
		model.addAttribute("session_selected_page", session_selected_page);
		model.addAttribute("session_match", session_match);
		model.addAttribute("session_selected_broadcaster", session_selected_broadcaster);
		switch(session_selected_page) {
		case "fruit":
			return "fruit";
		case "teams":
			return "teams";
		case "ident":
			return "ident";	
		}
		return null;
	}
	
	@RequestMapping(value = {"/processCricketProcedures"}, method={RequestMethod.GET,RequestMethod.POST})    
	public @ResponseBody String processCricketProcedures(
			@RequestParam(value = "whatToProcess", required = false, defaultValue = "") String whatToProcess,
			@RequestParam(value = "valueToProcess", required = false, defaultValue = "") String valueToProcess) 
					throws IOException, IllegalAccessException, InvocationTargetException, JAXBException, URISyntaxException, InterruptedException
	{	
		switch (whatToProcess.toUpperCase()) {
		case "CHECK-NUMBER-INNINGS":

			session_match = CricketFunctions.populateMatchVariables(cricketService, CricketFunctions.readOrSaveMatchFile(CricketUtil.READ,CricketUtil.SETUP + "," + 
					CricketUtil.MATCH + "," + CricketUtil.EVENT, session_match));
			
			return JSONObject.fromObject(session_match).toString();

		case "READ-MATCH-AND-POPULATE":
			
			match_file_change = false;
			if(last_match_time_stamp != new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.MATCHES_DIRECTORY 
					+ session_match.getMatch().getMatchFileName()).lastModified()) {
				session_match = CricketFunctions.populateMatchVariables(cricketService, CricketFunctions.readOrSaveMatchFile(CricketUtil.READ,
						CricketUtil.SETUP + "," + CricketUtil.MATCH + "," + CricketUtil.EVENT, session_match));
				match_file_change = true;
			}
			
//				session_match = CricketFunctions.populateMatchVariables(cricketService, CricketFunctions.readOrSaveMatchFile(CricketUtil.READ,CricketUtil.SETUP + "," + 
//						CricketUtil.MATCH + "," + CricketUtil.EVENT, session_match));
			if(match_file_change == true) {
				Map<String, String> this_stats = new HashMap<String,String>();
				int Player_id = 0;
				for(Inning inn : session_match.getMatch().getInning()){
					this_stats.put(CricketUtil.OVER + inn.getInningNumber(), CricketFunctions.OverBalls(inn.getTotalOvers(), inn.getTotalBalls()));
					this_stats.put(CricketUtil.COMPARE , CricketFunctions.compareInningData(session_match,"-",1,session_match.getEventFile().getEvents()));
					this_stats.put(CricketUtil.TOSS, CricketFunctions.generateTossResult(session_match,CricketUtil.SHORT, "", CricketUtil.SHORT, ""));
					this_stats.put("DOTBALLS" + inn.getInningNumber(), Functions.countDotBalls(inn.getInningNumber(), session_match.getEventFile().getEvents()));
					
					if(inn.getIsCurrentInning().equalsIgnoreCase(CricketUtil.YES)) {
						for(BattingCard bc : inn.getBattingCard()) {
							if(bc.getStatus().equalsIgnoreCase(CricketUtil.NOT_OUT) && bc.getOnStrike().equalsIgnoreCase(CricketUtil.YES)) {
								this_stats.put("BATSMAN1DOTS",  CricketFunctions.getScoreTypeData(CricketUtil.BATSMAN,session_match, inn.getInningNumber(), bc.getPlayerId(),",", 
										session_match.getEventFile().getEvents()));
							}
							if(bc.getStatus().equalsIgnoreCase(CricketUtil.NOT_OUT) && bc.getOnStrike().equalsIgnoreCase(CricketUtil.NO)) {
								this_stats.put("BATSMAN2DOTS",  CricketFunctions.getScoreTypeData(CricketUtil.BATSMAN,session_match, inn.getInningNumber(), bc.getPlayerId(),",", 
										session_match.getEventFile().getEvents()));
							}
							if(inn.getFallsOfWickets() != null) {
								if(inn.getFallsOfWickets().size() >=0) {
									if(inn.getFallsOfWickets().get(inn.getFallsOfWickets().size() -1).getFowPlayerID() == bc.getPlayerId()) {
										this_stats.put("BATSMAN_OUT",  CricketFunctions.getScoreTypeData(CricketUtil.BATSMAN,session_match, inn.getInningNumber(), bc.getPlayerId(),",", 
												session_match.getEventFile().getEvents()));
									}
								}
							}
						}
						
						this_stats.put("DLS", Functions.dls(session_match));
						this_stats.put("DLS_EQUATION", Functions.populateDls(session_match));
						this_stats.put("PREVIOUS_BOWLER", CricketFunctions.previousBowler(session_match, session_match.getEventFile().getEvents()));
						this_stats.put("OTHER_BOWLER", CricketFunctions.otherBowler(session_match, session_match.getEventFile().getEvents()));
						this_stats.put(CricketUtil.POWERPLAY, CricketFunctions.processPowerPlay(CricketUtil.MINI,session_match));
						this_stats.put(CricketUtil.INNING_STATUS, CricketFunctions.generateMatchSummaryStatus(inn.getInningNumber(), session_match, CricketUtil.SHORT).toUpperCase());
						this_stats.put(CricketUtil.PLURAL,CricketFunctions.Plural(inn.getTotalOvers()));
						this_stats.put("Req_RR", CricketFunctions.generateRunRate(CricketFunctions.getRequiredRuns(session_match), 0, CricketFunctions.getRequiredBalls(session_match), 2));
						if(inn.getIsCurrentInning().equalsIgnoreCase(CricketUtil.YES)) {
							if(inn.getRunRate()!= null) {
								this_stats.put("PS", Functions.ProjectedScore(session_match));
							}
						}
						//this_stats.put("PPS", CricketFunctions.getPowerPlayScore(inn,inn.getInningNumber(),'-', session_event_file.getEvents()));
						//System.out.println("LAST 30 BALLS : " + CricketFunctions.getlastthirtyballsdata(session_match, "-", session_event_file.getEvents(), 30));
						this_stats.put(CricketUtil.BOUNDARY, CricketFunctions.lastFewOversData(CricketUtil.BOUNDARY, session_match.getEventFile().getEvents(),inn.getInningNumber()));
						//Collections.reverse(session_match.getEventFile().getEvents());
						if(inn.getBowlingCard()!= null) {
							for(BowlingCard boc : inn.getBowlingCard()) {
								if(boc.getStatus().equalsIgnoreCase(CricketUtil.CURRENT + CricketUtil.BOWLER) || boc.getStatus().equalsIgnoreCase(CricketUtil.LAST + CricketUtil.BOWLER)) {
									Player_id = boc.getPlayerId();
								}
								this_stats.put(CricketUtil.OVER, CricketFunctions.getEventsText(CricketUtil.OVER,Player_id, ",", session_match.getEventFile().getEvents(),0));
								this_stats.put("ThisOver",CricketFunctions.processThisOverRunsCount(Player_id,session_match.getEventFile().getEvents()));
							}
						}
						//this_stats.put("ThisOver",CricketFunctions.processThisOverRunsCount(0,session_match.getEventFile().getEvents()));
						
					}
					inn.setStats(this_stats);
				}
				last_match_time_stamp = new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.MATCHES_DIRECTORY 
						+ session_match.getMatch().getMatchFileName()).lastModified();
				last_setup_time_stamp = new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.SETUP_DIRECTORY 
						+ session_match.getMatch().getMatchFileName()).lastModified();
				
				return JSONObject.fromObject(session_match).toString();
				
			}else {
				return JSONObject.fromObject(session_match).toString();
			}
			
		default:
			return JSONObject.fromObject(null).toString();
		}
	}
}