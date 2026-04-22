package com.supermarket.model

import jakarta.persistence.*

@Entity
@Table(name = "addresses")
data class Address(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    val customer: Customer,

    val street: String,
    val city: String,
    val postcode: String,
    val country: String,

    val isDefault: Boolean = false
)