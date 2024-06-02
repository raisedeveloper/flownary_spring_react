package com.example.flownary.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class Re_Reply {

	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	public static class InsertReReply {
		int rid;
		int uid;
		String rrContents;
		String nickname;
	}
}
