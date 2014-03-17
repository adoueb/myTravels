package com.mytravels.persistence.repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.mapreduce.MapReduceResults;
import org.springframework.stereotype.Repository;

import com.mytravels.persistence.domain.Stop;
import com.mytravels.persistence.domain.Travel;


// This class will perform CRUD operations on Travel and Image objects.

@Repository
public class TravelRepositoryImpl implements AnalyseCountries {

	@Autowired
	MongoOperations mongoOperations;

	@Override
	public Map<String, Integer> analyseByCountries() {
	    MapReduceResults<CountryAnalysis> results = mongoOperations.mapReduce("travel",
	        "classpath:countriesmap.js",
	        "classpath:countriesreduce.js",
	        CountryAnalysis.class);

	    Map<String, Integer> analysis = new HashMap<String, Integer>();

	    for(CountryAnalysis countryAnalysis: results) {
	      analysis.put(countryAnalysis.getId(), countryAnalysis.getValue());
	    }

	    return analysis;
	  }

	  private static class CountryAnalysis {
	    private String id;
	    private int value;

	    private void setId(String name) {
	      this.id = name;
	    }

	    private void setValue(int count) {
	      this.value = count;
	    }

	    public String getId() {
	      return id;
	    }

	    public int getValue() {
	      return value;
	    }
	  }

}
