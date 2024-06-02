package com.example.flownary.dao;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.example.flownary.entity.Chat;

@Mapper
public interface ChatDao {

	@Select("select * from chat"
			+ " where cid=#{cid}")
	Chat getChat(int cid);
	
	@Select("select * from chat c"
			+ " join chatuser u1 on c.cid=u1.cid and u1.uid=#{uid1}"
			+ " join chatuser u2 on c.cid=u2.cid and u2.uid=#{uid2}"
			+ " where c.status=0 and u1.status>-1 and u2.status>-1"
			+ " limit 1")
	Chat getChatUid(int uid1, int uid2);
	
	@Select("select c.* from chat c"
			+ " join chatuser u on c.cid=u.cid and u.uid=#{uid}"
			+ " where u.status>-1"
			+ " order by u.status desc, c.statusTime desc"
			+ " limit #{count}")
	List<Chat> getChatList(int uid, int count);
	
	@Select("select c.* from chat c"
			+ " join chatuser u on c.cid=u.cid and u.uid=#{uid}"
			+ " where u.status=1"
			+ " order by c.statusTime desc"
			+ " limit #{count}")
	List<Chat> getChatListImportant(int uid, int count);
	
	@Insert("insert into chat values(default, #{status}, default, #{name})")
	@Options(useGeneratedKeys = true, keyProperty = "cid", keyColumn = "cid")
	int insertChat(Chat chat);
	
	@Update("update chat set status=#{status}, name=#{name} where cid=#{cid}")
	void updateChat(int status, String name, int cid);
	
	@Update("update chat set statusTime=now() where cid=#{cid}")
	void updateChatTime(int cid);
	
	@Update("update chat set status=-1 where cid=#{cid}")
	void deleteChat(int cid);
}
