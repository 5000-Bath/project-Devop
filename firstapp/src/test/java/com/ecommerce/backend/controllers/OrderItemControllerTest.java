package com.ecommerce.backend.controllers;

import com.ecommerce.backend.models.OrderItem;
import com.ecommerce.backend.repositories.OrderItemRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = OrderItemController.class, excludeAutoConfiguration = SecurityAutoConfiguration.class)
public class OrderItemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrderItemRepository orderItemRepository;

    @Test
    void getAllOrderItems_shouldReturnListOfOrderItems() throws Exception {
        OrderItem item1 = new OrderItem();
        item1.setId(1L);
        OrderItem item2 = new OrderItem();
        item2.setId(2L);

        when(orderItemRepository.findAll()).thenReturn(List.of(item1, item2));

        mockMvc.perform(get("/api/order-items"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[1].id", is(2)));
    }
}
