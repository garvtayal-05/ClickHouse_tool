package com.dataingest.model;

import lombok.Data;

@Data
public class FlatFileConnection {
    private String fileName;
    private String delimiter;
    private boolean hasHeader;
}