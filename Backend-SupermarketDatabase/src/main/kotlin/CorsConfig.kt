package com.supermarket

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

/* allows the frontend (running on a different port) to call the backend api
   without this, the browser blocks all fetch() calls with a CORS error */
@Configuration
class CorsConfig : WebMvcConfigurer {
    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/**")          /* applies to all endpoints */
            .allowedOrigins("*")            /* allows any frontend origin */
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
    }
}