package com.example.flownary.dao;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.example.flownary.entity.Follow;

@Mapper
public interface FollowDao {

	@Select("select * from follow where fid=#{fid}")
	Follow getFollow(int fid);
	
	@Select("select * from follow where uid=#{uid} and fuid=#{fuid}")
	Follow getFollowUid(int uid, int fuid);
	
	@Select("select * from follow where uid=#{uid}")
	List<Follow> getFollowList(int uid);
	
	@Select("select * from follow where fuid=#{fuid}")
	List<Follow> getFollowListByFuid(int fuid);
	
	@Select("select uid from follow where fuid=#{fuid}")
	List<Integer> getFollowIntegerListByFuid(int fuid);
	
	@Insert("insert into follow values(default, #{uid}, #{fuid}, default)")
	void insertFollow(Follow follow);
	
	@Delete("delete from follow where fid=#{fid}")
	void deleteFollow(int fid);
}
