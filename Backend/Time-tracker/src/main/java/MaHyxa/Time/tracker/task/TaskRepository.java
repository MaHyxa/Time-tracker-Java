package MaHyxa.Time.tracker.task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT t.id FROM Task t WHERE t.isActive=true")
    Optional<List<Long>> findActiveTasks();

    @Query("SELECT t FROM Task t WHERE t.user.id = :param ORDER BY t.isComplete ASC, t.createdAt DESC")
    List<Task> findAllUserTasks(@Param("param") Integer id);

    @Query("SELECT t FROM Task t INNER JOIN TaskSession ts ON t.id = ts.task.id WHERE DATE(ts.startTime) >= :startDate AND DATE(ts.stopTime) <= :endDate AND t.user.id = :user")
    List<Task> findTasksByDateRange(@Param("startDate") Date startdate, @Param("endDate") Date endDate, @Param("user") Integer id);

    Task findTaskByUserIdAndId(Integer userId, Long taskId);
}
