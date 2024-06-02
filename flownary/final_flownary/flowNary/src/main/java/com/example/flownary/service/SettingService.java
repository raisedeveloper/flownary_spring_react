package com.example.flownary.service;

import com.example.flownary.entity.Setting;

public interface SettingService {

	Setting getSetting(int uid);
	
	void insertSetting(Setting setting);
	
	void updateSetting(Setting setting);
}
