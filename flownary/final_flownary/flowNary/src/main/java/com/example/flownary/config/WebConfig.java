package com.example.flownary.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.example.flownary.filter.CorsFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer{

	 @Bean
	    public CorsFilter corsFilter(){
	        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	        CorsConfiguration config = new CorsConfiguration();
	        config.setAllowCredentials(true);
	        config.addAllowedOriginPattern("http://43.201.34.152:8080"); //특정 패턴 Origin만 허용
	        config.addAllowedOriginPattern("http://localhost:3000");
	        config.addAllowedHeader(""); //특정 header만 허용
	        config.addAllowedMethod(""); //특정 메소드만 허용
	        config.addExposedHeader("Authorization");
	        config.addExposedHeader("*"); //추가헤더,커스텀 헤더를 지정
	        source.registerCorsConfiguration("/**", config); //corsConfiguration으로 등록
	        return new CorsFilter();
	    }
	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**").allowedOrigins("*").allowedMethods("GET", "POST");
	}
}
