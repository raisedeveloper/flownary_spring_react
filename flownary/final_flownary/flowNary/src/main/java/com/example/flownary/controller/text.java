package com.example.flownary.controller;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@SuppressWarnings("unchecked")
@RestController // ResponseBody를 쓰지 않으면 url 중복 호출로 인해 문제가 발생할 수 있음
@Controller
public class text {
	
	// String 넘겨주기
	@GetMapping("/text")
	public String helloWorld(Model model) {
		return "Hello world";
	}
	
	// JSON으로 넘겨주기
	@GetMapping("/text2")
	public JSONObject json() {
		JSONObject jObj = new JSONObject();
		jObj.put("id", "james");
		jObj.put("name", "제임스");
		
		return jObj;
	}
	
	// 배열 넘겨주기
	// 배열을 그냥 넘겨줄 수는 없어서 JSONArray를 사용해야 함
	@GetMapping("/text3")
	public JSONArray users () {
		JSONArray jArr = new JSONArray();
		try {
			for (int i = 0; i < 5; i++) {
				JSONObject jb = new JSONObject(); // JSON 오브젝트 생성
				jb.put("id", i);
				jb.put("name", "name" + i); // 왼쪽은 key, 오른쪽은 value
				jArr.add(jb);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return jArr;
	}
	
	// React에서 데이터 받기
	@GetMapping("/board/insert")
	public int boardinsert(@RequestParam int id, @RequestParam String title)
	{
		System.out.println("id: " + id + ", " + "title: " + title);
		
		return 2;
	}
}
