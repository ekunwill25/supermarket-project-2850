package com.supermarket.model

import jakarta.persistence.*

@Entity
@Table(name = "suppliers")
data class Supplier(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    val name: String,
    val contactEmail: String?,
    val phone: String?
)