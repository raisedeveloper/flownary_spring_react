package com.example.flownary.controller;

import java.util.HashMap;
import java.util.List;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.flownary.dto.Follow.insertFollowDto;
import com.example.flownary.dto.User.GetUserNickEmailDto;
import com.example.flownary.entity.Follow;
import com.example.flownary.service.FollowService;
import com.example.flownary.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/follow")
@RequiredArgsConstructor
@SuppressWarnings("unchecked")
public class FollowController {

	private final FollowService fSvc;
	private final UserService uSvc;
	
	private HashMap<String, Object> makeFollowData(Follow follow, int type, int uid) {
		HashMap<String, Object> hMap = new HashMap<>();
		
		hMap.put("fid", follow.getFid());
		hMap.put("time", follow.getTime());
		
		GetUserNickEmailDto user = new GetUserNickEmailDto();
		
		if (type == 0)
		{
			hMap.put("uid", uid);
			hMap.put("fuid", follow.getFuid());
			
			user = uSvc.getUserNicknameEmail(follow.getFuid());
		}
		else if (type == 1)
		{			
			hMap.put("fuid", uid);
			hMap.put("uid", follow.getUid());
			
			user = uSvc.getUserNicknameEmail(follow.getUid());
		}
		
		hMap.put("profile", user.getProfile());
		if (user.getNickname() != null && user.getNickname() != "")
		{
			hMap.put("nickname", user.getNickname());    			
		}
		else
		{
			hMap.put("nickname", user.getEmail().split("@")[0]);
		}
		
		return hMap;
	}
	
	// 특정 유저의 팔로우 여부를 검사하기 위한 매핑
	@GetMapping("/get")
	public int getFollow(@RequestParam int uid, @RequestParam int fuid) {
		int fid = -1;
		
		
		return fid;
	}
	
	// 내가 팔로우한 사람 목록
	@GetMapping("/getList")
	public JSONArray getFollowList(@RequestParam int uid) {
		
		List<Follow> list = fSvc.getFollowList(uid);
		
		if (list.size() == 0)
			return null;
		
		JSONArray jArr = new JSONArray();
		
		for (Follow follow: list) {
			HashMap<String, Object> hMap = makeFollowData(follow, 0, uid);
			JSONObject jObj = new JSONObject(hMap);
			jArr.add(jObj);
		}
		
		return jArr;
	}
	
	// 나를 팔로우한 사람 목록
	@GetMapping("getMyList")
	public JSONArray getFollowedList(@RequestParam int fuid) {
		
		List<Follow> list = fSvc.getFollowListByFuid(fuid);
		
		if (list.size() == 0)
			return null;
		
		JSONArray jArr = new JSONArray();
		
		for (Follow follow: list) {
			HashMap<String, Object> hMap = makeFollowData(follow, 1, fuid);
			JSONObject jObj = new JSONObject(hMap);
			jArr.add(jObj);
		}
		
		return jArr;
	}
	
	@PostMapping("/insert")
	public int insertFollow(@RequestBody insertFollowDto dto) {
		if (dto.getUid() == dto.getFuid()) {
			return 0;
		}
		
		Follow follow = fSvc.getFollowUid(dto.getUid(), dto.getFuid());
		
		if (follow == null) {
			follow = new Follow();
			follow.setUid(dto.getUid());
			follow.setFuid(dto.getFuid());
			
			fSvc.insertFollow(follow);
			return 1;
		}
		else {
			fSvc.deleteFollow(follow.getFid());
			return 2;
		}
	}
	
	@PostMapping("/delete")
	public int deleteFollow(@RequestBody JSONObject fid) {
		fSvc.deleteFollow(Integer.parseInt(fid.get("fid").toString()));
		
		return 0;
	}
}
