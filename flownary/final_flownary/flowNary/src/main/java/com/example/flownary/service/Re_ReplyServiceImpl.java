package com.example.flownary.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.flownary.dao.Re_ReplyDao;
import com.example.flownary.entity.Re_Reply;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class Re_ReplyServiceImpl implements Re_ReplyService {

	private final Re_ReplyDao rrDao;

	@Override
	public Re_Reply getReReply(int rrid) {
		return rrDao.getReReply(rrid);
	}
	
	@Override
	public int getReReplyCount(int rid) {
		return rrDao.getReReplyCount(rid);
	}

	@Override
	public List<Re_Reply> getReReplyList(int rid) {
		return rrDao.getReReplyList(rid);
	}

	@Override
	public List<Re_Reply> getReReplyListByUid(int uid) {
		return rrDao.getReReplyListByUid(uid);
	}

	@Override
	public void insertReReply(Re_Reply re_Reply) {
		rrDao.insertReReply(re_Reply);
	}

	@Override
	public void updateReReply(Re_Reply re_Reply) {
		rrDao.updateReReply(re_Reply);
	}

	@Override
	public void updateReReplyNickname(int uid, String nickname) {
		rrDao.updateReReplyNickname(uid, nickname);
	}

	@Override
	public void updateReReplyLikeCount(int rrid, int likeCount) {
		rrDao.updateReReplyLikeCount(rrid, likeCount);
	}

	@Override
	public void deleteReReply(int rrid) {
		rrDao.deleteReReply(rrid);
	}
}
