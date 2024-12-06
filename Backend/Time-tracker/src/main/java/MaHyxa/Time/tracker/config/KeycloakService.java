package MaHyxa.Time.tracker.config;

public interface KeycloakService {

    String getUserEmailById(String id);

    String getUserEmail(String email);

    String getUserIdByEmail(String email);
}
