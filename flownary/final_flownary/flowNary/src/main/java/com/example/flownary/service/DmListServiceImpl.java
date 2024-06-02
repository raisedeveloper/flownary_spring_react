package com.example.flownary.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.flownary.dao.DmListDao;
import com.example.flownary.entity.DmList;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class DmListServiceImpl implements DmListService {

	private final DmListDao dDao;

	@Override
	public DmList getDmList(int did) {
		return dDao.getDmList(did);
	}

	@Override
	public String getDmListLast(int cid) {
		return dDao.getDmListLast(cid);
	}
	
	@Override
	public List<DmList> getDmListList(int cid, int count) {
		return dDao.getDmListList(cid, count);
	}

	@Override
	public List<DmList> getDmListListByUid(int uid, int count) {
		return dDao.getDmListListByUid(uid, count);
	}

	@Override
	public int insertDmList(DmList dmList) {
		dDao.insertDmList(dmList);
		return dmList.getDid();
	}

	@Override
	public void deleteDmList(int did) {
		dDao.deleteDmList(did);
	}
}
