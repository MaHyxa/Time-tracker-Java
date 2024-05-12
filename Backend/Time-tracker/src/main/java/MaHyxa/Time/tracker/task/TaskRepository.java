package MaHyxa.Time.tracker.task;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT t FROM Task t WHERE t.user.id = :id ORDER BY t.isComplete ASC, t.createdAt DESC")
    List<Task> findAllUserTasks(Integer id);

    @Query("SELECT t FROM Task t INNER JOIN TaskSession ts ON t.id = ts.task.id WHERE DATE(ts.startTime) >= :startDate AND DATE(ts.stopTime) <= :endDate AND t.user.id = :user")
    List<Task> findTasksByDateRange(@Param("startDate") Date startdate, @Param("endDate") Date endDate, @Param("user") Integer id);

    Task findTaskByUserIdAndId(Integer userId, Long taskId);

    @Modifying
    @Transactional
    @Query("update Task t set t.isActive = false where t.id = :id")
    void deactivateActiveTasks(Long id);

    List<Task> findAllByIsActiveTrue();
}
