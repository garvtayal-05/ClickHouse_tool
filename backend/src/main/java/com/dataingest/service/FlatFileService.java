package com.dataingest.service;

import com.dataingest.model.ColumnInfo;
import com.dataingest.model.FlatFileConnection;
import com.dataingest.model.TableSchema;
import com.opencsv.CSVParser;
import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvValidationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service
@Slf4j
public class FlatFileService {

    private static final Pattern DATE_PATTERN = Pattern.compile("\\d{4}-\\d{2}-\\d{2}");
    private static final String COLUMN_PREFIX = "column_";
    private static final String DEFAULT_TYPE = "String";
    private static final int PREVIEW_LIMIT = 100;

    public TableSchema getFileSchema(FlatFileConnection connection) throws IOException, CsvValidationException {
        char delimiter = getValidatedDelimiter(connection.getDelimiter());
        
        try (CSVReader reader = createCsvReader(connection.getFileName(), delimiter)) {
            List<ColumnInfo> columns = new ArrayList<>();
            String[] headers = connection.isHasHeader() ? reader.readNext() : null;
            
            if (headers != null) {
                for (String header : headers) {
                    columns.add(new ColumnInfo(header, DEFAULT_TYPE));
                }
            } else {
                String[] firstRow = reader.readNext();
                if (firstRow != null) {
                    for (int i = 0; i < firstRow.length; i++) {
                        columns.add(new ColumnInfo(COLUMN_PREFIX + (i + 1), DEFAULT_TYPE));
                    }
                }
            }
            
            return createTableSchema(connection.getFileName(), columns);
        }
    }
    
    public List<List<String>> readFileData(FlatFileConnection connection, List<String> selectedColumns) 
            throws IOException, CsvValidationException {
        char delimiter = getValidatedDelimiter(connection.getDelimiter());
        
        try (CSVReader reader = createCsvReader(connection.getFileName(), delimiter)) {
            List<Integer> selectedIndices = getSelectedIndices(connection, reader, selectedColumns);
            return processFileData(reader, selectedIndices);
        }
    }
    
    public List<List<String>> previewData(FlatFileConnection connection, int limit) 
            throws IOException, CsvValidationException {
        char delimiter = getValidatedDelimiter(connection.getDelimiter());
        
        try (CSVReader reader = createCsvReader(connection.getFileName(), delimiter)) {
            List<List<String>> data = new ArrayList<>();
            
            if (connection.isHasHeader()) {
                String[] header = reader.readNext();
                if (header != null) {
                    data.add(List.of(header));
                }
            }
            
            String[] line;
            while ((line = reader.readNext()) != null && data.size() < limit) {
                data.add(List.of(line));
            }
            
            return data;
        }
    }
    
    public TableSchema inferSchema(FlatFileConnection connection) throws IOException {
        try {
            List<List<String>> sampleData = previewData(connection, PREVIEW_LIMIT);
            if (sampleData.isEmpty()) {
                return createTableSchema(connection.getFileName(), new ArrayList<>());
            }
            
            List<ColumnInfo> columns = createInitialColumns(connection, sampleData.get(0));
            if (connection.isHasHeader()) {
                sampleData.remove(0);
            }
            
            inferColumnTypes(columns, sampleData);
            return createTableSchema(connection.getFileName(), columns);
        } catch (CsvValidationException e) {
            throw new IOException("Failed to validate CSV data", e);
        }
    }

    // Helper methods
    private char getValidatedDelimiter(String delimiter) {
        if (!StringUtils.hasText(delimiter)) {
            throw new IllegalArgumentException("Delimiter cannot be empty");
        }
        return delimiter.charAt(0);
    }

private CSVReader createCsvReader(String fileName, char delimiter) throws IOException {
    CSVParser parser = new CSVParserBuilder().withSeparator(delimiter).build();
    return new CSVReaderBuilder(new FileReader(fileName))  // Fixed: removed extra )
            .withCSVParser(parser)
            .build();
}

