package com.example.flownary.entity;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class Re_Reply {

	int rrid;
	int rid;
	int uid;
	String rrContents;
	LocalDateTime modTime;
	int likeCount;
	String nickname;
	int isDeleted;

}
