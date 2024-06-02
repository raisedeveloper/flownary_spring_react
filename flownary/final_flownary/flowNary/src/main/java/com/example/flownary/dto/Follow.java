package com.example.flownary.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class Follow {

	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	public static class insertFollowDto {
		int uid;
		int fuid;
	}
}
