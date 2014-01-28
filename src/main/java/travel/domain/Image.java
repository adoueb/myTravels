package travel.domain;

import org.springframework.data.annotation.Id;


public class Image {

	@Id
    private String id;
	
    private String url;
    private boolean inCarousel;
    private String title;
    private String description;

    public Image() {}	

	public Image(String url, boolean inCarousel, String title,
			String description) {
		super();
		this.url = url;
		this.inCarousel = inCarousel;
		this.title = title;
		this.description = description;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public boolean isInCarousel() {
		return inCarousel;
	}

	public void setInCarousel(boolean inCarousel) {
		this.inCarousel = inCarousel;
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
		return "Image [url=" + url + ", inCarousel=" + inCarousel + ", title="
				+ title + ", description=" + description + "]";
	}
}
