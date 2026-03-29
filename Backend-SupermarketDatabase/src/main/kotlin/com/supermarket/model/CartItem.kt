package com.supermarket.model

import jakarta.persistence.*

@Entity
@Table(name = "cart_items")
data class CartItem(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    val cart: Cart,

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    val product: Product,

    val quantity: Int
)