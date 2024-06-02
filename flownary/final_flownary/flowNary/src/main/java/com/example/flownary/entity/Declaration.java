package com.example.flownary.entity;

import java.time.LocalDateTime;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class Declaration {

	int deid;
	int bid;
	int uid;
	String dTitle;
	String dContents;
	LocalDateTime modTime;
	int state;

	public Declaration(int deid, int bid, int uid, String dTitle, String dContents, LocalDateTime modTime, int state) {
		this.deid = deid;
		this.bid = bid;
		this.uid = uid;
		this.dTitle = dTitle;
		this.dContents = dContents;
		this.modTime = modTime;
		this.state = state;
	}

	public Declaration(int bid, int uid, String dTitle, String dContents) {
		this.bid = bid;
		this.uid = uid;
		this.dTitle = dTitle;
		this.dContents = dContents;
	}

	@Override
	public String toString() {
		return "Declaration [deid=" + deid + ", bid=" + bid + ", uid=" + uid + ", dTitle=" + dTitle + ", dContents="
				+ dContents + ", modTime=" + modTime + ", state=" + state + "]";
	}

	public int getDeid() {
		return deid;
	}

	public void setDeid(int deid) {
		this.deid = deid;
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

	public String getdTitle() {
		return dTitle;
	}

	public void setdTitle(String dTitle) {
		this.dTitle = dTitle;
	}

	public String getdContents() {
		return dContents;
	}

	public void setdContents(String dContents) {
		this.dContents = dContents;
	}

	public LocalDateTime getModTime() {
		return modTime;
	}

	public void setModTime(LocalDateTime modTime) {
		this.modTime = modTime;
	}

	public int getState() {
		return state;
	}

	public void setState(int state) {
		this.state = state;
	}

}
