package com.supermarket.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "customers")
data class Customer(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    val firstName: String,
    val lastName: String,

    @Column(unique = true, nullable = false)
    val email: String,

    val phone: String?,

    val createdAt: LocalDateTime = LocalDateTime.now()
)