package MaHyxa.Time.tracker.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class KeycloakService {

    private final JdbcTemplate keycloakJdbcTemplate;

    public KeycloakService(@Qualifier("keycloakJdbcTemplate") JdbcTemplate keycloakJdbcTemplate) {
        this.keycloakJdbcTemplate = keycloakJdbcTemplate;
    }

    public String getUserEmailById(String id) {
        String sql = "SELECT EMAIL FROM USER_ENTITY WHERE ID = ?";
        try {
            return keycloakJdbcTemplate.queryForObject(sql, String.class, id);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public String getUserEmail(String email) {
        String sql = "SELECT EMAIL FROM USER_ENTITY WHERE EMAIL = ?";
        try {
            return keycloakJdbcTemplate.queryForObject(sql, String.class, email);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public String getUserIdByEmail(String email) {
        String sql = "SELECT ID FROM USER_ENTITY WHERE EMAIL = ?";
        try {
            return keycloakJdbcTemplate.queryForObject(sql, String.class, email);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }
}
