FROM openjdk:23 AS base
WORKDIR /application
RUN groupadd -r ocgi && useradd -r ocgi -g ocgi
USER ocgi

FROM gradle:jdk23-alpine AS build
WORKDIR /build
COPY build.gradle settings.gradle ./
RUN gradle build
COPY src ./src
RUN gradle bootJar
RUN ls ./build/libs

FROM base AS deploys
WORKDIR /application
COPY --chown=ocgi:ocgi --from=build /build/build/libs/*-SNAPSHOT.jar app.jar
USER ocgi
ENTRYPOINT ["java", "-jar", "app.jar"]