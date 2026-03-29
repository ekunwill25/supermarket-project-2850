package com.supermarket.model

import jakarta.persistence.*

@Entity
@Table(name = "order_items")
data class OrderItem(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    val order: Order,

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    val product: Product,

    val quantity: Int,
    val unitPrice: Double
)