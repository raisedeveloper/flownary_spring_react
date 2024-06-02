package com.example.flownary.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.flownary.dto.User.GetUserNickEmailDto;
import com.example.flownary.entity.Notice;
import com.example.flownary.service.NoticeService;
import com.example.flownary.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/notice")
@RequiredArgsConstructor
@SuppressWarnings("unchecked")
public class NoticeController {

	private final NoticeService nSvc;
	private final UserService uSvc;
	
	private final SimpMessagingTemplate noticeTemplate;
	
	public void insertNotice(int suid, int type, int oid, int uid) {
		Notice notice = new Notice();
		notice.setOid(oid);
		notice.setUid(uid);
		notice.setSuid(suid);
		notice.setType(type);
		
		GetUserNickEmailDto user = uSvc.getUserNicknameEmail(suid);
		String nContents = "";
		String nickname = "";
		
		if (user.getNickname() == null || user.getNickname() == "")
		{
			nickname = user.getEmail().split("@")[0];
		}
		else
		{
			nickname = user.getNickname();
		}
		
		switch(type) {
		case 1:
			// 팔로잉한 사람이 게시물 작성 시 알람 설정
			nContents = nickname + "님이 새 글을 작성했습니다.";
			notice.setNContents(nContents);
			break;
		case 2:
			// 자신의 게시물에 댓글이 달릴 때 알람 설정
			nContents = nickname + "님이 제 글에 댓글을 달았어요.";
			notice.setNContents(nContents);
			break;
		case 3:
			// 타인이 자신을 팔로잉 했을 때 알람 설정
			nContents = nickname + "님이 저를 팔로잉했습니다.";
			notice.setNContents(nContents);
			break;
		case 4:
			// 누군가가 자신에게 메세지를 보냈을 때 알람 설정
			nContents = nickname + "메세지를 보냈습니다.";
			notice.setNContents(nContents);
			break;
		default:
			System.out.println("notice type error!");
			break;
		}
		
		notice.setRegTime(LocalDateTime.now());
		nSvc.insertNotice(notice);
		
		publishNotice(notice);
	}
	
	public void insertNoticeList(List<Integer> uidlist, int type, int oid, int suid) {
		Notice notice = new Notice();
		notice.setOid(oid);
		notice.setType(type);
		notice.setSuid(suid);
		
		GetUserNickEmailDto user = uSvc.getUserNicknameEmail(suid);
		String nContents = "";
		String nickname = "";
		
		if (user.getNickname() == null || user.getNickname() == "")
		{
			nickname = user.getEmail().split("@")[0];
		}
		else
		{
			nickname = user.getNickname();
		}
		
		switch(type) {
		case 1:
			// 팔로잉한 사람이 게시물 작성 시 알람 설정
			nContents = nickname + "님이 새 글을 작성했습니다.";
			notice.setNContents(nContents);
			break;
		case 2:
			// 자신의 게시물에 댓글이 달릴 때 알람 설정
			nContents = nickname + "님이 제 글에 댓글을 달았어요.";
			notice.setNContents(nContents);
			break;
		case 3:
			// 타인이 자신을 팔로잉 했을 때 알람 설정
			nContents = nickname + "님이 저를 팔로잉했습니다.";
			notice.setNContents(nContents);
			break;
		case 4:
			// 누군가가 자신에게 메세지를 보냈을 때 알람 설정
			nContents = nickname + "메세지를 보냈습니다.";
			notice.setNContents(nContents);
			break;
		default:
			System.out.println("notice type error!");
			break;
		}
		
		notice.setRegTime(LocalDateTime.now());
		
		List<Notice> list = new ArrayList<>();
		for (int uid: uidlist) {
			notice.setUid(uid);
			list.add(notice);
			publishNotice(notice);
		}
		
		nSvc.insertNoticeList(list);
	}
	
	
    @MessageMapping("/notice") // "/app/notice"
    public void publishNotice(Notice notice) {
    	
        log.info("publishChat : {}", notice);

        noticeTemplate.convertAndSend("/user/notice/" + notice.getUid(), notice);
    }
    
    @MessageMapping("/noticeAll") // "/app/noticeAll"
    public void publishNoticeAll(int uid) {
    	
        log.info("publishChat : {}", uid);

        noticeTemplate.convertAndSend("/user/noticeAll/" + uid, uid);
    }

	@GetMapping("/list")
	public JSONArray getNoticeUid(@RequestParam int uid,
			@RequestParam(defaultValue="0", required=false) int type) {
		
		List<Notice> list = new ArrayList<>();
		
		switch(type) {
		case 0:
			list = nSvc.getNoticeListAll(uid);
			break;
		case 1:
		case 2:
		case 3:
		case 4:
			list = nSvc.getNoticeList(uid, type);
			break;
		default:
			System.out.println("notice list type error!");
			break;
		}
		
		JSONArray jArr = new JSONArray();
		
		for (Notice notice: list) {
			HashMap<String, Object> hMap = new HashMap<>();
			GetUserNickEmailDto user = uSvc.getUserNicknameEmail(notice.getSuid());
			
			hMap.put("nid", notice.getNid());
			hMap.put("uid", notice.getUid());
			hMap.put("type", notice.getType());
			hMap.put("oid", notice.getOid());
			hMap.put("nContents", notice.getnContents());
			hMap.put("suid", notice.getSuid());
			hMap.put("regTime", notice.getRegTime());
			hMap.put("profile", user.getProfile());
			
			JSONObject jObj = new JSONObject(hMap);
			jArr.add(jObj);
		}
		
		return jArr;
	}
	
	@GetMapping("/count")
	public int getNoticeCount(@RequestParam int uid) {
		if (uid == -1)
			return 0;
		
		return nSvc.getNoticeCount(uid);
	}
	
	@PostMapping("/remove")
	public int removeNotice(@RequestBody JSONObject nid) {
		int inid = Integer.parseInt(nid.get("nid").toString());
		Notice notice = nSvc.getNotice(inid);
		
		if (notice == null)
		{
			return -1;
		}
		else
		{
			nSvc.removeNotice(inid);
		}
		
		return 0;
	}
	
	@PostMapping("/removeAll")
	public int removeNoticeAll(@RequestBody JSONObject uid) {
		int iuid = Integer.parseInt(uid.get("uid").toString());
		if (iuid == -1)
			return -1;
		
		nSvc.removeNoticeAll(iuid);
		
		if (nSvc.getNoticeCount(iuid) != 0)
		{
			return -1;
		}
		else
		{
			publishNoticeAll(iuid);
		}
		
		return 0;
	}
}
