package com.example.flownary.dao;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.example.flownary.entity.Family;

@Mapper
public interface FamilyDao {

	@Select("select * from family where fid=#{faid}")
	Family getFamily(int faid);
	
	@Select("select count(f.faid) from family f"
			+ " join familyUser u on u.uid=#{uid} and f.faid=u.faid"
			+ " where f.status>-1 and u.status>1")
	int getFamilyLeaderCount(int uid);
	
	@Select("select * from family f"
			+ " join familyUser u on u.uid=#{uid} and f.faid=u.faid"
			+ " where f.status>-1 and u.status>-1")
	List<Family> getFamilyList(int uid);
	
	@Insert("insert into family (faid, status, regTime, name) values (default, default, default, #{name})")
	@Options(useGeneratedKeys = true, keyProperty = "faid", keyColumn = "faid")
	void insertFamily(Family family);
	
	@Update("update family set name=#{name} where faid=#{faid}")
	void updateFamily(String name, int faid);
	
	@Update("update family set status=#{status} where faid=#{faid}")
	void updateFamilyStatus(int status, int faid);
	
	@Update("update family set status=-1 where fid=#{fid}")
	void deleteFamily(int fid);
}
