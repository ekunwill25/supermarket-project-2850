package com.supermarket.model

import jakarta.persistence.*

@Entity
@Table(name = "products")
data class Product(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    val category: Category,

    @ManyToOne
    @JoinColumn(name = "supplier_id", nullable = false)
    val supplier: Supplier,

    val name: String,
    val description: String?,

    @Column(nullable = false)
    val price: Double,

    val imageUrl: String?,
    val isActive: Boolean = true

    val onSale: Boolean = false,
    val originalPrice: Double? = null,   /* the "was" price shown on sale cards */
    val isFeatured: Boolean = false,
    val isTrending: Boolean = false,
    val rating: Double = 0.0,
    val reviewCount: Int = 0,
)