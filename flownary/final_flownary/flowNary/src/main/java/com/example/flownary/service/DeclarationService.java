package com.example.flownary.service;

import java.util.List;

import com.example.flownary.entity.Declaration;

public interface DeclarationService {
	public static final int COUNT_PER_PAGE = 5; // 스크롤할때마다 보여주는 게시물 수

	Declaration getDeclaration(int deid);

	List<Declaration> getDeclarationList();

//	List<Declaration> getDeclarationListSearch(int count, List<String> field, String query);

	void insertDeclaration(Declaration declaration);

	void deleteDeclaration(int deid);

}
