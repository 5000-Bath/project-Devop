package com.ecommerce.backend.dtos;
import com.ecommerce.backend.models.OrderStatus;

public class UpdateStatusRequest {
    private OrderStatus status;
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
}
