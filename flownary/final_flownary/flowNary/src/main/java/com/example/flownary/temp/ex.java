package com.example.flownary.temp;

import java.text.SimpleDateFormat;
import java.util.Calendar;

public class ex {

	public static void main(String[] args) {
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyMMddHHmmssSSS");
		System.out.println(sdf);

		Calendar dateTime = Calendar.getInstance();
		String unique = sdf.format(dateTime.getTime());
		System.out.println(unique);
		for (int i = 0; i < 7; i++)
		{
			String s = unique.substring(2 * i, 2 * i + 2);
			System.out.println(s);
			
		}
	}

}
