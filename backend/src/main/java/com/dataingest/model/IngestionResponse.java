package com.dataingest.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IngestionResponse {
    private boolean success;
    private long recordCount;
    private String message;
}