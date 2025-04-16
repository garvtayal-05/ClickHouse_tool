package com.dataingest.model;

import lombok.Data;

@Data
public class ClickHouseConnection {
    private String host;
    private int port;
    private String database;
    private String user;
    private String jwtToken;
}