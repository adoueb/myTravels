package com.mytravels.config;

import javax.servlet.MultipartConfigElement;

import org.springframework.boot.context.embedded.MultiPartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor;
import org.springframework.data.mongodb.config.AbstractMongoConfiguration;
import org.springframework.data.mongodb.core.MongoFactoryBean;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import com.mongodb.Mongo;
import com.mongodb.MongoClient;
import com.mytravels.persistence.repository.TravelRepository;


@Configuration
@EnableMongoRepositories(basePackages = "com.mytravels.persistence.repository",
includeFilters = @ComponentScan.Filter(value = {TravelRepository.class}, type = FilterType.ASSIGNABLE_TYPE))
public class MongoConfiguration extends AbstractMongoConfiguration {
	
	private final String HOST = "localhost";
	private final String DB = "mytravels";
	private final String MAX_FILESIZE = "256KB";
	private final int MAX_UPLOAD_SIZE = 128000;

	public @Bean MongoOperations mongoTemplate(Mongo mongo) {
		MongoTemplate mongoTemplate = new MongoTemplate(mongo, "mytravels");
		return mongoTemplate;
	}

	/*
	 * Factory bean that creates the Mongo instance
	 */
	public @Bean MongoFactoryBean mongoFactoryBean() {
		MongoFactoryBean mongo = new MongoFactoryBean();
		mongo.setHost(HOST);
		return mongo;
	}

    @Bean
    public GridFsTemplate gridFsTemplate() throws Exception {
       return new GridFsTemplate(mongoDbFactory(), mappingMongoConverter());
    }	  

	@Override
	protected String getDatabaseName() {
		return DB;
	}

	@Override
	@Bean
	public Mongo mongo() throws Exception {
		
		return new MongoClient(HOST);
	}
	
	/*
	 * Use this post processor to translate any MongoExceptions thrown in @Repository annotated classes
	 */
	public @Bean PersistenceExceptionTranslationPostProcessor persistenceExceptionTranslationPostProcessor() {
		return new PersistenceExceptionTranslationPostProcessor();
	}

    @Bean
    public MultipartConfigElement multipartConfigElement() {
        MultiPartConfigFactory factory = new MultiPartConfigFactory();
        factory.setMaxFileSize(MAX_FILESIZE);
        factory.setMaxRequestSize(MAX_FILESIZE);
        return factory.createMultipartConfig();
    }

    /*
    @Bean
    public CommonsMultipartResolver multipartResolver (){
        
    	DropOversizeFilesMultipartResolver multipartResolver = new DropOversizeFilesMultipartResolver();
        multipartResolver.setMaxUploadSize(MAX_UPLOAD_SIZE);
        return multipartResolver;
    }*/
}
