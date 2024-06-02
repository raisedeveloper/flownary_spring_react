package com.example.flownary.dao;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.example.flownary.dto.Chat.updateChatUserDto;
import com.example.flownary.entity.ChatUser;

@Mapper
public interface ChatUserDao {

	@Select("select * from ChatUser"
			+ " where cid=#{cid} and uid=#{uid}")
	ChatUser getChatUser(int cid, int uid);
	
	@Select("select count(uid) from ChatUser"
			+ " where cid=#{cid} and status>-1")
	int getChatUserCount(int cid);
	
	@Select("select * from ChatUser"
			+ " where cid=#{cid} and status>-1")
	List<ChatUser> getChatUserList(int cid);
	
	@Select("select * from ChatUser"
			+ " where cid=#{cid} and status>-1 and uid!=#{uid}")
	List<ChatUser> getChatUserListEx(int cid, int uid);
	
	@Select("select uid from ChatUser"
			+ " where cid=#{cid} and status>-1 and uid!=#{uid}")
	List<Integer> getChatUserListExInt(int cid, int uid);
	
	@Insert("insert into ChatUser values(#{cid}, #{uid}, default, default, #{name}, default)")
	void insertChatUser(int cid, int uid, String name);
	
	@Update("update ChatUser set status=#{status}, statusTime=now(), name=#{name}, userrank=#{userrank}"
			+ " where cid=#{cid} and uid=#{uid}")
	void updateChatUser(updateChatUserDto chatuser);
	
	@Update("update ChatUser set status=-1, userrank=0 where cid=#{cid} and uid=#{uid}")
	void deleteChatUser(int cid, int uid);
}
