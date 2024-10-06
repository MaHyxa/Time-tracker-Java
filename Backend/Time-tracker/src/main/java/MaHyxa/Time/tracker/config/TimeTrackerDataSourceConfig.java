package MaHyxa.Time.tracker.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;

import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.Objects;
import java.util.Properties;

@Configuration
@EnableJpaRepositories(basePackages = "MaHyxa.Time.tracker",
        entityManagerFactoryRef = "entityManagerFactory",
        transactionManagerRef = "mainTransactionManager"
)
@EnableTransactionManagement
public class TimeTrackerDataSourceConfig {

    @Value("${spring.time_tracker.datasource.url}")
    private String url;

    @Value("${spring.time_tracker.datasource.username}")
    private String username;

    @Value("${spring.time_tracker.datasource.password}")
    private String password;

    @Value("${spring.jpa.hibernate.ddl-auto}")
    private String hbm2ddlAuto;

    @Value("${spring.jpa.generate-ddl}")
    private boolean generateDdl;

    @Value("${spring.jpa.hibernate.naming.physical-strategy}")
    private String physicalNamingStrategy;

    @Value("${spring.jpa.hibernate.naming.implicit-strategy}")
    private String implicitNamingStrategy;

    @Bean
    @Primary
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(EntityManagerFactoryBuilder builder, DataSource dataSource) {

        LocalContainerEntityManagerFactoryBean em = builder
                .dataSource(dataSource)
                .packages("MaHyxa.Time.tracker")
                .build();

        Properties properties = new Properties();
        properties.setProperty("hibernate.hbm2ddl.auto", hbm2ddlAuto);
        properties.setProperty("hibernate.physical_naming_strategy", physicalNamingStrategy);
        properties.setProperty("hibernate.implicit_naming_strategy", implicitNamingStrategy);
        properties.setProperty("spring.jpa.generate-ddl", String.valueOf(generateDdl));

        em.setJpaProperties(properties);

        return em;
    }

    @Bean
    @Primary
    public DataSource timeTrackerDataSource() {
        return DataSourceBuilder.create()
                .url(url)
                .username(username)
                .password(password)
                .driverClassName("com.mysql.cj.jdbc.Driver")
                .build();
    }

    @Bean(name = "mainTransactionManager")
    @Primary
    public PlatformTransactionManager mainTransactionManager(
            @Qualifier("entityManagerFactory") LocalContainerEntityManagerFactoryBean entityManagerFactoryBean) {
        return new JpaTransactionManager(Objects.requireNonNull(entityManagerFactoryBean.getObject()));
    }

}
