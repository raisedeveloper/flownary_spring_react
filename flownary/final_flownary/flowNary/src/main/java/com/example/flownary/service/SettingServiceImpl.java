package com.example.flownary.service;

import org.springframework.stereotype.Service;

import com.example.flownary.dao.SettingDao;
import com.example.flownary.entity.Setting;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class SettingServiceImpl implements SettingService {
	
	private final SettingDao sDao;
	
	@Override
	public Setting getSetting(int uid) {
		return sDao.getSetting(uid);
	}

	@Override
	public void insertSetting(Setting setting) {
		sDao.insertSetting(setting);
	}

	@Override
	public void updateSetting(Setting setting) {
		sDao.updateSetting(setting);
	}

}
