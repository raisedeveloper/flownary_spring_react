package com.example.flownary.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.flownary.dao.DeclarationDao;
import com.example.flownary.entity.Declaration;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DeclarationServiceImpl implements DeclarationService {

	private final DeclarationDao declarationDao;

	@Override
	public Declaration getDeclaration(int deid) {
		return declarationDao.getDeclaration(deid);
	}

	@Override
	public List<Declaration> getDeclarationList() {
		// int offset = (page - 1) * COUNT_PER_PAGE;
		return declarationDao.getDeclarationList();
	}

//	@Override
//	public List<Declaration> getDeclarationListSearch(int count, List<String> field, String query) {
//		query = "%" + query + "%";
//		return declarationDao.getDeclarationList(field.get(0), query, count);
//
//	}

	@Override
	public void insertDeclaration(Declaration declaration) {
		declarationDao.insertDeclaration(declaration);
	}

	@Override
	public void deleteDeclaration(int deid) {
		declarationDao.deleteDeclaration(deid);
	}

}
