@RestController
@RequestMapping("/cart")
class CartController(private val cartRepository: CartRepository) {
    @GetMapping("/{customerId}") fun getCart(@PathVariable customerId: Long) = cartRepository.findByCustomerId(customerId)
    @PostMapping fun addToCart(@RequestBody cartItem: CartItem): CartItem = cartRepository.save(cartItem)
}