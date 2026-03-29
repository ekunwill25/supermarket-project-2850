package com.supermarket.model

import jakarta.persistence.*

@Entity
@Table(name = "employees")
data class Employee(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    val firstName: String,
    val lastName: String,

    val role: String,

    @Column(unique = true)
    val email: String
)