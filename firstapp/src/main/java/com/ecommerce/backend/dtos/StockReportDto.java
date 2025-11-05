package com.ecommerce.backend.dtos;

import java.math.BigDecimal;

public class StockReportDto {
    private Long productId;
    private String productName;
    private int startingStock;
    private int endingStock;
    private int unitsSold;

    public StockReportDto(Long productId, String productName, int startingStock, int endingStock, int unitsSold) {
        this.productId = productId;
        this.productName = productName;
        this.startingStock = startingStock;
        this.endingStock = endingStock;
        this.unitsSold = unitsSold;
    }

    // Getters and setters
    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public int getStartingStock() {
        return startingStock;
    }

    public void setStartingStock(int startingStock) {
        this.startingStock = startingStock;
    }

    public int getEndingStock() {
        return endingStock;
    }

    public void setEndingStock(int endingStock) {
        this.endingStock = endingStock;
    }

    public int getUnitsSold() {
        return unitsSold;
    }

    public void setUnitsSold(int unitsSold) {
        this.unitsSold = unitsSold;
    }
}
