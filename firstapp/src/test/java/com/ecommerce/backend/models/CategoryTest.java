package com.ecommerce.backend.models;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class CategoryTest {

    @Test
    void testCategoryGettersAndSetters() {
        Category category = new Category();
        Long id = 1L;
        String name = "Electronics";

        category.setId(id);
        category.setName(name);

        assertEquals(id, category.getId());
        assertEquals(name, category.getName());
    }
}