package com.mytravels.persistence.integration;

import static junit.framework.TestCase.assertEquals;

import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.google.common.collect.Lists;
import com.mytravels.config.MongoConfigurationTest;
import com.mytravels.persistence.domain.Travel;
import com.mytravels.persistence.domain.fixture.PersistenceFixture;
import com.mytravels.persistence.repository.TravelRepository;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {MongoConfigurationTest.class})
public class TravelRepositoryFindByTests {

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
	public void thatFindByYearWorks() throws Exception {
		
		travelRepository.save(PersistenceFixture.standardTravel());
		travelRepository.save(PersistenceFixture.standardTravel2());
		travelRepository.save(PersistenceFixture.standardTravel3());

		List<Travel> travels = travelRepository.findByYear("2014");

		assertEquals(2, travels.size());
	}

	@Test
	public void thatFindByIdWorks() throws Exception {
		
		travelRepository.save(PersistenceFixture.standardTravel());

		List<Travel> travels = Lists.newArrayList(travelRepository.findAll());
		assertEquals(1, travels.size());
		
		String id = travels.get(0).getId();

		List<Travel> travelsById = travelRepository.findById(id);
		assertEquals(1, travelsById.size());	
	}

}