package com.example.flownary.controller;

import java.util.List;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.flownary.dto.Re_Reply.InsertReReply;
import com.example.flownary.dto.Reply.InsertReply;
import com.example.flownary.dto.User.GetUserNickEmailDto;
import com.example.flownary.entity.Board;
import com.example.flownary.entity.Re_Reply;
import com.example.flownary.entity.Reply;
import com.example.flownary.service.BoardService;
import com.example.flownary.service.LikeService;
import com.example.flownary.service.Re_ReplyService;
import com.example.flownary.service.ReplyService;
import com.example.flownary.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/reply")
@RequiredArgsConstructor
@SuppressWarnings("unchecked")
public class ReplyController {

	private final ReplyService rSvc;
	private final Re_ReplyService rrSvc;
	private final UserService uSvc;
	private final NoticeController nC;
	private final BoardService bSvc;
	private final LikeService lSvc;

	@GetMapping("/list")
	public JSONArray replyList(@RequestParam int bid, @RequestParam int offset, @RequestParam int limit,
			@RequestParam(defaultValue = "-1", required = false) int uid) {
		List<Reply> list = rSvc.getReplyList(bid, offset, limit);
		JSONArray jArr = new JSONArray();
		int totalCount = 0;
//		JSONObject c = new JSONObject();
//		c.put("count", rrSvc.getReReplyCount(r) + rSvc.getReplyCount(bid));
//		jArr.add(c);
		for (Reply reply : list) {
			totalCount++;
			totalCount += rrSvc.getReReplyCount(reply.getRid());
		}

		for (Reply reply : list) {
			JSONObject jreply = new JSONObject();
			GetUserNickEmailDto user = uSvc.getUserNicknameEmail(reply.getUid());
			int like = lSvc.getLikeUidCount(uid, 2, reply.getRid());
			jreply.put("rid", reply.getRid());
			jreply.put("bid", reply.getBid());
			jreply.put("uid", reply.getUid());
			jreply.put("rContents", reply.getrContents());
			jreply.put("modTime", reply.getModTime());
			jreply.put("likeCount", reply.getLikeCount());
			jreply.put("nickname", reply.getNickname());
			jreply.put("profile", user.getProfile());
			jreply.put("replyCount", totalCount);
			jreply.put("liked", (like == 1) ? true : false);
			jreply.put("ReReplyCount", rrSvc.getReReplyCount(reply.getRid()));
			jArr.add(jreply);
		}
		return jArr;
	}

	@GetMapping("/re_list")
	public JSONArray re_ReplyList(@RequestParam int rid, @RequestParam(defaultValue = "-1", required = false) int uid) {
		List<Re_Reply> list = rrSvc.getReReplyList(rid);
		JSONArray jArr = new JSONArray();

		for (Re_Reply re_Reply : list) {
			JSONObject jre_Reply = new JSONObject();
			GetUserNickEmailDto user = uSvc.getUserNicknameEmail(re_Reply.getUid());
			int like = lSvc.getLikeUidCount(uid, 3, re_Reply.getRrid());
			jre_Reply.put("rrid", re_Reply.getRrid());
			jre_Reply.put("rid", re_Reply.getRid());
			jre_Reply.put("uid", re_Reply.getUid());
			jre_Reply.put("rrContents", re_Reply.getRrContents());
			jre_Reply.put("modTime", re_Reply.getModTime());
			jre_Reply.put("likeCount", re_Reply.getLikeCount());
			jre_Reply.put("nickname", re_Reply.getNickname());
			jre_Reply.put("profile", user.getProfile());
			jre_Reply.put("liked", (like == 1) ? true : false);
			jArr.add(jre_Reply);
		}
		return jArr;
	}

	@PostMapping("/insert")
	public void reply(@RequestBody InsertReply dto) {
		Reply reply = new Reply(dto.getBid(), dto.getUid(), dto.getrContents(), dto.getNickname());
		rSvc.insertReply(reply);

		// 댓글 조회수
		Board board = bSvc.getBoard(dto.getBid());
		int replyCount = board.getReplyCount();
		bSvc.updateReplyCount(dto.getBid(), replyCount);

		nC.insertNotice(dto.getUid(), 2, dto.getBid(), board.getUid());
	}

	@PostMapping("/re_insert")
	public String Re_reply(@RequestBody InsertReReply dto) {
		@SuppressWarnings("static-access")
		Re_Reply re_Reply = new Re_Reply().builder().rid(dto.getRid()).uid(dto.getUid()).rrContents(dto.getRrContents())
				.nickname(dto.getNickname()).build();
		rrSvc.insertReReply(re_Reply);
		Reply reply = rSvc.getReply(dto.getRid());

		nC.insertNotice(dto.getUid(), 2, dto.getRid(), reply.getUid());

		return "대댓글이 입력되었습니다";
	}

	@PostMapping("/delete")
	public void deleteReply(@RequestBody JSONObject sendData) {
		Object bidObj = sendData.get("rid");

		if (bidObj == null) {
			System.err.println("Board ID is null in the request: " + sendData);
			throw new IllegalArgumentException("Board ID cannot be null");
		}

		try {
			int rid = Integer.parseInt(bidObj.toString());
			System.out.println("Deleting rid with ID: " + rid);
			rSvc.deleteReply(rid);
		} catch (NumberFormatException e) {
			System.err.println("Invalid rid ID format: " + bidObj);
			throw new IllegalArgumentException("Invalid rid ID format");
		}
	}

	@PostMapping("/re_delete")
	public void deleteReReply(@RequestBody JSONObject sendData) {
		Object bidObj = sendData.get("rrid");

		if (bidObj == null) {
			System.err.println("Board ID is null in the request: " + sendData);
			throw new IllegalArgumentException("Board ID cannot be null");
		}

		try {
			int rrid = Integer.parseInt(bidObj.toString());
			System.out.println("Deleting rrid with ID: " + rrid);
			rrSvc.deleteReReply(rrid);
		} catch (NumberFormatException e) {
			System.err.println("Invalid rrid ID format: " + bidObj);
			throw new IllegalArgumentException("Invalid rrid ID format");
		}

	}
}
