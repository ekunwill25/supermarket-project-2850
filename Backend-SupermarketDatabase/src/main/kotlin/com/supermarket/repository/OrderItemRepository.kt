package com.supermarket.repository

import com.supermarket.model.OrderItem
import org.springframework.data.jpa.repository.JpaRepository

interface OrderItemRepository : JpaRepository<OrderItem, Long> {
    fun findByOrderId(orderId: Long): List<OrderItem>
}