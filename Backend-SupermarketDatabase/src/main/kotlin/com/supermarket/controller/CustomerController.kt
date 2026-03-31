package com.supermarket.controller

import com.supermarket.model.Customer
import com.supermarket.repository.CustomerRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/customers")
class CustomerController(
    private val customerRepository: CustomerRepository
) {
    @GetMapping
    fun getAllCustomers(): List<Customer> = customerRepository.findAll()

    @GetMapping("/{id}")
    fun getCustomerById(@PathVariable id: Long): ResponseEntity<Customer> {
        val customer = customerRepository.findById(id)
        return if (customer.isPresent) {
            ResponseEntity.ok(customer.get())
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @PostMapping
    fun createCustomer(@RequestBody customer: Customer): Customer {
        return customerRepository.save(customer)
    }
}