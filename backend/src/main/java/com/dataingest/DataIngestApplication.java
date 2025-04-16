package com.dataingest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

import java.io.File;

@SpringBootApplication
@ConfigurationPropertiesScan
public class DataIngestApplication {

    public static void main(String[] args) {
        // Create upload directory if it doesn't exist
        File uploadDir = new File("./uploads");
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }
        
        SpringApplication.run(DataIngestApplication.class, args);
    }
}