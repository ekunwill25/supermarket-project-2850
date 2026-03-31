package com.supermarket.controller

import com.supermarket.model.Inventory
import com.supermarket.repository.InventoryRepository
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/inventory")
class InventoryController(
    private val inventoryRepository: InventoryRepository
) {
    @GetMapping
    fun getAllInventory(): List<Inventory> = inventoryRepository.findAll()
}