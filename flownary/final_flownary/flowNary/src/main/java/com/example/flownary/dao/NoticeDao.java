package com.example.flownary.dao;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.example.flownary.entity.Notice;

@Mapper
public interface NoticeDao {

	@Select("select * from notice where nid=#{nid}")
	Notice getNotice(int nid);
	
	@Select("select * from notice"
			+ " where uid=#{uid} and onOff=1 and type=#{type}"
			+ " order by  regTime desc")
	List<Notice> getNoticeList(int uid, int type);
	
	@Select("select count(nid) from notice"
			+ " where uid=#{uid} and onOff=1")
	int getNoticeCount(int uid);
	
	@Select("select * from notice"
			+ " where uid=#{uid} and onOff=1"
			+ " order by regTime desc")
	List<Notice> getNoticeListAll(int uid);
	
	@Insert("insert into notice values(default, #{uid}, #{suid}, #{type}, #{oid}, #{nContents}, default, default)")
	void insertNotice(Notice notice);
	
	@Update("update notice set nContents=#{nContents} where nid=#{nid}")
	void updateNotice(Notice notice);
	
	@Update("update notice set onOff=0 where nid=#{nid}")
	void removeNotice(int nid);
	
	@Update("update notice set onOff=0 where uid=#{uid}")
	void removeNoticeAll(int uid);
	
}