    private List<Integer> getSelectedIndices(FlatFileConnection connection, CSVReader reader, 
                                           List<String> selectedColumns) throws IOException, CsvValidationException {
        List<Integer> indices = new ArrayList<>();
        if (selectedColumns == null || selectedColumns.isEmpty()) {
            return indices;
        }

        String[] headers = connection.isHasHeader() ? reader.readNext() : null;
        
        if (headers != null) {
            for (String column : selectedColumns) {
                for (int i = 0; i < headers.length; i++) {
                    if (headers[i].equals(column)) {
                        indices.add(i);
                        break;
                    }
                }
            }
        } else {
            for (String column : selectedColumns) {
                if (column.startsWith(COLUMN_PREFIX)) {
                    try {
                        int index = Integer.parseInt(column.substring(COLUMN_PREFIX.length())) - 1;
                        indices.add(index);
                    } catch (NumberFormatException e) {
                        log.warn("Invalid column index: {}", column);
                    }
                }
            }
        }
        
        return indices;
    }

    private List<List<String>> processFileData(CSVReader reader, List<Integer> selectedIndices) 
            throws IOException, CsvValidationException {
        List<List<String>> data = new ArrayList<>();
        String[] line;
        
        while ((line = reader.readNext()) != null) {
            List<String> row = new ArrayList<>();
            
            if (selectedIndices.isEmpty()) {
                for (String value : line) {
                    row.add(value);
                }
            } else {
                for (int index : selectedIndices) {
                    row.add(index < line.length ? line[index] : "");
                }
            }
            
            data.add(row);
        }
        
        return data;
    }

    private List<ColumnInfo> createInitialColumns(FlatFileConnection connection, List<String> firstRow) {
        List<ColumnInfo> columns = new ArrayList<>();
        int columnCount = firstRow.size();
        
        if (connection.isHasHeader()) {
            for (String header : firstRow) {
                columns.add(new ColumnInfo(header, ""));
            }
        } else {
            for (int i = 0; i < columnCount; i++) {
                columns.add(new ColumnInfo(COLUMN_PREFIX + (i + 1), ""));
            }
        }
        
        return columns;
    }

    private void inferColumnTypes(List<ColumnInfo> columns, List<List<String>> sampleData) {
        for (int i = 0; i < columns.size(); i++) {
            ColumnInfo column = columns.get(i);
            column.setType(determineColumnType(sampleData, i));
        }
    }

    private String determineColumnType(List<List<String>> sampleData, int columnIndex) {
        boolean couldBeInteger = true;
        boolean couldBeFloat = true;
        boolean couldBeDate = true;
        
        for (List<String> row : sampleData) {
            if (columnIndex >= row.size()) continue;
            
            String value = row.get(columnIndex).trim();
            if (!StringUtils.hasText(value)) continue;
            
            if (couldBeInteger && !isInteger(value)) {
                couldBeInteger = false;
            }
            
            if (couldBeFloat && !isFloat(value)) {
                couldBeFloat = false;
            }
            
            if (couldBeDate && !isDate(value)) {
                couldBeDate = false;
            }
            
            if (!couldBeInteger && !couldBeFloat && !couldBeDate) {
                break;
            }
        }
        
        if (couldBeInteger) return "Int32";
        if (couldBeFloat) return "Float64";
        if (couldBeDate) return "Date";
        return DEFAULT_TYPE;
    }

    private boolean isInteger(String value) {
        try {
            Integer.parseInt(value);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    private boolean isFloat(String value) {
        try {
            Double.parseDouble(value);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    private boolean isDate(String value) {
        return DATE_PATTERN.matcher(value).matches();
    }

    private TableSchema createTableSchema(String fileName, List<ColumnInfo> columns) {
        Path path = Paths.get(fileName);
        return new TableSchema(path.getFileName().toString(), columns);
    }
}