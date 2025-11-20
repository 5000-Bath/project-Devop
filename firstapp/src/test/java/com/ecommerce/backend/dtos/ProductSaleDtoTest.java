package com.ecommerce.backend.dtos;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class ProductSaleDtoTest {

    @Test
    public void testConstructorAndGetters() {
        Long productId = 1L;
        Long unitsSold = 10L;
        ProductSaleDto productSaleDto = new ProductSaleDto(productId, unitsSold);

        assertEquals(productId, productSaleDto.getProductId());
        assertEquals(unitsSold, productSaleDto.getUnitsSold());
    }

    @Test
    public void testSetters() {
        ProductSaleDto productSaleDto = new ProductSaleDto(null, null);
        Long productId = 2L;
        Long unitsSold = 20L;

        productSaleDto.setProductId(productId);
        productSaleDto.setUnitsSold(unitsSold);

        assertEquals(productId, productSaleDto.getProductId());
        assertEquals(unitsSold, productSaleDto.getUnitsSold());
    }
}
