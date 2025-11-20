package com.ecommerce.backend.dtos;

import com.ecommerce.backend.models.OrderStatus;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class UpdateStatusRequestTest {

    @Test
    public void testGettersAndSetters() {
        UpdateStatusRequest updateStatusRequest = new UpdateStatusRequest();
        OrderStatus status = OrderStatus.SUCCESS;

        updateStatusRequest.setStatus(status);

        assertEquals(status, updateStatusRequest.getStatus());
    }
}
