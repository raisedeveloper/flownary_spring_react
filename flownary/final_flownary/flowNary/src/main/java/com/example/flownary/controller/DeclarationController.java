package com.example.flownary.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.flownary.dto.Declaration.InsertDeclarationDto;
import com.example.flownary.entity.Declaration;
import com.example.flownary.service.DeclarationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/declaration")
@RequiredArgsConstructor
@SuppressWarnings("unchecked")
public class DeclarationController {
	private final DeclarationService deSvc;

	@GetMapping("/getdeclaration")
	public JSONObject getdeclaration(@RequestParam int deid,
			@RequestParam(defaultValue = "-1", required = false) int uid) {
		Declaration Declaration = deSvc.getDeclaration(deid);

		HashMap<String, Object> hMap = new HashMap<String, Object>();

		if (Declaration != null) {
			hMap.put("deid", Declaration.getDeid());
			hMap.put("bid", Declaration.getBid());
			hMap.put("uid", Declaration.getUid());
			hMap.put("dTitle", Declaration.getdTitle());
			hMap.put("dContents", Declaration.getdContents());
			hMap.put("modTime", Declaration.getModTime());
			hMap.put("state", Declaration.getState());
			JSONObject jDeclaration = new JSONObject(hMap);

			return jDeclaration;
		}
		return null;
	}

	@GetMapping("/list")
	public JSONArray declarationList(
			@RequestParam(defaultValue = "-1", required = false) int uid) {

		List<Declaration> list = new ArrayList<>();
		list = deSvc.getDeclarationList();

		JSONArray jArr = new JSONArray();
		for (Declaration Declaration : list) {
			HashMap<String, Object> hMap = new HashMap<String, Object>();

			hMap.put("deid", Declaration.getDeid());
			hMap.put("bid", Declaration.getBid());
			hMap.put("uid", Declaration.getUid());
			hMap.put("dTitle", Declaration.getdTitle());
			hMap.put("dContents", Declaration.getdContents());
			hMap.put("modTime", Declaration.getModTime());
			hMap.put("state", Declaration.getState());
			JSONObject jdeclaration = new JSONObject(hMap);

			jArr.add(jdeclaration);
		}
		return jArr;
	}

	@PostMapping("/insert")
	public void insertForm(@RequestBody InsertDeclarationDto dto) {
		Declaration declaration = new Declaration(dto.getBid(),dto.getUid(), dto.getdTitle()
				, dto.getdContents());
		
		deSvc.insertDeclaration(declaration);
		System.out.println(declaration);
		
	}

	@PostMapping("/delete")
	public void delete(@RequestBody JSONObject Declaration) {
		Object deidObj = Declaration.get("deid");

		if (deidObj == null) {
			throw new IllegalArgumentException("Declaration ID cannot be null");
		}

		try {
			int deid = Integer.parseInt(deidObj.toString());
			deSvc.deleteDeclaration(deid);
		} catch (NumberFormatException e) {
			throw new IllegalArgumentException("Invalid Declaration ID format");
		}
	}

}
