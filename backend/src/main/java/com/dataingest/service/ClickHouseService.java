package com.dataingest.service;

import com.dataingest.model.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.FileWriter;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ClickHouseService {

    public Connection getConnection(ClickHouseConnection connectionParams) throws SQLException {
        String url = String.format("jdbc:clickhouse://%s:%d/%s", 
                connectionParams.getHost(), 
                connectionParams.getPort(), 
                connectionParams.getDatabase());
        
        Properties properties = new Properties();
        properties.setProperty("user", connectionParams.getUser());
        
        // Using JWT token for authentication
        if (connectionParams.getJwtToken() != null && !connectionParams.getJwtToken().isEmpty()) {
            properties.setProperty("access_token", connectionParams.getJwtToken());
        }
        
        return DriverManager.getConnection(url, properties);
    }
    
    public List<String> getTables(ClickHouseConnection connectionParams) throws SQLException {
        List<String> tables = new ArrayList<>();
        
        try (Connection conn = getConnection(connectionParams);
             Statement stmt = conn.createStatement()) {
             
            ResultSet rs = stmt.executeQuery("SHOW TABLES");
            while (rs.next()) {
                tables.add(rs.getString(1));
            }
        }
        
        return tables;
    }
    
    public TableSchema getTableSchema(ClickHouseConnection connectionParams, String tableName) throws SQLException {
        List<ColumnInfo> columns = new ArrayList<>();
        
        try (Connection conn = getConnection(connectionParams);
             Statement stmt = conn.createStatement()) {
             
            ResultSet rs = stmt.executeQuery("DESCRIBE " + tableName);
            while (rs.next()) {
                String columnName = rs.getString("name");
                String columnType = rs.getString("type");
                columns.add(new ColumnInfo(columnName, columnType));
            }
        }
        
        return new TableSchema(tableName, columns);
    }
    
    public List<List<String>> previewData(ClickHouseConnection connectionParams, String tableName, List<String> columns, int limit) throws SQLException {
        List<List<String>> data = new ArrayList<>();
        
        String columnStr = columns.isEmpty() ? "*" : columns.stream().collect(Collectors.joining(", "));
        String query = String.format("SELECT %s FROM %s LIMIT %d", columnStr, tableName, limit);
        
        try (Connection conn = getConnection(connectionParams);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {
             
            ResultSetMetaData metaData = rs.getMetaData();
            int columnCount = metaData.getColumnCount();
            
            while (rs.next()) {
                List<String> row = new ArrayList<>();
                for (int i = 1; i <= columnCount; i++) {
                    row.add(rs.getString(i));
                }
                data.add(row);
            }
        }
        
        return data;
    }
    
    public IngestionResponse clickHouseToFlatFile(IngestionRequest request) throws Exception {
        String columnStr = request.getSelectedColumns().isEmpty() ? 
                "*" : 
                request.getSelectedColumns().stream().collect(Collectors.joining(", "));
        
        String query;
        
        // Check if this is a join operation
        if (request.getJoinTables() != null && !request.getJoinTables().isEmpty() && request.getJoinCondition() != null) {
            // For multi-table join (bonus requirement)
            query = buildJoinQuery(request.getTableName(), request.getJoinTables(), 
                    request.getJoinCondition(), request.getSelectedColumns());
        } else {
            // For single table
            query = String.format("SELECT %s FROM %s", columnStr, request.getTableName());
        }
        
        log.info("Executing query: {}", query);
        
        try (Connection conn = getConnection(request.getClickhouseConnection());
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {
            
            ResultSetMetaData metaData = rs.getMetaData();
            int columnCount = metaData.getColumnCount();
            
            FileWriter writer = new FileWriter(request.getFlatFileConnection().getFileName());
            
            // Write header if required
            if (request.getFlatFileConnection().isHasHeader()) {
                List<String> headers = new ArrayList<>();
                for (int i = 1; i <= columnCount; i++) {
                    headers.add(metaData.getColumnName(i));
                }
                writer.write(String.join(request.getFlatFileConnection().getDelimiter(), headers) + "\n");
            }
            
            // Write data
            long recordCount = 0;
            while (rs.next()) {
                List<String> row = new ArrayList<>();
                for (int i = 1; i <= columnCount; i++) {
                    String value = rs.getString(i);
                    // Handle null values
                    row.add(value == null ? "" : value);
                }
                writer.write(String.join(request.getFlatFileConnection().getDelimiter(), row) + "\n");
                recordCount++;
            }
            
            writer.close();
            
            return new IngestionResponse(true, recordCount, "Data exported successfully to flat file");
        }
    }
    
    private String buildJoinQuery(String mainTable, List<String> joinTables, String joinCondition, List<String> columns) {
        String columnStr = columns.isEmpty() ? "*" : String.join(", ", columns);
        StringBuilder queryBuilder = new StringBuilder("SELECT ").append(columnStr).append(" FROM ").append(mainTable);
        
        for (String joinTable : joinTables) {
            queryBuilder.append(" JOIN ").append(joinTable);
        }
        
        queryBuilder.append(" ON ").append(joinCondition);
        
        return queryBuilder.toString();
    }
    
    public IngestionResponse flatFileToClickHouse(IngestionRequest request, List<List<String>> data, TableSchema schema) throws SQLException {
        try (Connection conn = getConnection(request.getClickhouseConnection())) {
            String targetTable = request.getTargetTableName();
            
            // Create table if required
            if (request.isCreateTable()) {
                createTable(conn, targetTable, schema);
            }
            
            // Insert data in batches
            int batchSize = 1000;
            int totalRecords = 0;
            
            for (int i = 0; i < data.size(); i += batchSize) {
                int endIndex = Math.min(i + batchSize, data.size());
                List<List<String>> batch = data.subList(i, endIndex);
                
                insertBatch(conn, targetTable, schema.getColumns(), batch);
                totalRecords += batch.size();
            }
            
            return new IngestionResponse(true, totalRecords, "Data imported successfully to ClickHouse");
        }
    }
    
    private void createTable(Connection conn, String tableName, TableSchema schema) throws SQLException {
        StringBuilder createTableBuilder = new StringBuilder("CREATE TABLE IF NOT EXISTS ")
                .append(tableName)
                .append(" (");
        
        List<String> columnDefinitions = new ArrayList<>();
        for (ColumnInfo column : schema.getColumns()) {
            // Default to String if type is unknown
            String type = mapToClickHouseType(column.getType());
            columnDefinitions.add(column.getName() + " " + type);
        }
        
        createTableBuilder.append(String.join(", ", columnDefinitions))
                .append(") ENGINE = MergeTree() ORDER BY tuple()");
        
        try (Statement stmt = conn.createStatement()) {
            stmt.execute(createTableBuilder.toString());
        }
    }
    
    private String mapToClickHouseType(String type) {
        // Basic type mapping logic - expand as needed
        if (type == null || type.isEmpty()) {
            return "String";
        }
        
        type = type.toLowerCase();
        
        if (type.contains("int")) {
            return "Int64";
        } else if (type.contains("float") || type.contains("double") || type.contains("decimal")) {
            return "Float64";
        } else if (type.contains("date")) {
            return "Date";
        } else if (type.contains("datetime")) {
            return "DateTime";
        } else {
            return "String";
        }
    }
    
    private void insertBatch(Connection conn, String tableName, List<ColumnInfo> columns, List<List<String>> batch) throws SQLException {
        if (batch.isEmpty()) {
            return;
        }
        
        String columnNames = columns.stream()
                .map(ColumnInfo::getName)
                .collect(Collectors.joining(", "));
        
        StringBuilder queryBuilder = new StringBuilder("INSERT INTO ")
                .append(tableName)
                .append(" (")
                .append(columnNames)
                .append(") VALUES ");
        
        List<String> valueGroups = new ArrayList<>();
        for (List<String> row : batch) {
            if (row.size() != columns.size()) {
                log.warn("Row size does not match column count. Row size: {}, Column count: {}", row.size(), columns.size());
                continue;
            }
            
            List<String> formattedValues = new ArrayList<>();
            for (int i = 0; i < row.size(); i++) {
                String value = row.get(i);
                String type = columns.get(i).getType();
                
                // Format based on type
                if (type.toLowerCase().contains("string")) {
                    formattedValues.add("'" + value.replace("'", "''") + "'");
                } else if (value == null || value.isEmpty()) {
                    formattedValues.add("NULL");
                } else {
                    formattedValues.add(value);
                }
            }
            
            valueGroups.add("(" + String.join(", ", formattedValues) + ")");
        }
        
        queryBuilder.append(String.join(", ", valueGroups));
        
        try (Statement stmt = conn.createStatement()) {
            stmt.execute(queryBuilder.toString());
        }
    }
}