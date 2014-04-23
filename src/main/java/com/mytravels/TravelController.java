package com.mytravels;

import java.util.List;

import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.google.common.collect.Lists;
import com.mytravels.persistence.domain.Stop;
import com.mytravels.persistence.domain.Travel;
import com.mytravels.persistence.repository.TravelRepository;
import com.mytravels.persistence.repository.TravelRepositoryCustom;



@Controller
public class TravelController {
	
	public TravelRepository getTravelRepository() {
		
		ConfigurableApplicationContext context = null;
		// use @Configuration using Java:
        context = new ClassPathXmlApplicationContext("META-INF/spring/mytravelsContext.xml");
  	
        return context.getBean(TravelRepository.class);
	}

	public TravelRepositoryCustom getTravelRepositoryCustom() {
		
		ConfigurableApplicationContext context = null;
		// use @Configuration using Java:
        context = new ClassPathXmlApplicationContext("META-INF/spring/mytravelsContext.xml");
    	
		// use XML application context:
        //context = new ClassPathXmlApplicationContext("META-INF/spring/applicationContext.xml");
  	
        return context.getBean(TravelRepositoryCustom.class);
	}

	@RequestMapping(value="/travels", method = RequestMethod.GET )
    public @ResponseBody List<Travel> getTravels() {
		List<Travel> travels = Lists.newArrayList(getTravelRepository().findAll());		
        //List<Travel> travels = getTravelRepositoryCustom().getTravels();
        System.out.println("getTravels DONE!");
        return travels;
    }
	
	@RequestMapping("travels/{id}")
	public @ResponseBody Travel getTravelById(@PathVariable String id) {
		List<Travel> travels = getTravelRepository().findById(id);
        System.out.println("getTravelById DONE!");
        return (travels.size() > 0) ? travels.get(0) : null;
	}
	
	@RequestMapping(value="/travels", method = RequestMethod.POST )
	public @ResponseBody List<Travel> createTravel(@RequestBody Travel travel) {
		getTravelRepository().save(travel);
        System.out.println("createTravel DONE!");
		return Lists.newArrayList(getTravelRepository().findAll());
	}
	
	@RequestMapping(value="/travels/{id}", method = RequestMethod.PUT )
	public @ResponseBody List<Travel> updateTravel(@PathVariable String id, @RequestBody Travel travel) {
		getTravelRepository().save(travel);
        System.out.println("updateTravel DONE!");
		return Lists.newArrayList(getTravelRepository().findAll());
	}
	
	@RequestMapping(value="/travels/{id}", method = RequestMethod.DELETE )
	public @ResponseBody List<Travel> deleteTravel(@PathVariable String id) {
        System.out.println("deleteTravel " + id);
		getTravelRepository().delete(id);
        System.out.println("deleteTravel DONE!");
		return Lists.newArrayList(getTravelRepository().findAll());
	}
	
	@RequestMapping(value="/stops", method = RequestMethod.PUT )
	public @ResponseBody List<Travel> updateStop(@RequestBody Stop stop) {
		getTravelRepositoryCustom().updateStop(stop);
        System.out.println("updateStop DONE!");
		return getTravelRepositoryCustom().getTravels();
	}
	
	@RequestMapping(value="/app/upload", method = RequestMethod.POST )
	public @ResponseBody String handleFileUpload(@RequestParam("fileData") String travel, @RequestParam("uploadPhotosTravelForm") MultipartFile file){
        System.out.println("uploadPhoto " + travel);
        return "It works";
	}
}
