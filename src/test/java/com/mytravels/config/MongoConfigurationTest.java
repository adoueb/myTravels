package com.mytravels.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor;
import org.springframework.data.mongodb.core.MongoFactoryBean;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.mongodb.Mongo;
import com.mytravels.persistence.repository.TravelRepository;
import com.mytravels.persistence.repository.TravelRepositoryImpl;


@Configuration
@EnableMongoRepositories(basePackages = "com.mytravels.persistence.repository",
includeFilters = @ComponentScan.Filter(value = {TravelRepository.class}, type = FilterType.ASSIGNABLE_TYPE))
public class MongoConfigurationTest {

	public @Bean MongoOperations mongoTemplate(Mongo mongo) {
		MongoTemplate mongoTemplate = new MongoTemplate(mongo, "mytravelstest");
		return mongoTemplate;
	}

	/*
	 * Factory bean that creates the Mongo instance
	 */
	public @Bean MongoFactoryBean mongo() {
		MongoFactoryBean mongo = new MongoFactoryBean();
		mongo.setHost("localhost");
		return mongo;
	}

}
