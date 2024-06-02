package com.example.flownary.service;

import java.util.List;

import com.example.flownary.entity.Family;

public interface FamilyService {

	Family getFamily(int faid);
	
	int getFamilyLeaderCount(int uid);
	
	List<Family> getFamilyList(int uid);
	
	int insertFamily(Family family);
	
	void updateFamily(String name, int fid);
	
	void updateFamilyStatus(int status, int faid);
	
	void deleteFamily(int fid);
}
