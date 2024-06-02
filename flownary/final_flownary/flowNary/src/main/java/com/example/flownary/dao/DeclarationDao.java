package com.example.flownary.dao;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.example.flownary.entity.Declaration;

@Mapper
public interface DeclarationDao {

	@Select("select * from Declaration where deid=#{deid}")
	Declaration getDeclaration(int deid);
	
	@Select("select * from Declaration"
			+ " where state!=2")
	List<Declaration> getDeclarationList();
	
	@Insert("insert into Declaration values(default, #{bid}, #{uid}, #{dTitle}, #{dContents}, default, default)")
	void insertDeclaration(Declaration Declaration);
	
	@Update("update Declaration set isDeleted=-2 where deid=#{deid}")
	void deleteDeclaration(int deid);
	
}
