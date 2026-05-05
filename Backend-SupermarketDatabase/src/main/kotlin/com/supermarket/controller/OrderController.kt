package com.supermarket.controller

import com.supermarket.model.Order
import com.supermarket.model.OrderItem
import com.supermarket.repository.OrderRepository
import com.supermarket.repository.OrderItemRepository
import com.supermarket.repository.CustomerRepository
import com.supermarket.repository.ProductRepository
import com.supermarket.repository.AddressRepository
import com.supermarket.repository.InventoryRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime

/* ── DTOs ── */

data class OrderItemRequest(
    val productId: Long,
    val quantity: Int
)

data class PlaceOrderRequest(
    val customerId: Long,
    val addressId: Long,
    val items: List<OrderItemRequest>
)

data class OrderItemResponse(
    val id: Long,
    val productId: Long,
    val productName: String,
    val quantity: Int,
    val unitPrice: Double,
    val lineTotal: Double
)

data class OrderResponse(
    val id: Long,
    val customerId: Long,
    val customerName: String,
    val addressId: Long,
    val status: String,
    val totalAmount: Double,
    val orderDate: LocalDateTime,
    val items: List<OrderItemResponse>
)

data class UpdateStatusRequest(
    val status: String
)

/* ── Controller ── */

@CrossOrigin(
    originPatterns = ["https://*.app.github.dev"],
    allowedHeaders = ["*"],
    methods = [
        org.springframework.web.bind.annotation.RequestMethod.GET,
        org.springframework.web.bind.annotation.RequestMethod.POST,
        org.springframework.web.bind.annotation.RequestMethod.PUT,
        org.springframework.web.bind.annotation.RequestMethod.DELETE,
        org.springframework.web.bind.annotation.RequestMethod.OPTIONS
    ]
)
@RestController
@RequestMapping("/orders")
class OrderController(
    private val orderRepository: OrderRepository,
    private val orderItemRepository: OrderItemRepository,
    private val customerRepository: CustomerRepository,
    private val productRepository: ProductRepository,
    private val addressRepository: AddressRepository,
    private val inventoryRepository: InventoryRepository
) {

    /* ── GET /orders ── */
    @GetMapping
    fun getAllOrders(): List<OrderResponse> =
        orderRepository.findAll().map { order ->
            toResponse(order, orderItemRepository.findByOrderId(order.id))
        }

    /* ── GET /orders/{id} ── */
    @GetMapping("/{id}")
    fun getOrderById(@PathVariable id: Long): ResponseEntity<OrderResponse> {
        val order = orderRepository.findById(id)
        if (!order.isPresent) return ResponseEntity.notFound().build()
        return ResponseEntity.ok(toResponse(order.get(), orderItemRepository.findByOrderId(id)))
    }

    /* ── GET /orders/customer/{customerId} ── */
    @GetMapping("/customer/{customerId}")
    fun getOrdersByCustomer(@PathVariable customerId: Long): ResponseEntity<List<OrderResponse>> {
        val customer = customerRepository.findById(customerId)
        if (!customer.isPresent) return ResponseEntity.notFound().build()
        val orders = orderRepository.findAll().filter { it.customer.id == customerId }
        return ResponseEntity.ok(orders.map { toResponse(it, orderItemRepository.findByOrderId(it.id)) })
    }

    /* ── POST /orders — place order and deduct stock ── */
    @PostMapping
    fun placeOrder(@RequestBody request: PlaceOrderRequest): ResponseEntity<OrderResponse> {
        val customer = customerRepository.findById(request.customerId)
        if (!customer.isPresent) return ResponseEntity.badRequest().build()

        val address = addressRepository.findById(request.addressId)
        if (!address.isPresent) return ResponseEntity.badRequest().build()

        if (request.items.isEmpty()) return ResponseEntity.badRequest().build()

        // Resolve products and calculate total
        var total = 0.0
        data class Resolved(val req: OrderItemRequest, val price: Double, val product: com.supermarket.model.Product)
        val resolvedItems = mutableListOf<Resolved>()

        for (itemReq in request.items) {
            val product = productRepository.findById(itemReq.productId)
            if (!product.isPresent) return ResponseEntity.badRequest().build()
            total += product.get().price * itemReq.quantity
            resolvedItems.add(Resolved(itemReq, product.get().price, product.get()))
        }

        // Save order
        val order = orderRepository.save(
            Order(
                customer    = customer.get(),
                address     = address.get(),
                employee    = null,
                status      = "processing",
                totalAmount = total,
                orderDate   = LocalDateTime.now()
            )
        )

        // Save order items + deduct inventory
        val savedItems = resolvedItems.map { r ->
            val orderItem = orderItemRepository.save(
                OrderItem(order = order, product = r.product, quantity = r.req.quantity, unitPrice = r.price)
            )
            // Deduct stock if inventory entry exists
            inventoryRepository.findByProductId(r.product.id).ifPresent { inv ->
                inventoryRepository.save(
                    inv.copy(
                        quantityInStock = maxOf(0, inv.quantityInStock - r.req.quantity),
                        lastUpdated     = LocalDateTime.now()
                    )
                )
            }
            orderItem
        }

        return ResponseEntity.ok(toResponse(order, savedItems))
    }

    /* ── PUT /orders/{id}/status ── */
    @PutMapping("/{id}/status")
    fun updateOrderStatus(
        @PathVariable id: Long,
        @RequestBody request: UpdateStatusRequest
    ): ResponseEntity<OrderResponse> {
        val existing = orderRepository.findById(id)
        if (!existing.isPresent) return ResponseEntity.notFound().build()
        val updated = orderRepository.save(existing.get().copy(status = request.status))
        return ResponseEntity.ok(toResponse(updated, orderItemRepository.findByOrderId(id)))
    }

    /* ── Helper ── */
    private fun toResponse(order: Order, items: List<OrderItem>) = OrderResponse(
        id           = order.id,
        customerId   = order.customer.id,
        customerName = "${order.customer.firstName} ${order.customer.lastName}",
        addressId    = order.address.id,
        status       = order.status,
        totalAmount  = order.totalAmount,
        orderDate    = order.orderDate,
        items        = items.map {
            OrderItemResponse(
                id          = it.id,
                productId   = it.product.id,
                productName = it.product.name,
                quantity    = it.quantity,
                unitPrice   = it.unitPrice,
                lineTotal   = it.unitPrice * it.quantity
            )
        }
    )
}