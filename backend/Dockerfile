FROM openjdk:21 AS base
WORKDIR /application
RUN groupadd -r fcoder && useradd -r fcoder -g fcoder
USER fcoder

FROM gradle:jdk21-alpine AS build
WORKDIR /build
COPY build.gradle settings.gradle ./
COPY gradle ./gradle
COPY gradlew ./
RUN chmod +x ./gradlew
COPY src ./src
RUN ./gradlew bootJar --no-daemon

FROM base AS deploys
WORKDIR /application
COPY --chown=fcoder:fcoder --from=build /build/build/libs/*-SNAPSHOT.jar app.jar
USER fcoder
# Environment variables are passed from Docker Compose
ENTRYPOINT ["java", "-jar", "app.jar"]
