package com.dataingest.controller;

import com.dataingest.model.ClickHouseConnection;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

@RestController
@RequestMapping("/api/database")
@Slf4j
@CrossOrigin(origins = "*")
public class DatabaseController {

    @PostMapping("/info")
    public ResponseEntity<?> getDatabaseInfo(@RequestBody ClickHouseConnection connectionParams) {
        try {
            Map<String, Object> info = new HashMap<>();
            
            String url = String.format("jdbc:clickhouse://%s:%d/%s", 
                    connectionParams.getHost(), 
                    connectionParams.getPort(), 
                    connectionParams.getDatabase());
            
            Properties properties = new Properties();
            properties.setProperty("user", connectionParams.getUser());
            
            if (connectionParams.getJwtToken() != null && !connectionParams.getJwtToken().isEmpty()) {
                properties.setProperty("access_token", connectionParams.getJwtToken());
            }
            
            try (Connection conn = DriverManager.getConnection(url, properties)) {
                DatabaseMetaData metaData = conn.getMetaData();
                
                info.put("databaseProductName", metaData.getDatabaseProductName());
                info.put("databaseProductVersion", metaData.getDatabaseProductVersion());
                info.put("driverName", metaData.getDriverName());
                info.put("driverVersion", metaData.getDriverVersion());
                info.put("url", metaData.getURL());
                info.put("username", metaData.getUserName());
            }
            
            return ResponseEntity.ok(info);
        } catch (SQLException e) {
            log.error("Error getting database info", e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}