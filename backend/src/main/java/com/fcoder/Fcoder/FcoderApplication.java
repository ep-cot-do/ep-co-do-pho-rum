package com.fcoder.Fcoder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FcoderApplication {
    public static void main(String[] args) {
        // No Dotenv loading needed - Spring will use environment variables directly
        SpringApplication.run(FcoderApplication.class, args);
    }
}
