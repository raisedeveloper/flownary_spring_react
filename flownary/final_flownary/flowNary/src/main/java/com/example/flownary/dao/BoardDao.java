package com.example.flownary.dao;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.example.flownary.entity.Board;

@Mapper
public interface BoardDao {

	@Select("select * from board where bid=#{bid}")
	Board getBoard(int bid);
	
	@Select("select count(bid) from board"
			+ " where isDeleted=0 and shareUrl=#{shareUrl}")
	int getBoardShareUrl(String shareUrl);
	
	@Select("select * from board"
			+ " where isDeleted=0 and shareUrl=#{shareUrl}")
	Board getBoardShareUrl2(String shareUrl);
	
	@Select("select count(b.bid) from board b"
	         + " JOIN users u ON b.uid=u.uid"
	         + " where b.isDeleted=0 and ${field} like #{query}")
	int getBoardCount(String field, String query);
	
	@Select("select * from board"
			+ " where isDeleted=0 and ${field} like #{query}"
			+ " order by modTime desc"
			+ " limit #{count}" )
	List<Board> getBoardList(String field, String query, int count);
	
	@Select("select * from board"
			+ " where isDeleted=0 and (${field1} like #{query} or ${field2} like #{query})"
			+ " order by modTime desc"
			+ " limit #{count}")
	List<Board> getBoardList2(String field1, String field2, String query, int count);
	
	@Select("select * from board"
			+ " where isDeleted=0 and (${field1} like #{query} or ${field2} like #{query} or ${field3} like #{query})"
			+ " order by modTime desc"
			+ " limit #{count}")
	List<Board> getBoardList3(String field1, String field2, String field3, String query, int count);
	
	@Select("select * from board"
			+ " where isDeleted > -2 and uid=${uid}"
			+ " order by modTime desc")
	List<Board> getBoardList4(int uid);
	
	@Select("SELECT b.* FROM like_ c JOIN board b ON b.bid=c.oid WHERE b.isDeleted = 0 AND c.stat=1 AND c.uid=#{uid} and c.type=1")
	List<Board> getLikedList(int uid);
	
	@Select("select count(bid) from board"
			+ " where isDeleted=0 and ${field} like #{query}"
			+ " order by modTime desc")
	int getBoardListCount(String field, String query);
	
	@Select("select count(bid) from board"
			+ " where isDeleted=0 and (${field1} like #{query} or ${field2} like #{query})"
			+ " order by modTime desc")
	int getBoardListCount2(String field1, String field2, String query);
	
	@Select("select count(bid) from board"
			+ " where isDeleted=0 and (${field1} like #{query} or ${field2} like #{query} or ${field3} like #{query})"
			+ " order by modTime desc")
	int getBoardListCount3(String field1, String field2, String field3, String query);
	
	@Insert("insert into board values(default, #{uid}, #{title}, #{bContents}, default, "
			+ " default, default, default, #{image}, #{shareUrl}, "
			+ " #{nickname}, #{hashTag}, default, default)")
	void insertBoard(Board board);
	
	@Update("update board set title=#{title}, bContents=#{bContents}, modTime=#{modTime}, image=#{image}"
			+ ", hashTag=#{hashTag} where bid=#{bid}")
	void updateBoard(Board board);
	
	@Update("update board set nickname=#{nickname} where uid=#{uid}")
	void updateBoardNickname(int uid, String nickname);
	
	@Update("update board set isDeleted=#{isDeleted} where bid=#{bid}")
	void disableBoard(int bid, int isDeleted);
	
	@Update("update board set isDeleted=-2 where bid=#{bid}")
	void deleteBoard(int bid);
	
	@Update("update board set replyCount=#{replyCount}"
			+ " where bid=#{bid}")
	void updateReplyCount(int bid, int replyCount);
	
	@Update("update board set likeCount=#{likeCount}"
			+ " where bid=#{bid}")
	void updateLikeCount(int bid, int likeCount);
	
	@Update("update board set viewCount=viewCount+1 where bid=#{bid} ")
	void updateViewCount(int bid);
}
