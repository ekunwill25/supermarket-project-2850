package com.supermarket.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "cart")
data class Cart(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @OneToOne
    @JoinColumn(name = "customer_id", unique = true, nullable = false)
    val customer: Customer,

    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)