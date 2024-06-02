package com.example.flownary.entity;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class DmList {

	int did;
	int uid;
	int cid;
	String dContents;
	LocalDateTime dTime;
	String dFile;
	int isDeleted;
	String nickname;
	String profile;

	public String getdContents() {
		return dContents;
	}

	public void setdContents(String dContents) {
		this.dContents = dContents;
	}

	public LocalDateTime getdTime() {
		return dTime;
	}

	public void setdTime(LocalDateTime dTime) {
		this.dTime = dTime;
	}

	public String getdFile() {
		return dFile;
	}

	public void setdFile(String dFile) {
		this.dFile = dFile;
	}
	
}
