package com.example.flownary.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.flownary.dao.ReplyDao;
import com.example.flownary.entity.Reply;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ReplyServiceImpl implements ReplyService{

	private final ReplyDao rDao;

	@Override
	public Reply getReply(int rid) {
		return rDao.getReply(rid);
	}
	
	@Override
	public int getReplyCount(int bid) {
		return rDao.getReplyCount(bid);
	} 

	@Override
	public List<Reply> getReplyList(int bid, int offset, int limit) {
		return rDao.getReplyList(bid, offset, limit);
	}

	@Override
	public List<Reply> getReplyListByUid(int uid, int offset, int limit) {
		return rDao.getReplyListByUid(uid, offset, limit);
	}

	@Override
	public void insertReply(Reply reply) {
		rDao.insertReply(reply);
	}

	@Override
	public void updateReply(Reply reply) {
		rDao.updateReply(reply);
	}

	@Override
	public void updateReplyNickname(int uid, String nickname) {
		rDao.updateReplyNickname(uid, nickname);
	}

	@Override
	public void updateReplyLikeCount(int rid, int likeCount) {
		rDao.updateReplyLikeCount(rid, likeCount);
	}

	@Override
	public void deleteReply(int rid) {
		rDao.deleteReply(rid);
	}
}
