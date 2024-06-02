package com.example.flownary.entity;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Reply {

	int rid;
	int bid;
	int uid;
	String rContents;
	LocalDateTime modTime;
	int likeCount;
	String nickname;
	int isDeleted;	
	
	public String getrContents() {
		return this.rContents;
	}

	@Override
	public String toString() {
		return "Reply [rid=" + rid + ", bid=" + bid + ", uid=" + uid + ", rContents=" + rContents + ", modTime="
				+ modTime + ", isDeleted=" + isDeleted + ", nickname=" + nickname + "]";
	}

	public Reply(int bid, int uid, String rContents, String nickname) {
		this.bid = bid;
		this.uid = uid;
		this.rContents = rContents;
		this.nickname = nickname;
	}
}
