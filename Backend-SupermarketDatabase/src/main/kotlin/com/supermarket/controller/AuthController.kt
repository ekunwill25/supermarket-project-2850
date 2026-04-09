@RestController
@RequestMapping("/auth")
class AuthController(private val customerRepository: CustomerRepository) {
    @PostMapping("/login")
    fun login(@RequestBody body: Map<String, String>): ResponseEntity<Customer> {
        val customer = customerRepository.findByEmail(body["email"]!!)
        return if (customer != null && customer.password == body["password"])
            ResponseEntity.ok(customer)
        else ResponseEntity.status(401).build()
    }
}