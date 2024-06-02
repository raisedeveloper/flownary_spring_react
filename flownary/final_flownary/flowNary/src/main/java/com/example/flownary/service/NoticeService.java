package com.example.flownary.service;

import java.util.List;

import com.example.flownary.entity.Notice;

public interface NoticeService {

	Notice getNotice(int nid);
	
	List<Notice> getNoticeList(int uid, int type);
	
	int getNoticeCount(int uid);
	
	List<Notice> getNoticeListAll(int uid);
	
	void insertNotice(Notice notice);
	
	void insertNoticeList(List<Notice> list);
	
	void updateNotice(Notice notice);
	
	void removeNotice(int nid);
	
	void removeNoticeAll(int uid);
}
