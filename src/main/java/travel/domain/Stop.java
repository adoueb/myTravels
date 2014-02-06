package travel.domain;

import org.springframework.data.annotation.Id;


public class Stop {

	@Id
    private String id;
	
    private double latitude;
    private double longitude;
    private String title;
    private String description;

    public Stop() {}

	public Stop(double latitude, double longitude, String title,
			String description) {
		super();
		this.latitude = latitude;
		this.longitude = longitude;
		this.title = title;
		this.description = description;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public double getLatitude() {
		return latitude;
	}

	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}

	public double getLongitude() {
		return longitude;
	}

	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	@Override
	public String toString() {
		return "Stop [id=" + id + ", latitude=" + latitude + ", longitude="
				+ longitude + ", title=" + title + ", description="
				+ description + "]";
	}	
}
