package com.supermarket.controller

import com.supermarket.model.Category
import com.supermarket.repository.CategoryRepository
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/categories")
class CategoryController(
    private val categoryRepository: CategoryRepository
) {
    @GetMapping
    fun getAllCategories(): List<Category> = categoryRepository.findAll()
}