package com.example.flownary.dao;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.example.flownary.entity.Reply;

@Mapper
public interface ReplyDao {

	@Select("select * from reply where rid=#{rid}")
	Reply getReply(int rid);
	
	@Select("select * from reply"
			+ " where isDeleted=0 and bid=#{bid}"
			+ " order by modTime desc"
			+ " limit #{limit} offset #{offset}")
	List<Reply> getReplyList(int bid, int offset, int limit);
	
	@Select("select count(rid) from reply where isDeleted=0 and bid=#{bid}")
	int getReplyCount(int bid);
	
	@Select("select * from reply"
			+ " where isDeleted=0 and uid=#{uid}"
			+ " order by modTime desc"
			+ " limit #{limit} offset #{offset}")
	List<Reply> getReplyListByUid(int uid, int offset, int limit);
	
	@Insert("insert into reply values(default, #{bid}, #{uid}, #{rContents}"
			+ ", default, 0, #{nickname}, default)")
	void insertReply(Reply reply);
	
	@Update("update reply set rContents=#{rContents} where rid=#{rid}")
	void updateReply(Reply reply);
	
	@Update("update reply set nickname=#{nickname} where uid=#{uid}")
	void updateReplyNickname(int uid, String nickname);
	
	@Update("update reply set likeCount=#{likeCount} where rid=#{rid}")
	void updateReplyLikeCount(int rid, int likeCount);
	
	@Update("update reply set isDeleted=-1 where rid=#{rid}")
	void deleteReply(int rid);
}
