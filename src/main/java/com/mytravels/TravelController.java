package com.mytravels;

import java.util.List;

import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mytravels.persistence.domain.Stop;
import com.mytravels.persistence.domain.Travel;
import com.mytravels.persistence.repository.TravelRepository;

@Controller
public class TravelController {

	public TravelRepository getTravelRepository() {
		
		ConfigurableApplicationContext context = null;
		// use @Configuration using Java:
        context = new ClassPathXmlApplicationContext("META-INF/spring/mytravelsContext.xml");
    	
		// use XML application context:
        //context = new ClassPathXmlApplicationContext("META-INF/spring/applicationContext.xml");
  	
        return context.getBean(TravelRepository.class);
	}

	@RequestMapping(value="/travels", method = RequestMethod.GET )
    public @ResponseBody List<Travel> getTravels() {
        List<Travel> travels = getTravelRepository().getTravels();
        System.out.println("getTravels DONE!");
        return travels;
    }
	
	@RequestMapping("travels/{id}")
	public @ResponseBody Travel getTravelById(@PathVariable String id) {
		Travel travel = getTravelRepository().findById(id);
        System.out.println("getTravelById DONE!");
		return travel;
	}
	
	@RequestMapping(value="/travels", method = RequestMethod.POST )
	public @ResponseBody List<Travel> createTravel(@RequestBody Travel travel) {
		getTravelRepository().addTravel(travel);
        System.out.println("createTravel DONE!");
		return getTravelRepository().getTravels();
	}
	
	@RequestMapping(value="/travels/{id}", method = RequestMethod.PUT )
	public @ResponseBody List<Travel> updateTravel(@PathVariable String id, @RequestBody Travel travel) {
		getTravelRepository().updateTravel(travel);
        System.out.println("updateTravel DONE!");
		return getTravelRepository().getTravels();
	}
	
	@RequestMapping(value="/travels/{id}", method = RequestMethod.DELETE )
	public @ResponseBody List<Travel> deleteTravel(@PathVariable String id) {
        System.out.println("deleteTravel " + id);
		getTravelRepository().deleteTravelById(id);
        System.out.println("deleteTravel DONE!");
		return getTravelRepository().getTravels();
	}
	
	@RequestMapping(value="/stops", method = RequestMethod.PUT )
	public @ResponseBody List<Travel> updateStop(@RequestBody Stop stop) {
		getTravelRepository().updateStop(stop);
        System.out.println("updateStop DONE!");
		return getTravelRepository().getTravels();
	}
}
