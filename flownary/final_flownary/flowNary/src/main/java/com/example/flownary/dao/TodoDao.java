package com.example.flownary.dao;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.example.flownary.entity.Todo;

@Mapper
public interface TodoDao {

	@Select("select * from todo where tid=#{tid}")
	Todo getTodo(int tid);
	
	@Select("select * from todo where uid=#{uid}"
			+ " order by pri")
	List<Todo> getTodoList(int uid);
	
	@Select("select pri from todo where uid=#{uid}"
			+ " order by pri desc"
			+ " limit 1")
	int getTodoHighest(int uid);
	
	@Insert("insert into todo (uid, contents) values(#{uid}, #{contents})")
	void insertTodo(@Param("uid") int uid, @Param("contents") String contents);
	
	@Update("update todo set contents=#{contents}, pri=#{pri} where tid=#{tid}")
	void updateTodo(int tid, String contents, int pri);
	
	@Update("update todo set pri=#{pri} where tid=#{tid}")
	void updateTodoPri(int pri, int tid);
	
	@Delete("delete from todo where tid=#{tid}")
	void deleteTodo(int tid);
}
