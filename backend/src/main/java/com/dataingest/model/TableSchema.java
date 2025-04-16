package com.dataingest.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TableSchema {
    private String tableName;
    private List<ColumnInfo> columns;
}