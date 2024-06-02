package com.example.flownary.dao;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.example.flownary.entity.DmList;

@Mapper
public interface DmListDao {

	@Select("select * from dmlist where did=#{did}")
	DmList getDmList(int did);
	
	@Select("select dContents from dmlist"
			+ " where isDeleted=0 and cid=#{cid}"
			+ " order by dTime desc"
			+ " limit 1")
	String getDmListLast(int cid);
	
	@Select("select * from dmlist"
			+ " where isDeleted=0 and cid=#{cid}"
			+ " order by dTime desc"
			+ " limit #{count}")
	List<DmList> getDmListList(int cid, int count);
	
	@Select("select * from dmlist where uid=#{uid}"
			+ " order by dTime desc"
			+ " limit #{count}")
	List<DmList> getDmListListByUid(int uid, int count);
	
	@Insert("insert into dmlist values(default, #{uid}, #{cid}, #{dContents}"
			+ ", #{dTime}, #{dFile}, #{isDeleted})")
	@Options(useGeneratedKeys = true, keyProperty = "did", keyColumn = "did")
	void insertDmList(DmList dmList);
	
	@Insert("insert into dmlist values(default, #{uid}, #{cid}, #{dContents}"
			+ ", default, #{dFile}, #{isDeleted}")
	void insertDmListNoTime(DmList dmList);
	
	@Update("update dmlist set isDeleted=-1 where did=#{did}")
	void deleteDmList(int did);
}
