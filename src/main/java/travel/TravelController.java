package travel;

import java.util.List;

import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import travel.domain.Stop;
import travel.domain.Travel;

@Controller
public class TravelController {
	
	
	
	
	public TravelMongo getTravelMongo() {
		
		ConfigurableApplicationContext context = null;
		// use @Configuration using Java:
        context = new ClassPathXmlApplicationContext("META-INF/spring/bootstrap.xml");
    	
		// use XML application context:
        //context = new ClassPathXmlApplicationContext("META-INF/spring/applicationContext.xml");

    	
        return context.getBean(TravelMongo.class);
	}

	@RequestMapping(value="/travels", method = RequestMethod.GET )
    public @ResponseBody List<Travel> getTravels() {
        List<Travel> travels = getTravelMongo().getTravels();
        System.out.println("getTravels DONE!");
        return travels;
    }
	
	@RequestMapping("travels/{id}")
	public @ResponseBody Travel getTravelById(@PathVariable String id) {
		Travel travel = getTravelMongo().findById(id);
        System.out.println("getTravelById DONE!");
		return travel;
	}
	
	@RequestMapping(value="/travels", method = RequestMethod.POST )
	public @ResponseBody List<Travel> createTravel(@RequestBody Travel travel) {
		getTravelMongo().addTravel(travel);
        System.out.println("createTravel DONE!");
		return getTravelMongo().getTravels();
	}
	
	@RequestMapping(value="/travels/{id}", method = RequestMethod.PUT )
	public @ResponseBody List<Travel> updateTravel(@PathVariable String id, @RequestBody Travel travel) {
		getTravelMongo().updateTravel(travel);
        System.out.println("updateTravel DONE!");
		return getTravelMongo().getTravels();
	}
	
	@RequestMapping(value="/travels/{id}", method = RequestMethod.DELETE )
	public @ResponseBody List<Travel> deleteTravel(@PathVariable String id) {
        System.out.println("deleteTravel " + id);
		getTravelMongo().deleteTravelById(id);
        System.out.println("deleteTravel DONE!");
		return getTravelMongo().getTravels();
	}
	
	@RequestMapping(value="/stops", method = RequestMethod.PUT )
	public @ResponseBody List<Travel> updateStop(@RequestBody Stop stop) {
		getTravelMongo().updateStop(stop);
        System.out.println("updateStop DONE!");
		return getTravelMongo().getTravels();
	}
}
