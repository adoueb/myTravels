package com.mytravels.persistence.integration;

import static junit.framework.TestCase.assertEquals;

import java.util.Map;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.mytravels.config.MongoConfigurationTest;
import com.mytravels.persistence.domain.fixture.PersistenceFixture;
import com.mytravels.persistence.repository.TravelRepository;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {MongoConfigurationTest.class})
public class TravelRepositoryAnalyseCountriesIntegrationTests {

	@Autowired
	TravelRepository travelRepository;

	@Autowired
	MongoOperations mongo;

	@Before
	public void setup() throws Exception {
		mongo.dropCollection("travel");
	}

	@After
	public void teardown() {
		mongo.dropCollection("travel");
	}

	@Test
	public void thatTravelIsInsertedIntoRepoWorks() throws Exception {

		assertEquals(0, mongo.getCollection("travel").count());
		
		travelRepository.save(PersistenceFixture.standardTravel());
		travelRepository.save(PersistenceFixture.standardTravel());
		travelRepository.save(PersistenceFixture.standardTravel());
		travelRepository.save(PersistenceFixture.standardTravel());
		travelRepository.save(PersistenceFixture.standardTravel2());
		travelRepository.save(PersistenceFixture.standardTravel2());
		travelRepository.save(PersistenceFixture.standardTravel2());
		travelRepository.save(PersistenceFixture.standardTravel3());
		
		Map<String, Integer> countries = travelRepository.analyseByCountries();
		
		assertEquals(3, countries.size());
		assertEquals(4, countries.get("Brazil").intValue());
		assertEquals(3, countries.get("USA").intValue());
		assertEquals(1, countries.get("Japan").intValue());
	}
}