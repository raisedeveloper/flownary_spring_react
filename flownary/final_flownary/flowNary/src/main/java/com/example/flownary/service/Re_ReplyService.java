package com.example.flownary.service;

import java.util.List;

import com.example.flownary.entity.Re_Reply;

public interface Re_ReplyService {

	Re_Reply getReReply(int rrid);
	
	int getReReplyCount(int rid);
	
	List<Re_Reply> getReReplyList(int rid);
	
	List<Re_Reply> getReReplyListByUid(int uid);
	
	void insertReReply(Re_Reply re_Reply);
	
	void updateReReply(Re_Reply re_Reply);
	
	void updateReReplyNickname(int uid, String nickname);
	
	void updateReReplyLikeCount(int rrid, int likeCount);
	
	void deleteReReply(int rrid);
}
