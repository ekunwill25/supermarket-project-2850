package com.supermarket.repository

import com.supermarket.model.Inventory
import org.springframework.data.jpa.repository.JpaRepository
import java.util.Optional

interface InventoryRepository : JpaRepository<Inventory, Long> {
    fun findByProductId(productId: Long): Optional<Inventory>
}