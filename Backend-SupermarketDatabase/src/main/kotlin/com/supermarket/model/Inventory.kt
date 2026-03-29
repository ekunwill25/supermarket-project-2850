package com.supermarket.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "inventory")
data class Inventory(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @OneToOne
    @JoinColumn(name = "product_id", unique = true, nullable = false)
    val product: Product,

    var quantityInStock: Int,
    val reorderLevel: Int,

    var lastUpdated: LocalDateTime = LocalDateTime.now()
)