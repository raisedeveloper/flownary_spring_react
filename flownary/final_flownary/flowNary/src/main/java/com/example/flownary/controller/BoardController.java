package com.example.flownary.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.lang3.RandomStringUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.flownary.dto.Board.InsertBoardDto;
import com.example.flownary.dto.Board.UpdateBoardDto;
import com.example.flownary.dto.User.GetUserNickEmailDto;
import com.example.flownary.entity.Board;
import com.example.flownary.service.BoardService;
import com.example.flownary.service.FollowService;
import com.example.flownary.service.LikeService;
import com.example.flownary.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/board")
@RequiredArgsConstructor
@SuppressWarnings("unchecked")
public class BoardController {
	private final UserService uSvc;
	private final BoardService bSvc;
	private final LikeService lSvc;
	private final NoticeController nC;
	private final FollowService fSvc;
	
	@GetMapping("/getBoard")
	public JSONObject getBoard(@RequestParam int bid,
			@RequestParam(defaultValue="-1", required=false) int uid) {
		Board board = bSvc.getBoard(bid);
		int liked = lSvc.getLikeUidCount(uid, 1, bid);		
		HashMap<String, Object> hMap = new HashMap<String, Object>();
		
		if (board != null)
		{
			GetUserNickEmailDto user = uSvc.getUserNicknameEmail(board.getUid());
			hMap.put("bid", board.getBid());
			hMap.put("uid", board.getUid());
			hMap.put("title", board.getTitle());
			hMap.put("bContents", board.getbContents());
			hMap.put("modTime", board.getModTime());
			hMap.put("viewCount", board.getViewCount());
			hMap.put("likeCount", board.getLikeCount());
			hMap.put("replyCount", board.getReplyCount());
			hMap.put("image", board.getImage());
			hMap.put("shareUrl", board.getShareUrl());
			hMap.put("isDeleted", board.getIsDeleted());
			hMap.put("hashTag", board.getHashTag());
			hMap.put("nickname", board.getNickname());
			hMap.put("liked", (liked == 1) ? true : false);
			hMap.put("profile", (user != null) ? user.getProfile() : null);
			JSONObject jBoard = new JSONObject(hMap);
			
			return jBoard;			
		}
		return null;
	}
	
	@GetMapping("/getBoardUrl")
	public JSONObject getBoardUrl(@RequestParam String url,
			@RequestParam(defaultValue="-1", required=false) int uid) {
		Board board = bSvc.getBoardShareUrl2(url);
		
		HashMap<String, Object> hMap = new HashMap<String, Object>();
		
		if (board != null)
		{
			int liked = lSvc.getLikeUidCount(uid, 1, board.getBid());
			GetUserNickEmailDto user = uSvc.getUserNicknameEmail(board.getUid());
			hMap.put("bid", board.getBid());
			hMap.put("uid", board.getUid());
			hMap.put("title", board.getTitle());
			hMap.put("bContents", board.getbContents());
			hMap.put("modTime", board.getModTime());
			hMap.put("viewCount", board.getViewCount());
			hMap.put("likeCount", board.getLikeCount());
			hMap.put("replyCount", board.getReplyCount());
			hMap.put("image", board.getImage());
			if (board.getImage() == null || board.getImage() == "")
			{
				hMap.put("imagecount", 0);
			}
			else
			{
				int c = board.getImage().length() - board.getImage().replace(",", "").length();
				hMap.put("iamgecount", c + 1);
			}
			hMap.put("shareUrl", board.getShareUrl());
			hMap.put("isDeleted", board.getIsDeleted());
			hMap.put("hashTag", board.getHashTag());
			hMap.put("nickname", board.getNickname());
			hMap.put("liked", (liked == 1) ? true : false);
			hMap.put("profile", user.getProfile());
			JSONObject jBoard = new JSONObject(hMap);
			return jBoard;
		}
		else
		{
			return null;
		}
	}
	
	@GetMapping("/listCount")
	public int boardListCount(@RequestParam(name="f", defaultValue="title", required=false) String field,
			@RequestParam(name="f2", defaultValue="", required=false) String field2,
			@RequestParam(name="f3", defaultValue="", required=false) String field3,
			@RequestParam(name="q", defaultValue="", required=false) String query,
			@RequestParam(defaultValue="1", required=false) int type,
			@RequestParam(defaultValue="-1", required=false) int uid) {
		
		int listcount = 0;
		
		switch(type) {
		case 1:
			listcount = bSvc.getBoardListCount(field, query);			
			break;
		case 2:
			List<String> fieldList = new ArrayList<>();
			fieldList.add(field);
			fieldList.add(field2);
			listcount = bSvc.getBoardListCountSearch(fieldList, query);
			break;
		case 3: 
			List<String> fieldList1 = new ArrayList<>();
			fieldList1.add(field);
			fieldList1.add(field2);
			fieldList1.add(field3);
			listcount = bSvc.getBoardListCountSearch(fieldList1, query);
			break;
		default:
			System.out.println("error!");
			break;
		}
		
		return listcount;
	}
	
