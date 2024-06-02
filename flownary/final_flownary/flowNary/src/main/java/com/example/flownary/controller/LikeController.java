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

import com.example.flownary.dto.Like_.InsertLikeType;
import com.example.flownary.dto.User.GetUserNickEmailDto;
import com.example.flownary.entity.Like_;
import com.example.flownary.service.BoardService;
import com.example.flownary.service.LikeService;
import com.example.flownary.service.Re_ReplyService;
import com.example.flownary.service.ReplyService;
import com.example.flownary.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("like")
@RequiredArgsConstructor
@SuppressWarnings("unchecked")
public class LikeController {
	
	private final LikeService lSvc;
	private final BoardService bSvc;
	private final ReplyService rSvc;
	private final Re_ReplyService rrSvc;
	private final UserService uSvc;

	@PostMapping("/update")
	public String insertLike(@RequestBody InsertLikeType dto) {
		Like_ like = lSvc.getLikeUid(dto.getUid(), dto.getType(), dto.getOid());
		int type = dto.getType();
		
		if(like == null) {
			like = new Like_();
			like.setType(type);
			like.setOid(dto.getOid());
			like.setFuid(dto.getFuid());
			like.setUid(dto.getUid());
			
			lSvc.insertLike(like);
		}
		else {
			if (like.getStat() == 0)
			{
				lSvc.remakeLike(like.getLid());				
			}
			else
			{
				lSvc.removeLike(like.getLid());
			}
		}
		
		switch(type) {
		case 1:
			bSvc.updateLikeCount(dto.getOid(), lSvc.getLikeCount(type, dto.getOid()));
			break;
		case 2:
			rSvc.updateReplyLikeCount(dto.getOid(), lSvc.getLikeCount(type, dto.getOid()));
			break;
		case 3:
			rrSvc.updateReReplyLikeCount(dto.getOid(), lSvc.getLikeCount(type, dto.getOid()));
			break;
		}
		
		return "좋아요";
	}
	
	@GetMapping("/count")
	public int getUserLikeCount(@RequestParam int fuid
			, @RequestParam(defaultValue="1", required=false) int type) {
		int count = 0;
		
		switch(type) {
		case 0:
			count += lSvc.getLikeUserCount(fuid, 1);
			count += lSvc.getLikeUserCount(fuid, 2);
			count += lSvc.getLikeUserCount(fuid, 3);
			break;
		case 1:
		case 2:
		case 3:
			count = lSvc.getLikeUserCount(fuid, type);
			break;
		default:
			System.out.println("getUserLikeCount type error!");
			break;
		}
		
		return count;
	}
	
	@GetMapping("/list")
	public JSONArray getLikeList(@RequestParam int type, @RequestParam int oid) {
		
		List<Like_> list = lSvc.getLikeList(type, oid);
		
		if (list.size() == 0)
			return null;
		
		JSONArray jArr = new JSONArray();
		
		for (Like_ like: list) {
			HashMap<String, Object> hMap = new HashMap<>();
			
			hMap.put("lid", like.getLid());
			hMap.put("uid", like.getUid());
			hMap.put("fuid", like.getFuid());
			hMap.put("type", type);
			hMap.put("oid", oid);
			hMap.put("time", like.getTime());
			
			GetUserNickEmailDto user = uSvc.getUserNicknameEmail(like.getUid());
			if (user.getNickname() != null && user.getNickname() != "")
			{
				hMap.put("nickname", user.getNickname());    			
			}
			else
			{
				hMap.put("nickname", user.getEmail().split("@")[0]);
			}
			hMap.put("profile", user.getProfile());
			
			JSONObject jObj = new JSONObject(hMap);
			jArr.add(jObj);
		}
		
		return jArr;
	}
}
