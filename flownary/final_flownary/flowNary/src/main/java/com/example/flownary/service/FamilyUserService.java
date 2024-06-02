package com.example.flownary.service;

import java.util.List;

import com.example.flownary.dto.Family.FamilyLeaderUserDto;
import com.example.flownary.dto.Family.FamilyUserInsertDto;
import com.example.flownary.dto.Family.FamilyUserUpdateDto;
import com.example.flownary.entity.FamilyUser;

public interface FamilyUserService {

	FamilyUser getFamilyUser(int faid, int uid);
	
	List<FamilyUser> getFamilyUserList(int faid);
	
	int getFamilyUserListCount(int faid);
	
	FamilyLeaderUserDto getFamilyLeader(int faid);
	
	List<FamilyUser> getFamilyUserListActive(int faid);
	
	void insertFamilyUser(FamilyUserInsertDto familyUser);
	
	void updateFamilyUserStatus(int status, int faid, int uid);
	
	void updateFamilyUserMessage(FamilyUserUpdateDto familyUser);
}
