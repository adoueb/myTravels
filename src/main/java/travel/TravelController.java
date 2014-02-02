package travel;

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
    	/*
    	List<Travel> travels = new ArrayList<Travel>();
    	travels.add(new Travel("2014", "Cuba", "Windsurf in cuba", "Music, feasts and windsurf"));
    	travels.add(new Travel("2014", "Jamaica", "Reggae in Jamaica", "Music and feasts"));
    	*/
    	
        List<Travel> travels = getTravelMongo().getTravels();
        
        System.out.println("DONE!");
        
        return travels;
    }
	
	@RequestMapping("travels/{id}")
	public @ResponseBody Travel getById(@PathVariable String id) {
		return null;
	}
	
	@RequestMapping(value="/travels", method = RequestMethod.POST )
	public @ResponseBody List<Travel> createTravel(@RequestBody Travel travel) {
		getTravelMongo().addTravel(travel);
		return getTravelMongo().getTravels();
	}
	
	@RequestMapping(value="/travels", method = RequestMethod.PUT )
	public @ResponseBody List<Travel> updateTravel(@RequestBody Travel travel) {
		getTravelMongo().updateTravel(travel);
		return getTravelMongo().getTravels();
	}
	
	@RequestMapping(value="/travels", method = RequestMethod.DELETE )
	public @ResponseBody List<Travel> deleteTravel(@RequestBody Travel travel) {
		getTravelMongo().deleteTravel(travel);
		return getTravelMongo().getTravels();
	}
}