	@GetMapping("/list")
	public JSONArray boardList(@RequestParam(name="c", defaultValue="1", required=false) int count,
			@RequestParam(name="f", defaultValue="title", required=false) String field,
			@RequestParam(name="f2", defaultValue="", required=false) String field2,
			@RequestParam(name="f3", defaultValue="", required=false) String field3,
			@RequestParam(name="q", defaultValue="", required=false) String query,
			@RequestParam(defaultValue="1", required=false) int type,
			@RequestParam(defaultValue="-1", required=false) int uid) {
		
		List<Board> list = new ArrayList<>();
		switch(type) {
		case 1:
			list = bSvc.getBoardList(count, field, query);			
			break;
		case 2:
			List<String> fieldList = new ArrayList<>();
			fieldList.add(field);
			fieldList.add(field2);
			list = bSvc.getBoardListSearch(count, fieldList, query);
			break;
		case 3: 
			List<String> fieldList1 = new ArrayList<>();
			fieldList1.add(field);
			fieldList1.add(field2);
			fieldList1.add(field3);
			list = bSvc.getBoardListSearch(count, fieldList1, query);
			break;
		default:
			System.out.println("error!");
			break;
		}
		
		JSONArray jArr = new JSONArray();
		for(Board board:list) {
			HashMap<String, Object> hMap = new HashMap<String, Object>();
			int liked = lSvc.getLikeUidCount(uid, 1, board.getBid());
			GetUserNickEmailDto user = uSvc.getUserNicknameEmail(board.getUid());
			
 			hMap.put("bid", board.getBid());
			hMap.put("uid", board.getUid());
			hMap.put("title", board.getTitle());
			hMap.put("bContents", board.getbContents());
			hMap.put("modTime", board.getModTime());
			hMap.put("viewCount", board.getViewCount());
			hMap.put("likeCount", board.getLikeCount());
			hMap.put("replyCount", board.getReplyCount());
			hMap.put("image", board.getImage());
			if (board.getImage() == null || board.getImage() == "")
			{
				hMap.put("imagecount", 0);
			}
			else
			{
				int c = board.getImage().length() - board.getImage().replace(",", "").length();
				hMap.put("iamgecount", c + 1);
			}
			hMap.put("shareUrl", board.getShareUrl());
			hMap.put("isDeleted", board.getIsDeleted());
			hMap.put("hashTag", board.getHashTag());
			hMap.put("nickname", board.getNickname());
			hMap.put("liked", (liked == 1) ? true : false);
			hMap.put("profile", user.getProfile());
			JSONObject jBoard = new JSONObject(hMap);
			
			jArr.add(jBoard);
		}
		return jArr;
	}
	
	@GetMapping("/mylist")
	public JSONArray boardMyList(@RequestParam int uid) {

		List<Board> list = bSvc.getMyBoardList(uid);
		JSONArray jArr = new JSONArray();
		for (Board board : list) {
			HashMap<String, Object> hMap = new HashMap<String, Object>();
			int liked = lSvc.getLikeUidCount(uid, 1, board.getBid());
			GetUserNickEmailDto user = uSvc.getUserNicknameEmail(board.getUid());

			hMap.put("bid", board.getBid());
			hMap.put("uid", board.getUid());
			hMap.put("title", board.getTitle());
			hMap.put("bContents", board.getbContents());
			hMap.put("modTime", board.getModTime());
			hMap.put("viewCount", board.getViewCount());
			hMap.put("likeCount", board.getLikeCount());
			hMap.put("replyCount", board.getReplyCount());
			hMap.put("image", board.getImage());
			if (board.getImage() == null || board.getImage() == "") {
				hMap.put("imagecount", 0);
			} else {
				int c = board.getImage().length() - board.getImage().replace(",", "").length();
				hMap.put("iamgecount", c + 1);
			}
			hMap.put("shareUrl", board.getShareUrl());
			hMap.put("isDeleted", board.getIsDeleted());
			hMap.put("hashTag", board.getHashTag());
			hMap.put("nickname", board.getNickname());
			hMap.put("liked", (liked == 1) ? true : false);
			hMap.put("profile", user.getProfile());
			JSONObject jBoard = new JSONObject(hMap);
			jArr.add(jBoard);
		}
		return jArr;
	}
	
