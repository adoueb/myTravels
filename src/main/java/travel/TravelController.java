package travel;

import java.util.List;

import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import travel.domain.Travel;

@Controller
public class TravelController {
	@RequestMapping("/myTravels")
    public @ResponseBody List<Travel> getTravels() {
    	/*
    	List<Travel> travels = new ArrayList<Travel>();
    	travels.add(new Travel("2014", "Cuba", "Windsurf in cuba", "Music, feasts and windsurf"));
    	travels.add(new Travel("2014", "Jamaica", "Reggae in Jamaica", "Music and feasts"));
    	*/
    	
		ConfigurableApplicationContext context = null;
		// use @Configuration using Java:
        context = new ClassPathXmlApplicationContext("META-INF/spring/bootstrap.xml");
    	
		// use XML application context:
        //context = new ClassPathXmlApplicationContext("META-INF/spring/applicationContext.xml");

    	
        TravelMongo travelMongo = context.getBean(TravelMongo.class);
        List<Travel> travels = travelMongo.getTravels();
        
        System.out.println("DONE!");
        
        return travels;
    }
}
