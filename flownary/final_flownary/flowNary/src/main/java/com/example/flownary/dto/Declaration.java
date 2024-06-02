package com.example.flownary.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class Declaration {

	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	public static class InsertDeclarationDto {
		int bid;
		int uid;
		String dTitle;
		String dContents;
		
		public String getdContents() {
			return dContents;
		}

		public void setdContents(String bContents) {
			this.dContents = bContents;
		}
		
		public String getdTitle() {
			return dTitle;
		}

		public void setdTitle(String dTitle) {
			this.dTitle = dTitle;
		}
	}
	
}
