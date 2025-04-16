package com.dataingest.service;

import com.dataingest.model.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class IngestionService {
    
    private final ClickHouseService clickHouseService;
    private final FlatFileService flatFileService;
    
    public IngestionResponse performIngestion(IngestionRequest request) {
        try {
            if ("clickhouse".equalsIgnoreCase(request.getSource()) && 
                "flatfile".equalsIgnoreCase(request.getTarget())) {
                
                return clickHouseService.clickHouseToFlatFile(request);
                
            } else if ("flatfile".equalsIgnoreCase(request.getSource()) && 
                       "clickhouse".equalsIgnoreCase(request.getTarget())) {
                
                // Read data from flat file
                List<List<String>> data = flatFileService.readFileData(
                        request.getFlatFileConnection(), 
                        request.getSelectedColumns());
                
                // Get schema
                TableSchema schema = flatFileService.inferSchema(request.getFlatFileConnection());
                
                // Import data to ClickHouse
                return clickHouseService.flatFileToClickHouse(request, data, schema);
                
            } else {
                return new IngestionResponse(false, 0, "Invalid source or target configuration");
            }
        } catch (Exception e) {
            log.error("Error during ingestion", e);
            return new IngestionResponse(false, 0, "Error: " + e.getMessage());
        }
    }
}