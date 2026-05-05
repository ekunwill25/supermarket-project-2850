package com.supermarket.repository

import com.supermarket.model.Address
import org.springframework.data.jpa.repository.JpaRepository

interface AddressRepository : JpaRepository<Address, Long> {
    fun findByCustomerId(customerId: Long): List<Address>
}