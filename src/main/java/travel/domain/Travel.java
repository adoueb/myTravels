package travel.domain;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;


public class Travel {

	@Id
    private String id;

	private String year;
	private String country;
    private String name;
    private String description;

    private List<Image> images = new ArrayList<Image>();
    
    public Travel() {}

	public Travel(String year, String country, String name, String description) {
        this.year = year;
        this.country = country;
        this.name = name;
        this.description = description;
    }


	public String getId() {
        return id;
    }

    public void setId(String id) {
		this.id = id;
	}

	public String getYear() {
		return year;
	}

	public void setYear(String year) {
		this.year = year;
	}

    public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getName() {
        return name;
    }

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
        return description;
    }

	public void setDescription(String description) {
		this.description = description;
	}

	public List<Image> getImages() {
		return images;
	}

	public void addImage(Image image) {
		this.images.add(image);
	}

	public void setImages(List<Image> images) {
		this.images = images;
	}

	@Override
	public String toString() {
		return "Travel [year=" + year + ", country=" + country + ", name="
				+ name + ", description=" + description + ", images=" + images
				+ "]";
	}
}
