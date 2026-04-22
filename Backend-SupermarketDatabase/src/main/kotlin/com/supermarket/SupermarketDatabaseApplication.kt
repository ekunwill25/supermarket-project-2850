package com.supermarket

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class SupermarketDatabaseApplication

fun main(args: Array<String>) {
    runApplication<SupermarketDatabaseApplication>(*args)
}