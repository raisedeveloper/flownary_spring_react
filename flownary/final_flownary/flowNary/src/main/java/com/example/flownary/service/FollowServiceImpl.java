package com.example.flownary.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.flownary.dao.FollowDao;
import com.example.flownary.entity.Follow;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class FollowServiceImpl implements FollowService{

	private final FollowDao fDao;

	@Override
	public Follow getFollow(int fid) {
		return fDao.getFollow(fid);
	}
	
	@Override
	public Follow getFollowUid(int uid, int fuid) {
		return fDao.getFollowUid(uid, fuid);
	}

	@Override
	public List<Follow> getFollowList(int uid) {
		return fDao.getFollowList(uid);
	}

	@Override
	public List<Follow> getFollowListByFuid(int fuid) {
		return fDao.getFollowListByFuid(fuid);
	}
	
	@Override
	public List<Integer> getFollowIntegerListByFuid(int fuid) {
		return fDao.getFollowIntegerListByFuid(fuid);
	}

	@Override
	public void insertFollow(Follow follow) {
		fDao.insertFollow(follow);
	}

	@Override
	public void deleteFollow(int fid) {
		fDao.deleteFollow(fid);
	}
}
