package com.example.flownary.service;

import java.util.List;

import com.example.flownary.dto.User.GetUserNickEmailDto;
import com.example.flownary.entity.User;

public interface UserService {
	public final int CORRECT_LOGIN = 0;
	public final int USER_NOT_EXIST = 1;
	public final int PASSWORD_WRONG = 2;

	User getUser(int uid);
	
	User getUserEmail(String email);
	
	List<User> getOthersUserList(String email);
	
	GetUserNickEmailDto getUserNicknameEmail(int uid);
	
	void insertUser(User user);
	
	void updateUser(User user);
	
	void updateUserPwd(User user);
	
	void deleteUser(int uid);
	
	int login(String email, String pwd);
	
	void updateUserStatus(User user);
	
	List<User> getUserList();
}
