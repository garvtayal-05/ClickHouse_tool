package com.dataingest.controller;

import com.dataingest.model.*;
import com.dataingest.service.ClickHouseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api/clickhouse")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ClickHouseController {

    private final ClickHouseService clickHouseService;

    @PostMapping("/tables")
    public ResponseEntity<?> getTables(@RequestBody ClickHouseConnection connection) {
        try {
            List<String> tables = clickHouseService.getTables(connection);
            return ResponseEntity.ok(tables);
        } catch (SQLException e) {
            log.error("Error fetching tables", e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/schema")
    public ResponseEntity<?> getTableSchema(@RequestBody SchemaRequest request) {
        try {
            TableSchema schema = clickHouseService.getTableSchema(
                    request.getConnection(), 
                    request.getTableName());
            return ResponseEntity.ok(schema);
        } catch (SQLException e) {
            log.error("Error fetching schema", e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/preview")
    public ResponseEntity<?> previewData(@RequestBody PreviewRequest request) {
        try {
            List<List<String>> data = clickHouseService.previewData(
                    request.getConnection(), 
                    request.getTableName(), 
                    request.getColumns(), 
                    100); // Preview limited to 100 rows
            return ResponseEntity.ok(data);
        } catch (SQLException e) {
            log.error("Error previewing data", e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/test-connection")
    public ResponseEntity<?> testConnection(@RequestBody ClickHouseConnection connection) {
        try {
            // Attempt to establish a connection
            clickHouseService.getConnection(connection).close();
            return ResponseEntity.ok().body(new ConnectionResponse(true, "Connection successful"));
        } catch (SQLException e) {
            log.error("Connection test failed", e);
            return ResponseEntity.ok().body(new ConnectionResponse(false, "Connection failed: " + e.getMessage()));
        }
    }
}

class ConnectionResponse {
    private boolean success;
    private String message;

    public ConnectionResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }
}