package MaHyxa.Time.tracker.repository;

import MaHyxa.Time.tracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
