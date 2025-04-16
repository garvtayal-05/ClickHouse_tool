package com.dataingest.model;

import lombok.Data;
import java.util.List;

@Data
public class IngestionRequest {
    private String source; // "clickhouse" or "flatfile"
    private String target; // "clickhouse" or "flatfile"
    private ClickHouseConnection clickhouseConnection;
    private FlatFileConnection flatFileConnection;
    private String tableName;
    private String targetTableName;
    private List<String> selectedColumns;
    private boolean createTable; // For flat file to clickhouse
    private String joinCondition; // For bonus requirement
    private List<String> joinTables; // For bonus requirement
}