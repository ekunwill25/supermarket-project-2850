package com.supermarket.controller

import com.supermarket.model.Inventory
import com.supermarket.repository.InventoryRepository
import com.supermarket.repository.ProductRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime

data class InventoryResponse(
    val id: Long,
    val productId: Long,
    val productName: String,
    val quantityInStock: Int,
    val reorderLevel: Int,
    val status: String,     // "critical", "low", "ok"
    val lastUpdated: LocalDateTime
)

data class UpdateStockRequest(
    val quantityInStock: Int
)

@CrossOrigin(
    originPatterns = ["https://*.app.github.dev"],
    allowedHeaders = ["*"],
    methods = [
        org.springframework.web.bind.annotation.RequestMethod.GET,
        org.springframework.web.bind.annotation.RequestMethod.POST,
        org.springframework.web.bind.annotation.RequestMethod.PUT,
        org.springframework.web.bind.annotation.RequestMethod.PATCH,
        org.springframework.web.bind.annotation.RequestMethod.DELETE,
        org.springframework.web.bind.annotation.RequestMethod.OPTIONS
    ]
)
@RestController
@RequestMapping("/inventory")
class InventoryController(
    private val inventoryRepository: InventoryRepository,
    private val productRepository: ProductRepository
) {

    /* ── GET /inventory — all inventory entries ── */
    @GetMapping
    fun getAllInventory(): List<InventoryResponse> =
        inventoryRepository.findAll().map { toResponse(it) }

    /* ── GET /inventory/{productId} — stock for a specific product ── */
    @GetMapping("/{productId}")
    fun getInventoryByProduct(@PathVariable productId: Long): ResponseEntity<InventoryResponse> {
        val inv = inventoryRepository.findByProductId(productId)
        return if (inv.isPresent) ResponseEntity.ok(toResponse(inv.get()))
               else ResponseEntity.notFound().build()
    }

    /* ── PATCH /inventory/{productId} — update stock level ── */
    @PatchMapping("/{productId}")
    fun updateStock(
        @PathVariable productId: Long,
        @RequestBody request: UpdateStockRequest
    ): ResponseEntity<InventoryResponse> {
        val inv = inventoryRepository.findByProductId(productId)
        if (!inv.isPresent) return ResponseEntity.notFound().build()

        val updated = inv.get().copy(
            quantityInStock = request.quantityInStock,
            lastUpdated     = LocalDateTime.now()
        )
        inventoryRepository.save(updated)
        return ResponseEntity.ok(toResponse(updated))
    }


    /* ── POST /inventory/seed — initialise stock for all products ──
       Call once to create inventory rows for every product.
       Safe to call multiple times — skips products that already have stock. */
    @PostMapping("/seed")
    fun seedInventory(): ResponseEntity<Map<String, Any>> {
        val allProducts = productRepository.findAll()
        var created = 0
        var skipped = 0

        allProducts.forEach { product ->
            val existing = inventoryRepository.findByProductId(product.id)
            if (!existing.isPresent) {
                inventoryRepository.save(
                    Inventory(
                        product         = product,
                        quantityInStock = 100,
                        reorderLevel    = 20,
                        lastUpdated     = LocalDateTime.now()
                    )
                )
                created++
            } else {
                skipped++
            }
        }

        return ResponseEntity.ok(mapOf(
            "created" to created,
            "skipped" to skipped,
            "message" to "Seeded $created products with 100 units each. $skipped already had inventory."
        ))
    }

    /* ── Helper ── */
    private fun toResponse(inv: Inventory): InventoryResponse {
        val pct    = if (inv.reorderLevel > 0) inv.quantityInStock.toDouble() / inv.reorderLevel else 1.0
        val status = when {
            inv.quantityInStock == 0          -> "out"
            inv.quantityInStock <= inv.reorderLevel * 0.2 -> "critical"
            inv.quantityInStock <= inv.reorderLevel       -> "low"
            else                              -> "ok"
        }
        return InventoryResponse(
            id              = inv.id,
            productId       = inv.product.id,
            productName     = inv.product.name,
            quantityInStock = inv.quantityInStock,
            reorderLevel    = inv.reorderLevel,
            status          = status,
            lastUpdated     = inv.lastUpdated
        )
    }
}
