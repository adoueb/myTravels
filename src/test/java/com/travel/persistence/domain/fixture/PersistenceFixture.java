package com.travel.persistence.domain.fixture;

import travel.domain.Travel;

public class PersistenceFixture {

	public static Travel standardTravel() {
		Travel travel = new Travel("2014", "Brazil", "Rio and Ihla Grande", "Culture and sea");

		return travel;
	}

}
