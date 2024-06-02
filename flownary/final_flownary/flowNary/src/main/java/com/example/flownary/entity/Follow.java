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
public class Follow {

	int fid;
	int uid;
	int fuid;
	LocalDateTime time;
	
	@Override
	public String toString() {
		return "Follow [fid=" + fid + ", uid=" + uid + ", fuid=" + fuid + ", time=" + time + "]";
	}
	
}
