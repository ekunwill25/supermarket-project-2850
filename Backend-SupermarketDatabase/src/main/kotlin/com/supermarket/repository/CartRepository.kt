package com.supermarket.repository

import com.supermarket.model.Cart
import org.springframework.data.jpa.repository.JpaRepository

interface CartRepository : JpaRepository<Cart, Long> {
    fun findByCustomerId(customerId: Long): Cart?
}