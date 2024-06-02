package com.example.flownary.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

public class Family {
	
	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	@ToString
	public static class FamilyInsertDto {
		String name;
		int uid;
		String nickname;
	}
	
	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	@ToString
	public static class FamilyUpdateDto {
		int faid;
		String name;
	}

	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	@ToString
	public static class FamilyUserInsertDto {
		int faid;
		int uid;
		int status;
		String name;
		String message;
	}
	
	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	@ToString
	public static class FamilyUserUpdateDto {
		int faid;
		int uid;
		String name;
		String message;
	}
	
	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	@ToString
	public static class FamilyUserUpdateStatusDto {
		int faid;
		int uid;
		int status;
	}
	
	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	@ToString
	public static class FamilyLeaderUserDto {
		int uid;
		String email;
		String nickname;
		String profile;
		String name;
	}
}
