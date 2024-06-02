package com.example.flownary.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.flownary.dao.LikeDao;
import com.example.flownary.entity.Like_;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class LikeServiceImpl implements LikeService {

	private final LikeDao lDao;

	@Override
	public Like_ getLike(int lid) {
		return lDao.getLike(lid);
	}

	@Override
	public int getLikeUidCount(int uid, int type, int oid) {
		return lDao.getLikeUidCount(uid, type, oid);
	}
	
	@Override
	public int getLikeUserCount(int fuid, int type) {
		return lDao.getLikeUserCount(fuid, type);
	}
	
	@Override
	public Like_ getLikeUid(int uid, int type, int oid) {
		return lDao.getLikeUid(uid, type, oid);
	}
	
	@Override
	public List<Like_> getLikeList(int type, int oid) {
		return lDao.getLikeList(type, oid);
	}

	@Override
	public List<Like_> getLikeListFuid(int fuid) {
		return lDao.getLikeListFuid(fuid);
	}
	
	@Override
	public int getLikeCount(int type, int oid) {
		return lDao.getLikeCount(type, oid);
	}

	@Override
	public void insertLike(Like_ like_) {
		lDao.insertLike(like_);
	}

	@Override
	public void remakeLike(int lid) {
		lDao.remakeLike(lid);
	}

	@Override
	public void removeLike(int lid) {
		lDao.removeLike(lid);
	}

}
