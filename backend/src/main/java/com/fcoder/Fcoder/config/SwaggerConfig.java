package com.fcoder.Fcoder.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Value("${swagger-url}")
    private String swaggerUrl;

    @Value("${server.servlet.context-path}")
    private String contextPath;

    @Value("${server.port}")
    private String port;

    @Bean
    public OpenAPI openAPI() {
        List<Server> serverList = new ArrayList<>();
        var localServer = new Server();
        localServer.setUrl(
            String.format("http://localhost:%s%s", port, contextPath)
        );
        serverList.add(localServer);
        if (!"null".equals(swaggerUrl)) {
            var server = new Server();
            server.setUrl(String.format("%s%s", swaggerUrl, contextPath));
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
}
