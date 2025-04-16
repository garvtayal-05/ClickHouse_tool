package com.dataingest.model;

import lombok.Data;
import java.util.List;

@Data
public class PreviewRequest {
    private ClickHouseConnection connection;
    private String tableName;
    private List<String> columns;
}