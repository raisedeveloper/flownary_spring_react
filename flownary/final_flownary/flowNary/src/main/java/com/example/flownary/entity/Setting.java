package com.example.flownary.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Setting {

	int uid;
	String theme;
	int accountEnableUnable;
	int fontSize;
	String blackList;

	@Override
	public String toString() {
		return "Setting [uid=" + uid + ", theme=" + theme + ", accountEnableUnable=" + accountEnableUnable
				+ ", fontSize=" + fontSize + ", blackList=" + blackList + "]";
	}
	
}
