package com.example.flownary.service;

import java.util.List;

import com.example.flownary.dto.Chat.updateChatUserDto;
import com.example.flownary.entity.ChatUser;

public interface ChatUserService {

	ChatUser getChatUser(int cid, int uid);
	
	int getChatUserCount(int cid);
	
	List<ChatUser> getChatUserList(int cid);
	
	List<ChatUser> getChatUserListEx(int cid, int uid);
	
	List<Integer> getChatUserListExInt(int cid, int uid);
	
	void insertChatUser(int cid, int uid, String name);
	
	void updateChatUser(updateChatUserDto chatuser);
	
	void deleteChatUser(int cid, int uid);
}
