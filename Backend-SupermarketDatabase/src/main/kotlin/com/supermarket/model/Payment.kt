package com.supermarket.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "payments")
data class Payment(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @OneToOne
    @JoinColumn(name = "order_id", nullable = false)
    val order: Order,

    val method: String,
    val status: String,
    val amount: Double,

    val paymentDate: LocalDateTime = LocalDateTime.now()
)