	@GetMapping("/likelist")
	public JSONArray boardLikeList(@RequestParam int uid) {

		List<Board> list = bSvc.getLikedBoardList(uid);

		JSONArray jArr = new JSONArray();
		for (Board board : list) {
			HashMap<String, Object> hMap = new HashMap<String, Object>();
			int liked = lSvc.getLikeUidCount(uid, 1, board.getBid());
			GetUserNickEmailDto user = uSvc.getUserNicknameEmail(board.getUid());

			hMap.put("bid", board.getBid());
			hMap.put("uid", board.getUid());
			hMap.put("title", board.getTitle());
			hMap.put("bContents", board.getbContents());
			hMap.put("modTime", board.getModTime());
			hMap.put("viewCount", board.getViewCount());
			hMap.put("likeCount", board.getLikeCount());
			hMap.put("replyCount", board.getReplyCount());
			hMap.put("image", board.getImage());
			if (board.getImage() == null || board.getImage() == "") {
				hMap.put("imagecount", 0);
			} else {
				int c = board.getImage().length() - board.getImage().replace(",", "").length();
				hMap.put("iamgecount", c + 1);
			}
			hMap.put("shareUrl", board.getShareUrl());
			hMap.put("isDeleted", board.getIsDeleted());
			hMap.put("hashTag", board.getHashTag());
			hMap.put("nickname", board.getNickname());
			hMap.put("liked", (liked == 1) ? true : false);
			hMap.put("profile", user.getProfile());
			JSONObject jBoard = new JSONObject(hMap);
			jArr.add(jBoard);
		}
		return jArr;
	}
	
	@PostMapping("/insert")
	public int insertForm(@RequestBody InsertBoardDto dto) {
		
		String shareUrl = "";
		boolean t = true;
		
		while (t)
		{
			shareUrl = RandomStringUtils.randomAlphanumeric(10);
			
			if (bSvc.getBoardShareUrl(shareUrl) == 0)
			{
				t = false;
				break;
			}
		}
		
		Board board = new Board(dto.getUid(), dto.getTitle()
				, dto.getbContents(), dto.getImage(), shareUrl
				, dto.getNickname(), dto.getHashTag(), dto.getIsDeleted());
		
		bSvc.insertBoard(board);
		System.out.println(board);
		
		board = bSvc.getBoardShareUrl2(shareUrl);
		if (board != null)
		{
			List<Integer> uidlist = fSvc.getFollowIntegerListByFuid(dto.getUid());
			
			if (uidlist.size() > 0)
			{
				nC.insertNoticeList(uidlist, 1, board.getBid(), board.getUid());				
			}
			
			return 0;
		}
		return -1;
	}

	@PostMapping("/update")
	public String boardUpdate(@RequestBody UpdateBoardDto dto) {
		System.out.println(dto.getTitle());
		Board board = bSvc.getBoard(dto.getBid());
		board.setTitle(dto.getTitle());
		board.setbContents(dto.getbContents());
		board.setImage(dto.getImage());
		board.setHashTag(dto.getHashTag());
		board.setModTime(dto.getModTime());
		
		System.out.println(dto.getImage());
		System.out.println(dto.getModTime());
		
		bSvc.updateBoard(board);
		return "수정되었습니다";
	}
	

	@GetMapping("/modCount")
	public JSONArray boardRegList(@RequestParam int uid) {

		List<Board> list = bSvc.getMyBoardList(uid);
		JSONArray jArr = new JSONArray();
		for (Board board : list) {
			HashMap<String, Object> hMap = new HashMap<String, Object>();
			int liked = lSvc.getLikeUidCount(uid, 1, board.getBid());
			GetUserNickEmailDto user = uSvc.getUserNicknameEmail(board.getUid());

			hMap.put("bid", board.getBid());
			hMap.put("uid", board.getUid());
			hMap.put("title", board.getTitle());
			hMap.put("bContents", board.getbContents());
			hMap.put("modTime", board.getModTime());
			hMap.put("viewCount", board.getViewCount());
			hMap.put("likeCount", board.getLikeCount());
			hMap.put("replyCount", board.getReplyCount());
			hMap.put("image", board.getImage());
			if (board.getImage() == null || board.getImage() == "") {
				hMap.put("imagecount", 0);
			} else {
				int c = board.getImage().length() - board.getImage().replace(",", "").length();
				hMap.put("iamgecount", c + 1);
			}
			hMap.put("shareUrl", board.getShareUrl());
			hMap.put("isDeleted", board.getIsDeleted());
			hMap.put("hashTag", board.getHashTag());
			hMap.put("nickname", board.getNickname());
			hMap.put("liked", (liked == 1) ? true : false);
			hMap.put("profile", user.getProfile());
			JSONObject jBoard = new JSONObject(hMap);
			jArr.add(jBoard);
		}
		return jArr;
	}
	
	@PostMapping("/disable")
	public int boardDisable(@RequestBody JSONObject board) {
		System.out.println(board);
		System.out.println(Integer.parseInt(board.get("isDeleted").toString()));
		bSvc.disableBoard(Integer.parseInt(board.get("bid").toString()), Integer.parseInt(board.get("isDeleted").toString()));
		return 0;
	}
	
	@PostMapping("/delete")
	public void delete(@RequestBody JSONObject board) {
	    Object bidObj = board.get("bid");

	    if (bidObj == null) {
	        throw new IllegalArgumentException("Board ID cannot be null");
	    }

	    try {
	        int bid = Integer.parseInt(bidObj.toString());
	        bSvc.deleteBoard(bid);
	    } catch (NumberFormatException e) {
	        throw new IllegalArgumentException("Invalid Board ID format");
	    }
	}
	
}
