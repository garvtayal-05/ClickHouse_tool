package com.dataingest.controller;

import com.dataingest.model.FlatFileConnection;
import com.dataingest.model.TableSchema;
import com.dataingest.service.FlatFileService;
import com.opencsv.exceptions.CsvValidationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/flatfile")
public class FlatFileController {
    
    private final FlatFileService flatFileService;

    public FlatFileController(FlatFileService flatFileService) {
        this.flatFileService = flatFileService;
    }

    @PostMapping("/schema")
    public ResponseEntity<?> getFileSchema(@RequestBody FlatFileConnection connection) {
        try {
            return ResponseEntity.ok(flatFileService.getFileSchema(connection));
        } catch (IOException | CsvValidationException e) {
            return ResponseEntity.badRequest().body("Error processing file: " + e.getMessage());
        }
    }

    @PostMapping("/preview")
    public ResponseEntity<?> previewData(@RequestBody FlatFileConnection connection,
                                      @RequestParam(defaultValue = "10") int limit) {
        try {
            return ResponseEntity.ok(flatFileService.previewData(connection, limit));
        } catch (IOException | CsvValidationException e) {
            return ResponseEntity.badRequest().body("Error previewing data: " + e.getMessage());
        }
    }
}