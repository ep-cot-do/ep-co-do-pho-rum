package com.fcoder.Fcoder.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import java.util.ArrayList;
import java.util.List;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Value("${swagger-url:}")
    private String swaggerUrl;

    @Value("${server.servlet.context-path}")
    private String contextPath;

    @Value("${server.port}")
    private String port;

    @Bean
    public OpenAPI openAPI() {
        List<Server> serverList = new ArrayList<>();

        // Local server
        var localServer = new Server();
        localServer.setUrl("http://localhost:" + port);
        localServer.setDescription("Local Development Server");
        serverList.add(localServer);

        // Production server if available
        if (
            swaggerUrl != null &&
            !swaggerUrl.isEmpty() &&
            !"null".equals(swaggerUrl)
        ) {
            var server = new Server();
            // Use the base URL without context path
            String baseUrl = swaggerUrl.replace("/api/v1", "");
            server.setUrl(baseUrl);
            server.setDescription("Production API Server");
            serverList.add(server);
        }

        Info info = new Info()
            .title("Fcoder API")
            .version("1.0")
            .description("Fcoder API Documentation");

        var openAPI = new OpenAPI()
            .info(info)
            .components(
                new Components()
                    .addSecuritySchemes(
                        "accessCookie",
                        new SecurityScheme()
                            .type(SecurityScheme.Type.APIKEY)
                            .in(SecurityScheme.In.COOKIE)
                            .name("ACCESS_TOKEN")
                    )
            );

        openAPI.servers(serverList);
        return openAPI;
    }

    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
            .group("public-api")
            .pathsToMatch("/**")
            .build();
    }
}
