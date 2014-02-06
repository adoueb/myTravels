package travel.domain;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;


public class Itinerary {

	@Id
    private String id;

    private List<Stop> stops = new ArrayList<Stop>();
    
    public Itinerary() {}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public List<Stop> getStops() {
		return stops;
	}

	public void setStops(List<Stop> stops) {
		this.stops = stops;
	}
	public void addStop(Stop stop) {
		this.stops.add(stop);
	}

	@Override
	public String toString() {
		return "Itinerary [id=" + id + ", stops=" + stops + "]";
	}
}
