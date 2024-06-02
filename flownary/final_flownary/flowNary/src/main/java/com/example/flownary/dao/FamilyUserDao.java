package com.example.flownary.dao;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.example.flownary.dto.Family.FamilyLeaderUserDto;
import com.example.flownary.dto.Family.FamilyUserInsertDto;
import com.example.flownary.dto.Family.FamilyUserUpdateDto;
import com.example.flownary.entity.FamilyUser;

@Mapper
public interface FamilyUserDao {

	@Select("select * from familyuser where faid=#{faid} and uid=#{uid}")
	FamilyUser getFamilyUser(int faid, int uid);
	
	@Select("select * from familyuser where faid=#{faid}")
	List<FamilyUser> getFamilyUserList(int faid);
	
	@Select("select count(uid) from familyuser where faid=#{faid} and status>-1")
	int getFamilyUserListCount(int faid);
	
	@Select("select u.uid, u.email, u.nickname, u.profile, f.name from user u"
			+ " join familyuser f on f.uid=u.uid"
			+ " where f.faid=#{faid} and f.status=2")
	FamilyLeaderUserDto getFamilyLeader(int faid);
	
	@Select("select * from familyuser where faid=#{faid} and status>-1")
	List<FamilyUser> getFamilyUserListActive(int faid);
	
	@Insert("insert into familyuser values(#{faid}, #{uid}, #{status}, default, #{name}, #{message})")
	void insertFamilyUser(FamilyUserInsertDto familyUser);
	
	@Update("update familyuser set status=#{status} where faid=#{faid} and uid=#{uid}")
	void updateFamilyUserStatus(int status, int faid, int uid);
	
	@Update("update familyuser set name=#{name}, message=#{message} where faid=#{faid} and uid=#{uid}")
	void updateFamilyUserMessage(FamilyUserUpdateDto familyUser);
}
