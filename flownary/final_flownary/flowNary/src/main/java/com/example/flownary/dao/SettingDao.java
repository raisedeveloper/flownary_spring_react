package com.example.flownary.dao;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.example.flownary.entity.Setting;

@Mapper
public interface SettingDao {

	@Select("select * from setting where uid=#{uid}")
	Setting getSetting(int uid);
	
	@Insert("insert into setting values(#{uid}, #{theme}, default, default, default)")
	void insertSetting(Setting setting);
	
	@Update("update setting set theme=#{theme}, accountEnableUnable=#{accountEnableUnable}"
			+ ", fontSize=#{fontSize}, blackList=#{blackList}"
			+ " where uid=#{uid}")
	void updateSetting(Setting setting);
}
