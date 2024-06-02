package com.example.flownary.entity;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class User {

	int uid;
	String email;
	String pwd;
	String profile;
	String uname;
	String nickname;
	String statusMessage;
	String snsDomain;
	int status;
	LocalDate regDate;
	int gender;
	int provider;
	LocalDate birth;
	String tel;
	String hashUid;
	String location;
	int role;

	@Override
	public String toString() {
		return "User [uid=" + uid + ", email=" + email + ", pwd=" + pwd + ", profile=" + profile + ", uname=" + uname
				+ ", nickname=" + nickname + ", statusMessage=" + statusMessage + ", snsDomain=" + snsDomain
				+ ", status=" + status + ", regDate=" + regDate + ", gender=" + gender + ", provider=" + provider
				+ ", birth=" + birth + ", tel=" + tel + ", hashUid=" + hashUid + ", location=" + location + ", role="
				+ role + "]";
	}

}
