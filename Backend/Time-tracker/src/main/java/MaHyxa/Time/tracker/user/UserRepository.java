package MaHyxa.Time.tracker.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

  @Query("SELECT COUNT (*) FROM Task t WHERE t.user.email = :param")
  Integer findAllTasksByUser(@Param("param") String email);

  @Query("SELECT COUNT (*) FROM Task t WHERE t.user.email = :param AND t.isActive=true")
  Integer findAllActiveTasksByUser(@Param("param") String email);

  @Query("SELECT COUNT (*) FROM Task t WHERE t.user.email = :param AND t.isComplete=true")
  Integer findAllCompleteTasksByUser(@Param("param") String email);

  @Query("SELECT MAX(t.spentTime) FROM Task t WHERE t.user.email = :param")
  Long findLongestTaskByUser(@Param("param") String email);

  @Query("SELECT SUM(t.spentTime) FROM Task t WHERE t.user.email = :param")
  Long findTasksTotalSpentTimeByUser(@Param("param") String email);


  Optional<User> findByEmail(String email);



}
