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

import com.example.flownary.dto.Family.FamilyInsertDto;
import com.example.flownary.dto.Family.FamilyLeaderUserDto;
import com.example.flownary.dto.Family.FamilyUpdateDto;
import com.example.flownary.dto.Family.FamilyUserInsertDto;
import com.example.flownary.dto.Family.FamilyUserUpdateDto;
import com.example.flownary.dto.Family.FamilyUserUpdateStatusDto;
import com.example.flownary.dto.User.GetUserNickEmailDto;
import com.example.flownary.entity.Chat;
import com.example.flownary.entity.Family;
import com.example.flownary.entity.FamilyUser;
import com.example.flownary.service.ChatService;
import com.example.flownary.service.ChatUserService;
import com.example.flownary.service.FamilyService;
import com.example.flownary.service.FamilyUserService;
import com.example.flownary.service.UserService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/family")
@SuppressWarnings("unchecked")
public class FamilyController {

	private final FamilyService faSvc;
	private final FamilyUserService fuSvc;
	private final ChatService cSvc;
	private final ChatUserService cuSvc;
	private final UserService uSvc;
	
	@GetMapping("/get")
	public JSONObject getFamily(@RequestParam int faid) {
		
		Family family = faSvc.getFamily(faid);
		
		HashMap<String, Object> hMap = new HashMap<>();
		
		hMap.put("faid", family.getFaid());
		hMap.put("name", family.getName());
		hMap.put("status", family.getStatus());
		hMap.put("regTime", family.getRegTime());
		hMap.put("usercount", fuSvc.getFamilyUserListCount(faid));
		
		JSONObject jObj = new JSONObject(hMap);
		
		return jObj;
	}
	
	@GetMapping("/leadercount")
	public int getIAmFamilyLeader(@RequestParam int uid) {
		
		return faSvc.getFamilyLeaderCount(uid);
	}
	
	@GetMapping("/list")
	public JSONArray getFamilyList(@RequestParam int uid) {
		if (uid == -1)
			return null;
		
		List<Family> list = faSvc.getFamilyList(uid);
		
		if (list.size() < 1)
			return null;
		
		JSONArray jArr = new JSONArray();
		for (Family family : list) {
			HashMap<String, Object> hMap = new HashMap<>();
			
			hMap.put("faid", family.getFaid());
			hMap.put("name", family.getName());
			hMap.put("status", family.getStatus());
			hMap.put("regTime", family.getRegTime());
			hMap.put("usercount", fuSvc.getFamilyUserListCount(family.getFaid()));
			FamilyLeaderUserDto user = fuSvc.getFamilyLeader(family.getFaid());
			hMap.put("leaderuid", user.getUid());
			hMap.put("leaderprofile", user.getProfile());
			hMap.put("leadername", user.getName());
			
			JSONObject jObj = new JSONObject(hMap);
			jArr.add(jObj);
		}
		
		return jArr;
	}
	
	@GetMapping("/userlist")
	public JSONArray getFamilyUserList(@RequestParam int faid) {
		List<FamilyUser> list = fuSvc.getFamilyUserListActive(faid);
		
		if (list.size() < 1)
			return null;
		
		JSONArray jArr = new JSONArray();
		int n = 1;
		for (FamilyUser familyUser : list) {
			HashMap<String, Object> hMap = new HashMap<>();
			
			hMap.put("id", n);
			hMap.put("uid", familyUser.getUid());
			hMap.put("regTime", familyUser.getRegTime());
			hMap.put("name", familyUser.getName());
			hMap.put("message", familyUser.getMessage());
			hMap.put("status", familyUser.getStatus());
			
			GetUserNickEmailDto user = uSvc.getUserNicknameEmail(familyUser.getUid());
			
			hMap.put("profile", user.getProfile());
			
			JSONObject jObj = new JSONObject(hMap);
			jArr.add(jObj);
			n++;
		}
		
		return jArr;
	}
	
	@GetMapping("/getuser")
	public JSONObject getFamilyUser(@RequestParam int faid, @RequestParam int uid) {
		FamilyUser fuser = fuSvc.getFamilyUser(faid, uid);
		
		HashMap<String, Object> hMap = new HashMap<>();
		
		hMap.put("faid", fuser.getFaid());
		hMap.put("uid", fuser.getUid());
		hMap.put("regTime", fuser.getRegTime());
		hMap.put("name", fuser.getName());
		hMap.put("message", fuser.getMessage());
		
		GetUserNickEmailDto user = uSvc.getUserNicknameEmail(fuser.getUid());
		
		hMap.put("profile", user.getProfile());
		
		JSONObject jObj = new JSONObject(hMap);
		
		return jObj;
	}
	
	@PostMapping("/insert")
	public int insertFamily(@RequestBody FamilyInsertDto finsert) {
		
		Family family = new Family();
		family.setName(finsert.getName());
		
		if (faSvc.getFamilyLeaderCount(finsert.getUid()) > 0) {
			return -1;
		}
		
		int faid = faSvc.insertFamily(family);
		
		if (faid > 0) {
			FamilyUserInsertDto fuinsert = new FamilyUserInsertDto();
			fuinsert.setFaid(faid);
			fuinsert.setMessage(null);
			fuinsert.setName(finsert.getNickname());
			fuinsert.setStatus(2);
			fuinsert.setUid(finsert.getUid());
			
			fuSvc.insertFamilyUser(fuinsert);
			
			Chat chat = new Chat();
			chat.setStatus(1);
			chat.setName(finsert.getName() + " 채팅방");
			
			int cid = cSvc.insertChat(chat);
			if (cid > 0) {
				cuSvc.insertChatUser(cid, finsert.getUid(), finsert.getNickname());
				faSvc.updateFamilyStatus(cid, faid);
			}
		}
		
		return faid;
	}
	
	@PostMapping("/update")
	public int updateFamily(@RequestBody FamilyUpdateDto fupdate) {
		faSvc.updateFamily(fupdate.getName(), fupdate.getFaid());
		
		return 0;
	}
	
	@PostMapping("/delete")
	public int deleteFamily(@RequestBody JSONObject faid) {
		faSvc.deleteFamily(Integer.parseInt(faid.get("faid").toString()));
		
		return 0;
	}
	
	@PostMapping("/insertuser")
	public int insertFamilyUser(@RequestBody FamilyUserInsertDto fuinsert) {
		fuSvc.insertFamilyUser(fuinsert);
		Family family = faSvc.getFamily(fuinsert.getFaid());
		
		cuSvc.insertChatUser(family.getStatus(), fuinsert.getUid(), fuinsert.getName());
		
		return 0;
	}
	
	@PostMapping("/updateuser")
	public int updateFamilyUser(@RequestBody FamilyUserUpdateDto fuupdate) {
		fuSvc.updateFamilyUserMessage(fuupdate);
		return 0;
	}
	
	@PostMapping("/statususer")
	public int updateFamilyUserStatus(@RequestBody FamilyUserUpdateStatusDto fusupdate) {
		fuSvc.updateFamilyUserStatus(fusupdate.getStatus(), fusupdate.getFaid(), fusupdate.getUid());
		
		if (fusupdate.getStatus() == -1)
		{
			Family family = faSvc.getFamily(fusupdate.getFaid());
			cuSvc.deleteChatUser(family.getStatus(), fusupdate.getUid());
		}
		
		return 0;
	}
}
