package com.example.flownary.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.regex.Pattern;

import org.apache.commons.lang3.RandomStringUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.mindrot.jbcrypt.BCrypt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.flownary.dto.User.GetUserNickEmailDto;
import com.example.flownary.dto.User.RegisterUserDto;
import com.example.flownary.dto.User.UpdateUserDtoPwd;
import com.example.flownary.entity.Setting;
import com.example.flownary.entity.User;
import com.example.flownary.service.SettingService;
import com.example.flownary.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

@Controller
@RestController
@RequestMapping("/user")
@SuppressWarnings("unchecked")
public class UserController {

	@Autowired private UserService userSvc;
	@Autowired private SettingService setSvc;
	
	// 회원가입
	@PostMapping("/register")
	public int userRegister(@RequestBody RegisterUserDto dto) {
		// 암호화 비밀번호 생성
		String hashedPwd = "";
		String hashuid = "";
		
		if (!dto.getPwd().equals("nn"))
			hashedPwd = BCrypt.hashpw(dto.getPwd(), BCrypt.gensalt());
		
		if (!dto.getHashuid().equals("nonGoogle"))
		{
			hashuid = dto.getHashuid();
		}
		
		User user = new User();
		user.setHashUid(hashuid);
		user.setEmail(dto.getEmail());
		user.setPwd(hashedPwd);
		user.setProvider(dto.getProvider());
		if (dto.getProvider() == 0) {
			user.setBirth(dto.getBirth());
			user.setUname(dto.getUname());
			user.setNickname(dto.getNickname());
			user.setTel(dto.getTel());			
		}
		else if (dto.getProvider() == 1) {
			String hashcode = "";
			
			hashcode = RandomStringUtils.randomAlphanumeric(10);
			user.setUname("USER" + hashcode);
			user.setNickname("USERNickname" + hashcode);
		}
		userSvc.insertUser(user);
		
		user = userSvc.getUserEmail(dto.getEmail());
		
		// 유저 생성했으므로 1:1로 해당 유저의 Setting에 대한 정보도 생성 후 저장
		Setting set = new Setting();
		
		set.setUid(user.getUid());
		set.setTheme("default");
		
		setSvc.insertSetting(set);
		
		return user.getUid();
	}
	
	// 회원정보 수정 (개선판)
	@PostMapping(value = "/update")
	public int userUpdate2(HttpServletRequest request, @RequestBody User dto)
	{
		User user = new User();
		user.setUid(dto.getUid());
		user.setUname(dto.getUname());
		user.setNickname(dto.getNickname());
		user.setProfile(dto.getProfile());
		user.setStatusMessage(dto.getStatusMessage());
		user.setGender(dto.getGender());
		user.setSnsDomain(dto.getSnsDomain());
		user.setTel(dto.getTel());
		user.setBirth(dto.getBirth());
		user.setLocation(dto.getLocation());
		
		userSvc.updateUser(user);
		return 0;
	}
	
	// 비밀번호 수정 ((미구현)
	@PostMapping("/updatepwd")
	public int userUpdate(@RequestBody UpdateUserDtoPwd dto)
	{
		String pattern = "^(?=.*\\d)(?=.*[~!@#$%^&*()+|=])[A-Za-z\\d~!@#$%^&*()+|=]{6,16}$";
		String pwd1 = dto.getPwd1();
		String pwd2 = dto.getPwd2();
		
		// 비밀번호 불일치
		if (!pwd1.equals(pwd2))
		{
			return 1;
		}
		
		// 비밀번호 길이 부족
		if (pwd1.length() < 6)
		{
			return 2;
		}
		
		// 숫자와 특수문자를 포함하지 않을 경우
		if (!Pattern.matches(pattern, pwd1))
		{
			return 3;
		}
		
		String hashedPwd = BCrypt.hashpw(pwd1, BCrypt.gensalt());
		User user = new User();
		user.setPwd(hashedPwd);
		user.setUid(dto.getUid());
		
		userSvc.updateUserPwd(user);
		
		// 성공
		return 0;
	}
	
	// 유저 1명의 정보 불러오기
	@GetMapping("/getUser")
	public JSONObject getUser(@RequestParam int uid)
	{
		User user = userSvc.getUser(uid);
		if (user == null)
			return null;
		
		HashMap<String, Object> hMap = new HashMap<String, Object>();
		hMap.put("id", uid);
		hMap.put("email", user.getEmail());
		hMap.put("profile", user.getProfile());
		hMap.put("uname", user.getUname());
		hMap.put("nickname", user.getNickname());
		hMap.put("statusMessage", user.getStatusMessage());
		hMap.put("snsDomain", user.getSnsDomain());
		hMap.put("status", user.getStatus());
		hMap.put("regDate", user.getRegDate());
		hMap.put("gender", user.getGender());
		hMap.put("provider", user.getProvider());
		hMap.put("birth", user.getBirth());
		hMap.put("tel", user.getTel());
		hMap.put("hashUid", user.getHashUid());
		hMap.put("location", user.getLocation());
		hMap.put("role", user.getRole());
		System.out.println("역할" + user.getRole());
		JSONObject userOut = new JSONObject(hMap);
		
		return userOut;
	}
	
