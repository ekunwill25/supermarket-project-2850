package com.supermarket.controller

import com.supermarket.model.Product
import com.supermarket.repository.ProductRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/products")
class ProductController(
    private val productRepository: ProductRepository
) {
    @GetMapping
    fun getAllProducts(): List<Product> = productRepository.findAll()

    @GetMapping("/{id}")
    fun getProductById(@PathVariable id: Long): ResponseEntity<Product> {
        val product = productRepository.findById(id)
        return if (product.isPresent) {
            ResponseEntity.ok(product.get())
        } else {
            ResponseEntity.notFound().build()
        }
    }
}