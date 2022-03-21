package com.cricket.controller;

import java.io.File;
import java.io.FileFilter;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.net.Socket;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

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

import com.cricket.model.BattingCard;
import com.cricket.model.BowlingCard;
import com.cricket.model.Inning;
import com.cricket.model.Match;
import com.cricket.model.Player;
import com.cricket.service.CricketService;
import com.cricket.util.CricketUtil;

import net.sf.json.JSONObject;

@Controller
@SessionAttributes(value={"session_match","session_selected_match","session_selected_broadcaster"})
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
			@ModelAttribute("session_selected_broadcaster") String session_selected_broadcaster,
			@RequestParam(value = "select_broadcaster", required = false, defaultValue = "") String select_broadcaster,
			@RequestParam(value = "select_cricket_matches", required = false, defaultValue = "") String selectedMatch) 
					throws IllegalAccessException, InvocationTargetException, JAXBException
	{
		session_selected_match = selectedMatch; session_selected_broadcaster = select_broadcaster;
		session_match.setMatchFileTimeStamp(new SimpleDateFormat("dd-MM-yyyy HH:mm:ss").format(new Date()));
		session_match = populateMatchVariables((Match) JAXBContext.newInstance(Match.class).createUnmarshaller().unmarshal(
				new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.MATCHES_DIRECTORY + session_selected_match)));

		model.addAttribute("session_match", session_match);
		model.addAttribute("session_selected_match", session_selected_match);
		model.addAttribute("session_selected_broadcaster", session_selected_broadcaster);
		
		return "fruit";
	}
	
	@RequestMapping(value = {"/processCricketProcedures"}, method={RequestMethod.GET,RequestMethod.POST})    
	public @ResponseBody String processCricketProcedures(
			@ModelAttribute("session_match") Match session_match,
			@ModelAttribute("session_socket") Socket session_socket,
			@ModelAttribute("session_viz_scene") String session_viz_scene,
			@ModelAttribute("session_selected_match") String session_selected_match,
			@ModelAttribute("session_selected_broadcaster") String session_selected_broadcaster,
			@ModelAttribute("session_which_graphics_onscreen") String session_which_graphics_onscreen,
			@RequestParam(value = "whatToProcess", required = false, defaultValue = "") String whatToProcess,
			@RequestParam(value = "valueToProcess", required = false, defaultValue = "") String valueToProcess) 
					throws IOException, IllegalAccessException, InvocationTargetException, JAXBException
	{	
		switch (whatToProcess.toUpperCase()) {
		case "READ-MATCH-AND-POPULATE":
			if(!valueToProcess.equalsIgnoreCase(new SimpleDateFormat("dd-MM-yyyy HH:mm:ss").format(
					new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.MATCHES_DIRECTORY + session_selected_match).lastModified())))
			{
				session_match = populateMatchVariables((Match) JAXBContext.newInstance(Match.class).createUnmarshaller().unmarshal(
						new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.MATCHES_DIRECTORY + session_selected_match)));
				session_match.setMatchFileTimeStamp(new SimpleDateFormat("dd-MM-yyyy HH:mm:ss").format(
						new File(CricketUtil.CRICKET_DIRECTORY + CricketUtil.MATCHES_DIRECTORY + session_selected_match).lastModified()));
				return JSONObject.fromObject(session_match).toString();
			} else {
				return JSONObject.fromObject(null).toString();
			}
		default:
			return JSONObject.fromObject(null).toString();
		}
	}
	
	public Match populateMatchVariables(Match match) throws IllegalAccessException, InvocationTargetException 
	{
		List<Player> players = new ArrayList<Player>();
		
		for(Player plyr:match.getHomeSquad()) 
			players.add(cricketService.getPlayer(CricketUtil.PLAYER, String.valueOf(plyr.getPlayerId())));
		match.setHomeSquad(players);
		
		players = new ArrayList<Player>();
		for(Player plyr:match.getAwaySquad()) 
			players.add(cricketService.getPlayer(CricketUtil.PLAYER, String.valueOf(plyr.getPlayerId())));
		match.setAwaySquad(players);

		if(match.getHomeTeamId() > 0)
			match.setHomeTeam(cricketService.getTeam(CricketUtil.TEAM, String.valueOf(match.getHomeTeamId())));
		if(match.getAwayTeamId() > 0)
			match.setAwayTeam(cricketService.getTeam(CricketUtil.TEAM, String.valueOf(match.getAwayTeamId())));
		if(match.getGroundId() > 0)
			match.setGround(cricketService.getGround(match.getGroundId()));
		
		for(Inning inn:match.getInning()) {
			
			inn.setBatting_team(cricketService.getTeam(CricketUtil.TEAM, String.valueOf(inn.getBattingTeamId())));
			inn.setBowling_team(cricketService.getTeam(CricketUtil.TEAM, String.valueOf(inn.getBowlingTeamId())));
			
			if(inn.getBattingCard() != null)
				for(BattingCard batc:inn.getBattingCard()) 
					batc = processBattingcard(batc);
			
			if(inn.getBowlingCard() != null)
				for(BowlingCard bowlc:inn.getBowlingCard())
					bowlc.setPlayer(cricketService.getPlayer(CricketUtil.PLAYER, String.valueOf(bowlc.getPlayerId())));

			if(inn.getBowlingTeamId() == match.getHomeTeamId()) {
				inn.setFielders(match.getHomeSquad());
			} else if(inn.getBowlingTeamId() == match.getAwayTeamId()) {
				inn.setFielders(match.getAwaySquad());
			}
			
			Collections.sort(inn.getBattingCard());

		}
		return match;
	}
	
	public BattingCard processBattingcard(BattingCard bc)
	{
		bc.setPlayer(cricketService.getPlayer(CricketUtil.PLAYER, String.valueOf(bc.getPlayerId())));
		
		if(bc.getStatus().equalsIgnoreCase(CricketUtil.OUT)) {

			switch (bc.getHowOut().toUpperCase()) {
			case CricketUtil.CAUGHT_AND_BOWLED: case CricketUtil.CAUGHT: case CricketUtil.BOWLED: 
			case CricketUtil.STUMPED: case CricketUtil.LBW: case CricketUtil.HIT_WICKET: case CricketUtil.MANKAD:
				bc.setHowOutBowler(cricketService.getPlayer(CricketUtil.PLAYER, String.valueOf(bc.getHowOutBowlerId())));
				break;
			}
			
			switch (bc.getHowOut().toUpperCase()) {
			case CricketUtil.CAUGHT: case CricketUtil.STUMPED: case CricketUtil.RUN_OUT:  
				bc.setHowOutFielder(cricketService.getPlayer(CricketUtil.PLAYER, String.valueOf(bc.getHowOutFielderId())));
				break;
			}

		}
		return bc;
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
}