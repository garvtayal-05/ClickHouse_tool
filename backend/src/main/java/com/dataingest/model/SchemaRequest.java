package com.dataingest.model;

import lombok.Data;

@Data
public class SchemaRequest {
    private ClickHouseConnection connection;
    private String tableName;
}