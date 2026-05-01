package com.supermarket.repository

import com.supermarket.model.Customer
import org.springframework.data.jpa.repository.JpaRepository
import java.util.Optional

interface CustomerRepository : JpaRepository<Customer, Long> {
    fun findByEmail(email: String): Optional<Customer>
}