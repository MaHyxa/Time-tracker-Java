package MaHyxa.Time.tracker.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

  @Query("SELECT COUNT (*) FROM Task t WHERE t.user.email = :param")
  int findAllTasksByUser(@Param("param") String email);

  @Query("SELECT COUNT (*) FROM Task t WHERE t.user.email = :param AND t.isActive=true")
  int findAllActiveTasksByUser(@Param("param") String email);


  Optional<User> findByEmail(String email);



}
