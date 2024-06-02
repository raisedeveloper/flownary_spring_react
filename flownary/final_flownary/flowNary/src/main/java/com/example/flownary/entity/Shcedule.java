package com.example.flownary.entity;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Shcedule {

	int sid;
	int uid;
	String title;
	String memo;
	String place;
	LocalDateTime startTime;
	LocalDateTime endTime;
	int status;
}
