package com.mytravels.persistence.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.mytravels.persistence.domain.Travel;

public interface TravelRepository extends CrudRepository<Travel, String>, AnalyseCountries {

	public List<Travel> findByYear(String year);
	public List<Travel> findById(String id);
	
}