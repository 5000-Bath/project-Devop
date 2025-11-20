package com.ecommerce.backend.dtos;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class StockReportDtoTest {

    @Test
    public void testConstructorAndGetters() {
        Long productId = 1L;
        String productName = "Test Product";
        int startingStock = 100;
        int endingStock = 50;
        int unitsSold = 50;

        StockReportDto stockReportDto = new StockReportDto(productId, productName, startingStock, endingStock, unitsSold);

        assertEquals(productId, stockReportDto.getProductId());
        assertEquals(productName, stockReportDto.getProductName());
        assertEquals(startingStock, stockReportDto.getStartingStock());
        assertEquals(endingStock, stockReportDto.getEndingStock());
        assertEquals(unitsSold, stockReportDto.getUnitsSold());
    }

    @Test
    public void testSetters() {
        StockReportDto stockReportDto = new StockReportDto(null, null, 0, 0, 0);
        Long productId = 2L;
        String productName = "Another Product";
        int startingStock = 200;
        int endingStock = 100;
        int unitsSold = 100;

        stockReportDto.setProductId(productId);
        stockReportDto.setProductName(productName);
        stockReportDto.setStartingStock(startingStock);
        stockReportDto.setEndingStock(endingStock);
        stockReportDto.setUnitsSold(unitsSold);

        assertEquals(productId, stockReportDto.getProductId());
        assertEquals(productName, stockReportDto.getProductName());
        assertEquals(startingStock, stockReportDto.getStartingStock());
        assertEquals(endingStock, stockReportDto.getEndingStock());
        assertEquals(unitsSold, stockReportDto.getUnitsSold());
    }
}