	// 유저의 닉네임과 이메일 정보만 불러오기
	@GetMapping("/getUserNickEmail")
	public JSONObject getUserNickname(@RequestParam int uid) {
		if (uid == -1)
			return null;
		
		GetUserNickEmailDto user = userSvc.getUserNicknameEmail(uid);
		
		HashMap<String, Object> hMap = new HashMap<String, Object>();
		hMap.put("id", uid);
		hMap.put("email", user.getEmail());
		hMap.put("profile", user.getProfile());
		if (user.getNickname() != null && user.getNickname() != "")
		{
			hMap.put("nickname", user.getNickname());    			
		}
		else
		{
			hMap.put("nickname", user.getEmail().split("@")[0]);
		}
		
		JSONObject jObj = new JSONObject(hMap);
		
		return jObj;
	}
	
	// 이메일로 유저 정보 불러오기
	@GetMapping("/getUserByEmail")
	public JSONObject getUserEmail(@RequestParam String email)
	{
		User user = userSvc.getUserEmail(email);
		
		if (user == null)
			return null;
		
		HashMap<String, Object> hMap = new HashMap<String, Object>();
		hMap.put("id", user.getUid());
		hMap.put("email", user.getEmail());
		hMap.put("profile", user.getProfile());
		hMap.put("uname", user.getUname());
		hMap.put("nickname", user.getNickname());
		hMap.put("statusMessage", user.getStatusMessage());
		hMap.put("snsDomain", user.getSnsDomain());
		hMap.put("status", user.getStatus());
		hMap.put("regDate", user.getRegDate());
		hMap.put("gender", user.getGender());
		hMap.put("provider", user.getProvider());
		hMap.put("birth", user.getBirth());
		hMap.put("tel", user.getTel());
		hMap.put("hashUid", user.getHashUid());
		hMap.put("role", user.getRole());
		
		JSONObject userOut = new JSONObject(hMap);
		
		return userOut;
	}
	
	// 닉네임 리스트 불러오기 - 설정/회원가입 확인
	@GetMapping("/nickname")
	public String nickname(@RequestParam String email, String nickname) {
		List<User> userList = userSvc.getOthersUserList(email);
		JSONObject jObj = new JSONObject();
		JSONArray jArr = new JSONArray();

		for (int i = 0; i < userList.size(); i++) {
			JSONObject jObject = new JSONObject();
			User user = userList.get(i);

			jObject.put("nickname", user.getNickname());
			jArr.add(jObject);
		}
		jObj.put("item", jArr);
		return jArr.toString();
	}

	// 전화번호 리스트 불러오기 - 설정/회원가입 확인
	@GetMapping("/tel")
	public String tel(@RequestParam String email, String tel) {
		List<User> userList = userSvc.getOthersUserList(email);
		JSONObject jObj = new JSONObject();
		JSONArray jArr = new JSONArray();

		for (int i = 0; i < userList.size(); i++) {
			JSONObject jObject = new JSONObject();
			User user = userList.get(i);

			jObject.put("tel", user.getTel());
			jArr.add(jObject);
		}
		jObj.put("item", jArr);
		return jArr.toString();
	}
	
	// 유저 리스트 불러오기 - 관리자 페이지
	@GetMapping("getUserList")
	public JSONArray userList() {
		List<User> userList = new ArrayList<>();
		userList = userSvc.getUserList();


		JSONArray jArr = new JSONArray();
		for (User user : userList) {
			HashMap<String, Object> hMap = new HashMap<String, Object>();
			hMap.put("uid", user.getUid());
			hMap.put("profile", user.getProfile());
			hMap.put("uname", user.getUname());
			hMap.put("nickname", user.getNickname());
			hMap.put("status", user.getStatus());
			hMap.put("regDate", user.getRegDate());
			hMap.put("gender", user.getGender());
			hMap.put("provider", user.getProvider());
			hMap.put("birth", user.getBirth());
			hMap.put("tel", user.getTel());
			hMap.put("role", user.getRole());

			JSONObject jUser = new JSONObject(hMap);


			jArr.add(jUser);
		}
		return jArr;
	}
	
	// 유저 상태 변환 - 활성화 비활성화 - 추가 수정 필요
	@PostMapping("updateUserStatus")
	public int updateUserStatus(HttpServletRequest request, @RequestBody User dto) {
		User user = userSvc.getUser(dto.getUid());
		user.setUid(dto.getUid());
		user.setStatus(dto.getStatus());
		
		userSvc.updateUserStatus(user);
		return 0;		
	}

}
