package com.dataingest.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
@Slf4j
@CrossOrigin(origins = "*")
public class FileController {

    @Value("${app.upload-dir:./uploads}")
    private String uploadDir;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Please select a file to upload");
            }

            // Generate a unique filename to prevent conflicts
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename != null ? 
                originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
            String filename = UUID.randomUUID().toString() + fileExtension;
            
            // Save the file
            Path path = Paths.get(uploadDir + "/" + filename);
            Files.copy(file.getInputStream(), path);

            Map<String, String> response = new HashMap<>();
            response.put("filename", filename);
            response.put("originalFilename", originalFilename);
            response.put("filepath", path.toString());
            response.put("size", String.valueOf(file.getSize()));

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            log.error("Error uploading file", e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/list")
    public ResponseEntity<?> listFiles() {
        try {
            Path dir = Paths.get(uploadDir);
            if (!Files.exists(dir)) {
                Files.createDirectories(dir);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("files", Files.list(dir)
                    .filter(Files::isRegularFile)
                    .map(path -> {
                        Map<String, String> fileInfo = new HashMap<>();
                        fileInfo.put("name", path.getFileName().toString());
                        fileInfo.put("path", path.toString());
                        try {
                            fileInfo.put("size", String.valueOf(Files.size(path)));
                        } catch (IOException e) {
                            fileInfo.put("size", "unknown");
                        }
                        return fileInfo;
                    })
                    .toList());
            
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            log.error("Error listing files", e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}