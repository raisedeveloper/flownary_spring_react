package com.example.flownary.service;

import java.util.List;

import org.apache.ibatis.session.ExecutorType;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Service;

import com.example.flownary.dao.NoticeDao;
import com.example.flownary.entity.Notice;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class NoticeServiceImpl implements NoticeService {

	private final NoticeDao nDao;
	private final SqlSessionFactory sqlSessionFactory;

	@Override
	public Notice getNotice(int nid) {
		return nDao.getNotice(nid);
	}

	@Override
	public List<Notice> getNoticeList(int uid, int type) {
		return nDao.getNoticeList(uid, type);
	}
	
	@Override
	public int getNoticeCount(int uid) {
		return nDao.getNoticeCount(uid);
	}

	@Override
	public List<Notice> getNoticeListAll(int uid) {
		return nDao.getNoticeListAll(uid);
	}

	@Override
	public void insertNotice(Notice notice) {
		nDao.insertNotice(notice);
	}
	
	@Override
	public void insertNoticeList(List<Notice> list) {
		try (SqlSession sqlSession = sqlSessionFactory.openSession(ExecutorType.BATCH)) {
			NoticeDao mapper = sqlSession.getMapper(NoticeDao.class);
			
			int n = 0;
			
			for (Notice notice : list) {
				mapper.insertNotice(notice);
				n++;
				if (n > 1000)
				{
					n = 0;
					sqlSession.flushStatements();
				}
			}
			sqlSession.flushStatements();
			sqlSession.commit();
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Override
	public void updateNotice(Notice notice) {
		nDao.updateNotice(notice);
	}

	@Override
	public void removeNotice(int nid) {
		nDao.removeNotice(nid);
	}

	@Override
	public void removeNoticeAll(int uid) {
		nDao.removeNoticeAll(uid);
	}
}
