package com.isp.automation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class IspAutomationApplication {

	public static void main(String[] args) {
		SpringApplication.run(IspAutomationApplication.class, args);
	}

}
