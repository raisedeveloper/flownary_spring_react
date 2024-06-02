package com.example.flownary.dao;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.example.flownary.entity.Re_Reply;

@Mapper
public interface Re_ReplyDao {

	@Select("select * from re_reply where rrid=#{rrid}")
	Re_Reply getReReply(int rrid);
	
	@Select("select count(rrid) from re_reply where isDeleted=0 and rid=#{rid}")
	int getReReplyCount(int rid);
	
	@Select("select * from re_reply"
			+ " where isDeleted=0 and rid=#{rid}"
			+ " order by modTime desc")
	List<Re_Reply> getReReplyList(int rid);
	
	@Select("select * from re_reply"
			+ " where isDeleted=0 and uid=#{uid}"
			+ " order by modTime desc")	
	List<Re_Reply> getReReplyListByUid(int uid);
	
	@Insert("insert into re_reply values(default, #{rid}, #{uid},"
			+ " #{rrContents}, default, 0, #{nickname}, default)")
	void insertReReply(Re_Reply re_Reply);
	
	@Update("update re_reply set rrContents=#{rrContents} where rrid=#{rrid}")
	void updateReReply(Re_Reply re_Reply);
	
	@Update("update re_reply set nickname=#{nickname} where uid=#{uid}")
	void updateReReplyNickname(int uid, String nickname);
	
	@Update("update re_reply set likeCount=#{likeCount} where rrid=#{rrid}")
	void updateReReplyLikeCount(int rrid, int likeCount);
	
	@Update("update re_reply set isDeleted=-1 where rrid=#{rrid}")
	void deleteReReply(int rrid);
}
