FROM openjdk:23 AS base
WORKDIR /application
RUN groupadd -r fcoder && useradd -r fcoder -g fcoder
USER fcoder

FROM gradle:jdk23-alpine AS build
WORKDIR /build
COPY build.gradle settings.gradle ./
RUN gradle build
COPY src ./src
RUN gradle bootJar
RUN ls ./build/libs

FROM base AS deploys
WORKDIR /application
COPY --chown=fcoder:fcoder --from=build /build/build/libs/*-SNAPSHOT.jar app.jar
USER fcoder
ENTRYPOINT ["java", "-jar", "app.jar"]