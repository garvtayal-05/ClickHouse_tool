package com.dataingest.controller;

import com.dataingest.model.IngestionRequest;
import com.dataingest.model.IngestionResponse;
import com.dataingest.service.IngestionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ingestion")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class IngestionController {

    private final IngestionService ingestionService;

    @PostMapping("/start")
    public ResponseEntity<?> startIngestion(@RequestBody IngestionRequest request) {
        log.info("Received ingestion request: {}", request);
        try {
            IngestionResponse response = ingestionService.performIngestion(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error during ingestion process", e);
            return ResponseEntity.badRequest().body(
                new IngestionResponse(false, 0, "Error: " + e.getMessage())
            );
        }
    }
    
    // For handling complex join operations
    @PostMapping("/join")
    public ResponseEntity<?> performJoinIngestion(@RequestBody IngestionRequest request) {
        log.info("Received join ingestion request: {}", request);
        
        // Validate that this is a join request
        if (request.getJoinTables() == null || request.getJoinTables().isEmpty() || 
            request.getJoinCondition() == null || request.getJoinCondition().isEmpty()) {
            return ResponseEntity.badRequest().body(
                new IngestionResponse(false, 0, "Invalid join request: missing join tables or condition")
            );
        }
        
        try {
            IngestionResponse response = ingestionService.performIngestion(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error during join ingestion process", e);
            return ResponseEntity.badRequest().body(
                new IngestionResponse(false, 0, "Error: " + e.getMessage())
            );
        }
    }
}