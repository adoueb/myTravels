package com.mytravels;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.fileupload.FileUploadBase;
import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.google.common.collect.Lists;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.gridfs.GridFSDBFile;
import com.mytravels.config.DropOversizeFilesMultipartResolver;
import com.mytravels.exception.Result;
import com.mytravels.persistence.domain.Image;
import com.mytravels.persistence.domain.Stop;
import com.mytravels.persistence.domain.Travel;
import com.mytravels.persistence.repository.TravelRepository;
import com.mytravels.persistence.repository.TravelRepositoryCustom;



@Controller
public class TravelController {
	private static final Logger log = Logger.getLogger(TravelController.class);
	
	@Autowired
	GridFsTemplate gridFsTemplate;
	
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
	
	@RequestMapping(value="travels/{id}", method = RequestMethod.GET)
	public @ResponseBody Travel getTravelById(@PathVariable String id) {
		List<Travel> travels = getTravelRepository().findById(id);
        log.info("getTravelById (" + id + ") DONE!");
        return (travels.size() > 0) ? travels.get(0) : null;
	}
	
	@RequestMapping(value="/travels", method = RequestMethod.POST )
	public @ResponseBody Travel createTravel(@RequestBody Travel travel) {
		Travel createdTravel = getTravelRepository().save(travel);
        log.info("createTravel DONE!");
		return createdTravel;
	}
	
	@RequestMapping(value="/travels/{id}", method = RequestMethod.PUT )
	public @ResponseBody Travel updateTravel(@PathVariable String id, @RequestBody Travel travel) {
		Travel updatedTravel = getTravelRepository().save(travel);
		log.info("updateTravel (" + id + ") DONE!");
		return updatedTravel;
	}
	
	@RequestMapping(value="/travels/{id}", method = RequestMethod.DELETE )
	public @ResponseBody List<Travel> deleteTravel(@PathVariable String id) {
		log.info("deleteTravel " + id);
		getTravelRepository().delete(id);
        log.info("deleteTravel (" + id + ") DONE!");
		return Lists.newArrayList(getTravelRepository().findAll());
	}
	
	@RequestMapping(value="/stops", method = RequestMethod.PUT )
	public @ResponseBody List<Travel> updateStop(@RequestBody Stop stop) {
		getTravelRepositoryCustom().updateStop(stop);
		log.info("updateStop DONE!");
		return getTravelRepositoryCustom().getTravels();
	}
	
	@RequestMapping(value="/app/upload", method = RequestMethod.POST )
	public @ResponseBody synchronized Result handleFileUpload(HttpServletRequest request, @RequestParam("fileData") String fileData, @RequestParam("uploadPhotosTravelForm") MultipartFile file){
		
		Result result;
		log.info("Request is " + request);

		Object exception = request.getAttribute(DropOversizeFilesMultipartResolver.EXCEPTION_KEY);
	    if (exception != null && FileUploadBase.SizeLimitExceededException.class.equals(exception.getClass())) {
	       result = new Result(-4, "File exeeds size limit");
	       log.error(exception);
	       return result;
	    }	    
		
		// Collect data for image creation.
        JSONObject jsonObj = new JSONObject(fileData);
        String travelId = jsonObj.getString("travelId");
        String fileName = jsonObj.getString("name");
        String fileTitle = jsonObj.getString("title");
        String fileDescription = jsonObj.getString("description");
        boolean inCarousel = true;
        log.info("uploadPhoto travelId: " + travelId + " filename: " + fileName + " title: " + fileTitle  + " description: " + fileDescription);
 
        // Retrieve the travel.
        List<Travel> travels = getTravelRepository().findById(travelId);
        if (travels.size()  != 1) {
        	 result = new Result(-2, "Travel (" + travelId + ") not found");
        } else {
	        Travel travel = travels.get(0);
	        travel.incrementImageMax();
	    	log.info("travel found");
	    	
	        // Store the image in the DB.
	        if (!file.isEmpty()) {
	
	            try {            	
	                // Update the travel by adding an image.
	                String imageUrl = ".\\img\\" + travelId + "_" + Integer.toString(travel.getImageMax()) + "_" + fileName;
	            	Image image = new Image(imageUrl, inCarousel, fileTitle, fileDescription);
	            	travel.addImage(image);            	
	            	getTravelRepository().save(travel);
	     
	                // Store the image in GridFS.
	            	DBObject imageMetaData = new BasicDBObject();
	            	imageMetaData.put("travelId", travelId);
	            	imageMetaData.put("indexInTravel", Integer.toString(travel.getImageMax()));
	            	imageMetaData.put("fileName", fileName);
	            	log.info("GridFS store image travelId=" + travelId);
	            	log.info("GridFS store image indexInTravel=" + travel.getImageMax());
	            	log.info("GridFS store image fileName=" + fileName);
	            	
	                InputStream inputStream = new ByteArrayInputStream(file.getBytes());
	                gridFsTemplate.store(inputStream, fileName, imageMetaData);
	                if (inputStream != null) {
	                    inputStream.close();
	                }
	                
	                result = new Result(0, "");
	            } catch (Exception e) {
	            	result = new Result(-1, e.getMessage());
	           }
	        } else {
	        	result = new Result(-3, "File " + fileName + " is empty");
	        }
        }
        return result;
	}
	

	@RequestMapping(value="/app/img/{id}", method = RequestMethod.GET)
	public @ResponseBody byte[] getImage(@PathVariable String id) {
        log.info("getImage " + id);
        
        String[] tokens = id.split("_");
        if (tokens.length < 3) return null;
        String travelId = tokens[0];
        String indexInTravel = tokens[1];
        String endStr = id.substring(id.indexOf('_')+1);
        String fileName = endStr.substring(endStr.indexOf('_')+1) + ".jpg";
        log.info("travelId is " + travelId);
        log.info("indexInTravel is " + indexInTravel);
        log.info("fileName is " + fileName);
        
        // Retrieve the file in GridFS.
        Query resultQuery = new Query();
        resultQuery.addCriteria(Criteria.where("metadata.travelId").is(travelId));
        resultQuery.addCriteria(Criteria.where("metadata.indexInTravel").is(indexInTravel));
        resultQuery.addCriteria(Criteria.where("metadata.fileName").is(fileName));
        List<GridFSDBFile> result = gridFsTemplate.find(resultQuery);
        log.info("Found: " + result.size() + " files");
  
     	for (GridFSDBFile fileRead : result) {
     		try {     			
     			log.info("GridFS get image filename=" + fileRead.getFilename());
     			log.info("GridFS get image travelId=" + fileRead.getMetaData().get("travelId"));
     			log.info("GridFS get image indexInTravel=" + fileRead.getMetaData().get("indexInTravel"));
    			log.info("GridFS get image fileName=" + fileRead.getMetaData().get("fileName"));
    			
     			// Return the byte array.
     	        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    	        fileRead.writeTo(outputStream);
     	        
    	        return outputStream.toByteArray();
    	        
     		} catch (IOException e) {
     			e.printStackTrace();
     		}
     	}
 
	    return null;
	}
}
