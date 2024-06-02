package com.example.flownary.entity;

import java.time.LocalDateTime;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class Board {

	int bid;
	int uid;
	String title;
	String bContents;
	LocalDateTime modTime;
	int viewCount;
	int likeCount;
	int replyCount;
	String image;
	String shareUrl;
	String nickname;
	String hashTag;
	int isDeleted;

	public Board(int uid, String title, String bContents) {
		this.uid = uid;
		this.title = title;
		this.bContents = bContents;
	}

	public Board(int uid, String title, String bContents, String nickname) {
		this.uid = uid;
		this.title = title;
		this.bContents = bContents;
		this.nickname = nickname;
	}

	public Board(int uid, String title, String bContents, String image, String shareUrl) {
		this.uid = uid;
		this.title = title;
		this.bContents = bContents;
		this.image = image;
		this.shareUrl = shareUrl;
	}

	public Board(int uid, String title, String bContents, String image, String shareUrl, String nickname) {
		this.uid = uid;
		this.title = title;
		this.bContents = bContents;
		this.image = image;
		this.shareUrl = shareUrl;
		this.nickname = nickname;
	}

	public Board(int uid, String title, String bContents, LocalDateTime modTime, String image, String shareUrl,
			String hashTag) {
		this.uid = uid;
		this.title = title;
		this.bContents = bContents;
		this.modTime = modTime;
		this.image = image;
		this.shareUrl = shareUrl;
		this.hashTag = hashTag;
	}

	public Board(int bid, int uid, String title, String bContents, LocalDateTime modTime, int viewCount, int likeCount,
			int replyCount, String image, String shareUrl, int isDeleted) {
		this.bid = bid;
		this.uid = uid;
		this.title = title;
		this.bContents = bContents;
		this.modTime = modTime;
		this.viewCount = viewCount;
		this.likeCount = likeCount;
		this.replyCount = replyCount;
		this.image = image;
		this.shareUrl = shareUrl;
		this.isDeleted = isDeleted;
	}

	public Board(int bid, int uid, String title, String bContents, LocalDateTime modTime, int viewCount, int likeCount,
			int replyCount, String image, String shareUrl, int isDeleted, String hashTag) {
		this.bid = bid;
		this.uid = uid;
		this.title = title;
		this.bContents = bContents;
		this.modTime = modTime;
		this.viewCount = viewCount;
		this.likeCount = likeCount;
		this.replyCount = replyCount;
		this.image = image;
		this.shareUrl = shareUrl;
		this.isDeleted = isDeleted;
		this.hashTag = hashTag;
	}

	public Board(int bid, int uid, String title, String bContents, LocalDateTime modTime, int viewCount, int likeCount,
			int replyCount, String image, String shareUrl, int isDeleted, String hashTag, String nickname) {
		this.bid = bid;
		this.uid = uid;
		this.title = title;
		this.bContents = bContents;
		this.modTime = modTime;
		this.viewCount = viewCount;
		this.likeCount = likeCount;
		this.replyCount = replyCount;
		this.image = image;
		this.shareUrl = shareUrl;
		this.isDeleted = isDeleted;
		this.hashTag = hashTag;
		this.nickname = nickname;
	}

	@Override
	public String toString() {
		return "Board [bid=" + bid + ", uid=" + uid + ", title=" + title + ", bContents=" + bContents + ", modTime="
				+ modTime + ", viewCount=" + viewCount + ", likeCount=" + likeCount + ", replyCount=" + replyCount
				+ ", image=" + image + ", shareUrl=" + shareUrl + ", isDeleted=" + isDeleted + "]";
	}

	public int getBid() {
		return bid;
	}

	public void setBid(int bid) {
		this.bid = bid;
	}

	public int getUid() {
		return uid;
	}

	public void setUid(int uid) {
		this.uid = uid;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getbContents() {
		return bContents;
	}

	public void setbContents(String bContents) {
		this.bContents = bContents;
	}

	public LocalDateTime getModTime() {
		return modTime;
	}

	public void setModTime(LocalDateTime modTime) {
		this.modTime = modTime;
	}

	public int getViewCount() {
		return viewCount;
	}

	public void setViewCount(int viewCount) {
		this.viewCount = viewCount;
	}

	public int getLikeCount() {
		return likeCount;
	}

	public void setLikeCount(int likeCount) {
		this.likeCount = likeCount;
	}

	public int getReplyCount() {
		return replyCount;
	}

	public void setReplyCount(int replyCount) {
		this.replyCount = replyCount;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public String getShareUrl() {
		return shareUrl;
	}

	public void setShareUrl(String shareUrl) {
		this.shareUrl = shareUrl;
	}

	public int getIsDeleted() {
		return isDeleted;
	}

	public void setIsDeleted(int isDeleted) {
		this.isDeleted = isDeleted;
	}
	
	public String getNickname() {
		return nickname;
	}
	
	public void setNickname(String nickname) {
		this.nickname = nickname;
	}

	public String getHashTag() {
		return hashTag;
	}

	public void setHashTag(String hashTag) {
		this.hashTag = hashTag;
	}

	public Board(int uid, String title, String bContents, String image, String shareUrl, String nickname,
			String hashTag, int isDeleted) {
		super();
		this.uid = uid;
		this.title = title;
		this.bContents = bContents;
		this.image = image;
		this.shareUrl = shareUrl;
		this.nickname = nickname;
		this.hashTag = hashTag;
		this.isDeleted = isDeleted;
	}
}
