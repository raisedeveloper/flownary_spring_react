package com.example.flownary.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.flownary.dao.ChatUserDao;
import com.example.flownary.dto.Chat.updateChatUserDto;
import com.example.flownary.entity.ChatUser;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ChatUserServiceImpl implements ChatUserService {
	
	private final ChatUserDao cuDao;

	@Override
	public ChatUser getChatUser(int cid, int uid) {
		return cuDao.getChatUser(cid, uid);
	}

	@Override
	public int getChatUserCount(int cid) {
		return cuDao.getChatUserCount(cid);
	}
	
	@Override
	public List<ChatUser> getChatUserList(int cid) {
		return cuDao.getChatUserList(cid);
	}
	
	@Override
	public List<ChatUser> getChatUserListEx(int cid, int uid) {
		return cuDao.getChatUserListEx(cid, uid);
	}
	
	@Override
	public List<Integer> getChatUserListExInt(int cid, int uid) {
		return cuDao.getChatUserListExInt(cid, uid);
	}
	
	@Override
	public void insertChatUser(int cid, int uid, String name) {
		cuDao.insertChatUser(cid, uid, name);
	}

	@Override
	public void updateChatUser(updateChatUserDto chatuser) {
		cuDao.updateChatUser(chatuser);
	}

	@Override
	public void deleteChatUser(int cid, int uid) {
		cuDao.deleteChatUser(cid, uid);
	}
}
