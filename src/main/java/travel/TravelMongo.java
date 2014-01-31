package travel;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.stereotype.Repository;

import travel.domain.Travel;


// This class will perform CRUD operations on Travel and Image objects.

@Repository
public class TravelMongo {

	@Autowired
	MongoOperations mongoOperations;

	public List<Travel> getTravels() {

		if (!mongoOperations.collectionExists(Travel.class)) {
			mongoOperations.createCollection(Travel.class);
		}
		
		/*
    	Travel travel1 = new Travel("2014", "Cuba", "Windsurf in cuba", "Music, feasts and windsurf");
    	mongoOperations.insert(travel1);
    	
    	Travel travel2 = new Travel("2014", "Jamaica", "Reggae in Jamaica", "Music and feasts");
    	mongoOperations.insert(travel2);
    	*/

		List<Travel> travels = mongoOperations.findAll(Travel.class);
		System.out.println("Travels: " + travels);
		
		return travels;
	}

	public void addTravel(Travel travel) {
		mongoOperations.insert(travel);
	}

}
