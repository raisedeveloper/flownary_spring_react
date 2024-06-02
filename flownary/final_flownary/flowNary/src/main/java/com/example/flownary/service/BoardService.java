package com.example.flownary.service;

import java.util.List;

import com.example.flownary.entity.Board;

public interface BoardService {
	public static final int COUNT_PER_PAGE = 5; // 스크롤할때마다 보여주는 게시물 수

	Board getBoard(int bid);

	int getBoardShareUrl(String ShareUrl);

	Board getBoardShareUrl2(String ShareUrl);

	int getBoardCount(String field, String query);

	List<Board> getBoardList(int count, String field, String query);

	List<Board> getMyBoardList(int uid);

	List<Board> getLikedBoardList(int uid);

	List<Board> getBoardListSearch(int count, List<String> field, String query);

	int getBoardListCount(String field, String query);

	int getBoardListCountSearch(List<String> field, String query);

	void insertBoard(Board board);

	void updateBoard(Board board);

	void updateBoardNickname(int uid, String nickname);

	void disableBoard(int bid, int isDeleted);

	void deleteBoard(int bid);

	void updateReplyCount(int bid, int replyCount);

	void updateLikeCount(int bid, int likecount);

	void updateViewCount(int bid);

}
