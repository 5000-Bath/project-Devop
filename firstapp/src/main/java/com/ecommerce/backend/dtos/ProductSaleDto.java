package com.ecommerce.backend.dtos;

public class ProductSaleDto {
    private Long productId;
    private Long unitsSold;

    public ProductSaleDto(Long productId, Long unitsSold) {
        this.productId = productId;
        this.unitsSold = unitsSold;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Long getUnitsSold() {
        return unitsSold;
    }

    public void setUnitsSold(Long unitsSold) {
        this.unitsSold = unitsSold;
    }
}
