package com.example.flownary.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class Reply {

	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	public static class InsertReply {
		int bid;
		int uid;
		String rContents;
		String nickname;
		
		public String getrContents() {
			return rContents;
		}
		
		public void setrContents(String rContents) {
			this.rContents = rContents;
		}
	}
}
