package com.mytravels;

import java.util.List;

import org.apache.log4j.Logger;
import org.json.JSONObject;
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
	private static final Logger log = Logger.getLogger(TravelController.class);
	
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
        log.info("getTravels DONE!");
        return travels;
    }
	
	@RequestMapping("travels/{id}")
	public @ResponseBody Travel getTravelById(@PathVariable String id) {
		List<Travel> travels = getTravelRepository().findById(id);
        log.info("getTravelById DONE!");
        return (travels.size() > 0) ? travels.get(0) : null;
	}
	
	@RequestMapping(value="/travels", method = RequestMethod.POST )
	public @ResponseBody List<Travel> createTravel(@RequestBody Travel travel) {
		getTravelRepository().save(travel);
        log.info("createTravel DONE!");
		return Lists.newArrayList(getTravelRepository().findAll());
	}
	
	@RequestMapping(value="/travels/{id}", method = RequestMethod.PUT )
	public @ResponseBody List<Travel> updateTravel(@PathVariable String id, @RequestBody Travel travel) {
		getTravelRepository().save(travel);
        log.info("updateTravel DONE!");
		return Lists.newArrayList(getTravelRepository().findAll());
	}
	
	@RequestMapping(value="/travels/{id}", method = RequestMethod.DELETE )
	public @ResponseBody List<Travel> deleteTravel(@PathVariable String id) {
		log.info("deleteTravel " + id);
		getTravelRepository().delete(id);
        log.info("deleteTravel DONE!");
		return Lists.newArrayList(getTravelRepository().findAll());
	}
	
	@RequestMapping(value="/stops", method = RequestMethod.PUT )
	public @ResponseBody List<Travel> updateStop(@RequestBody Stop stop) {
		getTravelRepositoryCustom().updateStop(stop);
		log.info("updateStop DONE!");
		return getTravelRepositoryCustom().getTravels();
	}
	
	@RequestMapping(value="/app/upload", method = RequestMethod.POST )
	public @ResponseBody String handleFileUpload(@RequestParam("fileData") String fileData, @RequestParam("uploadPhotosTravelForm") MultipartFile file){
		
		// Collect data for image creation.
        JSONObject jsonObj = new JSONObject(fileData);
        String travelId = jsonObj.getString("travelId");
        String fileName = jsonObj.getString("name");
        String fileTitle = jsonObj.getString("title");
        String fileDescription = jsonObj.getString("description");
        String url = new String("img\\");
        url += fileName;
        boolean inCarousel = true;
        log.info("uploadPhoto travelId: " + travelId + " url: " + url + " title: " + fileTitle  + " description: " + fileDescription);
     
        // Write file.
//        if (!file.isEmpty()) {
//            try {
//                byte[] bytes = file.getBytes();
//                BufferedOutputStream stream = 
//                        new BufferedOutputStream(new FileOutputStream(new File(url)));
//                stream.write(bytes);
//                stream.close();
//                return "You successfully uploaded " + url + " !";
//            } catch (Exception e) {
//                return "You failed to upload " + url + " => " + e.getMessage();
//            }
//        } else {
//            return "You failed to upload " + url + " because the file was empty.";
//        }
        return "";
	}
}
