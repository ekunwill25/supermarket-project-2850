package com.supermarket.controller

import com.supermarket.model.Customer
import com.supermarket.repository.CustomerRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = ["*"])
class AuthController(val customerRepository: CustomerRepository) {

    @PostMapping("/register")
    fun register(@RequestBody body: Map<String, String>): ResponseEntity<Any> {
        val email = body["email"] ?: return ResponseEntity.badRequest().body("Email required")
        if (customerRepository.findByEmail(email).isPresent)
            return ResponseEntity.badRequest().body("Email already registered")
        val customer = Customer(
            firstName = body["firstName"] ?: "",
            lastName  = body["lastName"]  ?: "",
            email     = email,
            password  = body["password"]  ?: ""
        )
        return ResponseEntity.ok(customerRepository.save(customer))
    }

    @PostMapping("/login")
    fun login(@RequestBody body: Map<String, String>): ResponseEntity<Any> {
        val email    = body["email"]    ?: return ResponseEntity.badRequest().body("Email required")
        val password = body["password"] ?: return ResponseEntity.badRequest().body("Password required")
        val customer = customerRepository.findByEmail(email).orElse(null)
            ?: return ResponseEntity.status(401).body("Invalid credentials")
        if (customer.password != password)
            return ResponseEntity.status(401).body("Invalid credentials")
        return ResponseEntity.ok(customer)
    }
}