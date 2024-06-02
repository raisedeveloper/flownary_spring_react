package com.example.flownary.dao;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.example.flownary.entity.Like_;

@Mapper
public interface LikeDao {

	@Select("select * from like_ where lid=#{lid}")
	Like_ getLike(int lid);
	
	@Select("select count(lid) from like_ where uid=#{uid} and type=#{type} and oid=#{oid} and stat=1")
	int getLikeUidCount(int uid, int type, int oid);
	
	@Select("select count(lid) from like_ where fuid=#{fuid} and type=#{type} and stat=1")
	int getLikeUserCount(int fuid, int type);
	
	@Select("select * from like_ where uid=#{uid} and type=#{type} and oid=#{oid}")
	Like_ getLikeUid(int uid, int type, int oid);
	
	@Select("select * from like_ where type=#{type} and oid=#{oid} and stat=1")
	List<Like_> getLikeList(int type, int oid);
	
	@Select("select * from like_ where fuid=#{fuid} and stat=1")
	List<Like_> getLikeListFuid(int fuid);
	
	@Select("select count(lid) from like_ where type=#{type} and oid=#{oid} and stat=1")
	int getLikeCount(int type, int oid);
	
	@Insert("insert into like_ values(default, #{uid}, #{fuid}, #{type}, #{oid}, default, default)")
	void insertLike(Like_ like_);
	
	@Update("update like_ set stat=1, time=now() where lid=#{lid}")
	void remakeLike(int lid);
	
	@Update("update like_ set stat=0 where lid=#{lid}")
	void removeLike(int lid);
}
