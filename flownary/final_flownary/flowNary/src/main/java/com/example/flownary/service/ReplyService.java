package com.example.flownary.service;

import java.util.List;

import com.example.flownary.entity.Reply;

public interface ReplyService {

	Reply getReply(int rid);
	
	List<Reply> getReplyList(int bid, int offset, int limit);
	
	List<Reply> getReplyListByUid(int uid, int offset, int limit);
	
	int getReplyCount(int bid);
	
	void insertReply(Reply reply);
	
	void updateReply(Reply reply);
	
	void updateReplyNickname(int uid, String nickname);
	
	void updateReplyLikeCount(int rid, int likeCount);
	
	void deleteReply(int rid);
}
