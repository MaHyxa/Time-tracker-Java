# Build stage
FROM maven:3.9.2 AS build
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM amazoncorretto:17
ARG PROFILE=default
ARG APP_VERSION=1.0.1

WORKDIR /app
COPY --from=build /build/target/time-tracker-*.jar /app/

EXPOSE 9192

ENV DB_URL=jdbc:mysql://mysql:3306/time_tracker
ENV ACTIVE_PROFILE=${PROFILE}
ENV JAR_VERSION=${APP_VERSION}

CMD java -jar -Dspring.profiles.active=${ACTIVE_PROFILE} -Dspring.datasource.url=${DB_URL}  time-tracker-${JAR_VERSION}.jar