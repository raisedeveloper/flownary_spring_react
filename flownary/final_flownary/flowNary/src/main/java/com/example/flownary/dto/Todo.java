package com.example.flownary.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class Todo {

	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	public static class todoDto {
		int tid;
		int uid;
		String contents;
		int pri;
	}
	
	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	public static class TodoInsertDTO {
	    private SendDataInsertDTO sendData;

	    public SendDataInsertDTO getSendData() {
	        return sendData;
	    }

	    public void setSendData(SendDataInsertDTO sendData) {
	        this.sendData = sendData;
	    }
	}
	
	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	public static class SendDataInsertDTO {
	    private int uid;
	    private String contents;
	    
	}
	
	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	public static class TodoUpdateDTO {
	    private SendDataUpdateDTO sendData;

	    public SendDataUpdateDTO getSendData() {
	        return sendData;
	    }

	    public void setSendData(SendDataUpdateDTO sendData) {
	        this.sendData = sendData;
	    }
	}
	
	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	public static class SendDataUpdateDTO {
	    private int tid;
	    private String contents;
	    private int pri;
	    
	}
	
}
