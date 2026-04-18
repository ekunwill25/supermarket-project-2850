@RestController
@RequestMapping("/orders")
class OrderController(private val orderRepository: OrderRepository) {
    @GetMapping fun getAllOrders(): List<Order> = orderRepository.findAll()
    @GetMapping("/{id}") fun getOrderById(@PathVariable id: Long) = orderRepository.findById(id)
    @PostMapping fun createOrder(@RequestBody order: Order): Order = orderRepository.save(order)
}