package com.travel.persistence.integration;


import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoDbFactory;

import com.mongodb.Mongo;

import static com.travel.persistence.domain.fixture.MongoAssertions.usingMongo;
import static com.travel.persistence.domain.fixture.PersistenceFixture.standardTravel;

/*
 * http://spring.io/guides/tutorials/data/2/
 * This is a simple usage of MongoTemplate that uses the persistence.domain.Travel class 
 * to push data into and out of a Mongo Collection.
 * This test class will verify that Travel works as expected against a real, running MongoDB 
 * instance.
 * The test ensures that the mapping works as expected and the document appears in the expected
 * shape in the collection.
 */

//@RunWith(SpringJUnit4ClassRunner.class)
//@ContextConfiguration(classes = {CoreConfig.class, MVCConfig.class})
// {!begin top}
public class TravelMappingIntegrationTests {

  MongoOperations mongo;

  @Before
  public void setup() throws Exception {
    mongo = new MongoTemplate(new SimpleMongoDbFactory(new Mongo(), "mytravelstests"));

    mongo.dropCollection("travel");
  }

  @After
  public void teardown() {
    mongo.dropCollection("travel");
  }

  @Test
  public void thatTravelCustomMappingWorks() throws Exception {
    mongo.insert(standardTravel());

    assertTrue(usingMongo(mongo).collection("travel").first().hasField("name"));
    assertTrue(usingMongo(mongo).collection("travel").first().hasField("year"));
    assertTrue(usingMongo(mongo).collection("travel").first().hasField("country"));
    assertTrue(usingMongo(mongo).collection("travel").first().hasField("description"));
  }
  

  @Test
  public void thatTravelIsInsertedIntoCollectionHasCorrectIndexes() throws Exception {

    mongo.insert(standardTravel());

    assertEquals(1, mongo.getCollection("travel").count());

    assertTrue(usingMongo(mongo).collection("travel").hasIndexOn("_id"));
    assertTrue(usingMongo(mongo).collection("travel").hasIndexOn("name"));
  }

}
// {!end top}
