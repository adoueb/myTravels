package com.mytravels.persistence.domain.fixture;

import com.mytravels.persistence.domain.Travel;

public class PersistenceFixture {

	public static Travel standardTravel() {
		Travel travel = new Travel("2014", "Brazil", "Rio and Ihla Grande", "Culture and sea");

		return travel;
	}

	public static Travel standardTravel2() {
		Travel travel = new Travel("2014", "USA", "Salt Lake City", "Yellowstone and other parks");

		return travel;
	}


	public static Travel standardTravel3() {
		Travel travel = new Travel("2015", "Japan", "All around Japan", "Discover Japan and the Japanese");

		return travel;
	}

}
