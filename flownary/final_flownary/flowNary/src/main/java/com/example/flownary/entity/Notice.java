package com.example.flownary.entity;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Notice {

	int nid;
	int uid;
	int suid;
	int type;
	int oid;
	String nContents;
	LocalDateTime regTime;
	int onOff;
	
	public String getnContents() {
		return this.nContents;
	}
	
	@Override
	public String toString() {
		return "Notice [nid=" + nid + ", uid=" + uid + ", suid=" + suid + ", type=" + type + ", oid=" + oid + ", nContents=" + nContents
				+ ", regTime=" + regTime + ", onOff=" + onOff + "]";
	}
	
}
