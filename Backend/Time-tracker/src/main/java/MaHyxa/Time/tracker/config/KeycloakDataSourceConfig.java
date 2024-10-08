package MaHyxa.Time.tracker.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;

@Configuration
public class KeycloakDataSourceConfig {
    @Value("${spring.keycloak.datasource.url}")
    private String url;

    @Value("${spring.keycloak.datasource.username}")
    private String username;

    @Value("${spring.keycloak.datasource.password}")
    private String password;

    @Bean
    public DataSource keycloakDataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        dataSource.setUrl(url);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        return dataSource;
    }

    @Bean(name = "keycloakJdbcTemplate")
    public JdbcTemplate keycloakJdbcTemplate(@Qualifier("keycloakDataSource") DataSource keycloakDataSource) {
        return new JdbcTemplate(keycloakDataSource);
    }
}
