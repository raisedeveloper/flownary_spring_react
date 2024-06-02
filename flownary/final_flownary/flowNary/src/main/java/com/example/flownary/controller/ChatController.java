package com.example.flownary.controller;

import java.util.ArrayList;
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

import com.example.flownary.dto.Chat.InsertChatDto;
import com.example.flownary.dto.Chat.InsertTeamChatDto;
import com.example.flownary.dto.Chat.updateChatDto;
import com.example.flownary.dto.DmList.insertDmList;
import com.example.flownary.dto.User.GetUserNickEmailDto;
import com.example.flownary.entity.Chat;
import com.example.flownary.entity.ChatUser;
import com.example.flownary.entity.Setting;
import com.example.flownary.service.ChatService;
import com.example.flownary.service.ChatUserService;
import com.example.flownary.service.DmListService;
import com.example.flownary.service.SettingService;
import com.example.flownary.service.UserService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/chat")
@SuppressWarnings("unchecked")
public class ChatController {
	private final ChatService cSvc;
	private final UserService uSvc;
	private final ChatUserService cuSvc;
	private final SettingService sSvc;
	private final DmListService dSvc;
	private final DmListController dC;
    
    private HashMap<String, Object> makeChatData(Chat chat) {
    	
    	HashMap<String, Object> hMap = new HashMap<String, Object>();
		
		hMap.put("cid", chat.getCid());
		hMap.put("status", chat.getStatus());
		hMap.put("statusTime", chat.getStatusTime());
		hMap.put("userCount", cuSvc.getChatUserCount(chat.getCid()));
		hMap.put("name", chat.getName());
		
		String lastDm = dSvc.getDmListLast(chat.getCid());
		hMap.put("lastMessage", (lastDm != null && lastDm != "") ? lastDm : "마지막 메세지가 없습니다");
		
		return hMap;
    }
    
    @GetMapping("/get")
    public JSONObject getChat(@RequestParam int cid,
    		@RequestParam(defaultValue="-1", required=false) int uid) {
    	Chat chat = cSvc.getChat(cid);
    	HashMap<String, Object> hMap = new HashMap<String, Object>();
    	
    	if (chat != null)
    	{
    		hMap = makeChatData(chat);
    		JSONObject jObj = new JSONObject(hMap);
    		return jObj;
    	}
    	
    	return null; 
    }
    
    @GetMapping("/list")
    public JSONArray getChatList(@RequestParam int uid, 
    		@RequestParam(defaultValue="1", required=false) int count,
    		@RequestParam(defaultValue="0", required=false) int status) {
    	
    	List<Chat> list = new ArrayList<>();
    	
    	switch (status) {
		case 0:			
			list = cSvc.getChatList(uid, count);
			break;
		case 1:
			list = cSvc.getChatListImportant(uid, count);
			break;
		default:
			System.out.println("getChatList status error!");
			return null;
		}
    	
    	JSONArray jArr = new JSONArray();
    	for (Chat chat: list) {
    		HashMap<String, Object> hMap = new HashMap<String, Object>();
    		
    		hMap = makeChatData(chat);
    		JSONObject jObj = new JSONObject(hMap);
    		jArr.add(jObj);
    	}
    	
    	return jArr;
    }
    
    @GetMapping("/userlist")
    public JSONArray getChatUserList(@RequestParam int cid) {
    	List<ChatUser> list = cuSvc.getChatUserList(cid);
    	
    	JSONArray jArr = new JSONArray();
    	for (ChatUser chatUser: list) {
    		HashMap<String, Object> hMap = new HashMap<String, Object>();
    		hMap.put("uid", chatUser.getUid());
    		hMap.put("status", chatUser.getStatus());
    		hMap.put("statusTime", chatUser.getStatusTime());
    		hMap.put("name", chatUser.getName());
    		hMap.put("userrank", chatUser.getUserrank());
    		
    		GetUserNickEmailDto user = uSvc.getUserNicknameEmail(chatUser.getUid());
    		hMap.put("profile", user.getProfile());
    		
    		JSONObject jObj = new JSONObject(hMap);
    		
    		jArr.add(jObj);
    	}
    	
    	return jArr;
    }
    
    @GetMapping("/getChatCid")
    public int getChatCid(@RequestParam int uid1, @RequestParam int uid2) {
    	Chat chat = cSvc.getChatUid(uid1, uid2);
    	
    	if (chat == null)
    		return -1;
    	
    	System.out.println(chat.getCid());
    	return chat.getCid();
    }
    
    @PostMapping("/insert")
    public int insertChat(@RequestBody InsertChatDto dto) {
    	Chat chat = new Chat();
    	chat.setName(dto.getName());
    	chat.setStatus(0);
    	
    	Setting setting = sSvc.getSetting(dto.getFuid());
//    	if (setting.getAccountEnableUnable() == 0)
//    	{
//    		return -2;
//    	}	
//    	
    	int cid = cSvc.insertChat(chat);
    	chat = cSvc.getChat(cid);
    	
    	if (chat == null)
    	{
    		return -1;
    	}
    	else
    	{
    		GetUserNickEmailDto user = uSvc.getUserNicknameEmail(dto.getUid());
    		insertDmList idmList = new insertDmList();
    		idmList.setProfile(user.getProfile());
    		String nickname = user.getNickname();
    		idmList.setNickname(nickname);
    		nickname = (nickname == null || nickname == "") ? user.getEmail().split("@")[0] : nickname;
    		
    		cuSvc.insertChatUser(cid, dto.getUid(), nickname);
    		
    		user = uSvc.getUserNicknameEmail(dto.getFuid());
    		nickname = user.getNickname();
    		nickname = (nickname == null || nickname == "") ? user.getEmail().split("@")[0] : nickname;
    		
    		cuSvc.insertChatUser(cid, dto.getFuid(), nickname);
    		
    		idmList.setCid(cid);
    		idmList.setUid(dto.getUid());
    		idmList.setdContents(dto.getContents());
    		idmList.setdFile("");
    		idmList.setStatus(2);

    		dC.publishChat2(idmList, chat);
    	}
    	
    	
    	return cid;
    }
    
    @PostMapping("/insertTeam")
    public int insertTeamChat(@RequestBody InsertTeamChatDto dto) {
    	Chat chat = new Chat();
    	chat.setName(dto.getName());
    	chat.setStatus(1);
    	
    	int cid = cSvc.insertChat(chat);
    	chat = cSvc.getChat(cid);
    	if (chat == null)
    	{
    		return -1;
    	}
    	else
    	{
    		GetUserNickEmailDto user = uSvc.getUserNicknameEmail(dto.getUid());
    		String nickname = user.getNickname();
    		nickname = (nickname == null || nickname == "") ? user.getEmail().split("@")[0] : nickname;
    		
    		cuSvc.insertChatUser(cid, dto.getUid(), nickname);
    	}
    	
    	return 0;
    }
    
    @PostMapping("/update")
    public int updateChat(@RequestBody updateChatDto dto) {
    	cSvc.updateChat(dto.getStatus(), dto.getName(), dto.getCid());
    	
    	return 0;
    }
    
    @PostMapping("/updateTime")
    public int updateChatTime(@RequestBody JSONObject cid) {
    	cSvc.updateChatTime(Integer.parseInt(cid.get("cid").toString()));
    	
    	return 0;
    }
    
    
    @PostMapping("/delete")
    public int deleteChat(@RequestBody JSONObject cid) {
    	cSvc.deleteChat(Integer.parseInt(cid.get("cid").toString()));
    	
    	return 0;
    }
}