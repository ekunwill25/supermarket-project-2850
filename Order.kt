package com.supermarket.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "orders")
data class Order(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    val customer: Customer,

    @ManyToOne
    @JoinColumn(name = "address_id", nullable = false)
    val address: Address,

    @ManyToOne
    @JoinColumn(name = "employee_id")
    val employee: Employee?,

    val status: String,
    val totalAmount: Double,

    val orderDate: LocalDateTime = LocalDateTime.now()
)