package com.example.flownary.dao;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.example.flownary.dto.User.GetUserNickEmailDto;
import com.example.flownary.entity.User;

@Mapper
public interface UserDao {

	@Select("select * from user where uid=#{uid}")
	User getUser(int uid);

	@Select("select * from user where email=#{email}")
	User getUserEmail(String email);

	@Select("select * from user where isDeleted=0" + " order by regDate desc" + " limit #{count} offset #{offset}")
	List<User> getUserList(int count, int offset);

	@Select("select * from user where status=0" + " order by regDate")
	List<User> getUserList2();
	
	@Select("select email, nickname, profile from user" + " where uid=#{uid}")
	GetUserNickEmailDto getUserNicknameEmail(int uid);

	@Insert("insert into user values (default, #{email}, #{pwd}, default, #{uname}, #{nickname}"
			+ ", default, default, default, default, #{gender}"
			+ ", #{provider}, #{birth}, #{tel}, #{hashUid}, #{location}, default)")
	void insertUser(User user);

	@Update("update user set profile=#{profile}, uname=#{uname}, nickname=#{nickname}"
			+ ", statusMessage=#{statusMessage}, snsDomain=#{snsDomain}, birth=#{birth}"
			+ ", gender=#{gender}, tel=#{tel}, hashUid=#{hashUid}, location=#{location}" + " where uid=#{uid}")
	void updateUser(User user);

	@Update("update user set pwd=#{pwd} where uid=#{uid}")
	void updateUserPwd(User user);

	@Update("update user set status=-1 where uid=#{uid}")
	void deleteUser(int uid);

	@Select("Select count(uid) from user where status>-1")
	int getUserCount();

	@Select("select * from user where status=0 and email!=#{email}" + " order by regDate desc")
	List<User> getOthersUserList(String email);
	
	
	@Update("update user set status=#{status}" + " where uid=#{uid}")
	void updateUserStatus(User user);
}
