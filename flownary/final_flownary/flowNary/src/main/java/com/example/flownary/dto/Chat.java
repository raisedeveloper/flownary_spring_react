package com.example.flownary.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class Chat {

	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	public static class InsertChatDto {
		String name;
		int uid;
		int fuid;
		String contents;
	}
	
	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	public static class InsertTeamChatDto {
		String name;
		int uid;
	}
	
	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	public static class updateChatDto {
		int cid;
		int status;
		String name;
	}
	
	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	public static class insertChatUserDto {
		int cid;
		int uid;
		int status;
		String name;
		int userrank;
	}
	
	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	public static class updateChatUserDto {
		int cid;
		int uid;
		int status;
		String name;
		int userrank;
	}
}
