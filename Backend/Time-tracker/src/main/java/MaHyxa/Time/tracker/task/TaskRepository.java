package MaHyxa.Time.tracker.task;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT t FROM Task t WHERE t.userId = :id ORDER BY t.isComplete ASC, t.createdAt DESC")
    List<Task> findAllUserTasks(String id);

    @Query("SELECT t FROM Task t INNER JOIN TaskSession ts ON t.id = ts.task.id WHERE DATE(ts.startTime) >= :startDate AND DATE(ts.stopTime) <= :endDate AND t.userId = :user")
    List<Task> findTasksByDateRange(@Param("startDate") Date startdate, @Param("endDate") Date endDate, @Param("user") String id);

    Task findTaskByUserIdAndId(String userId, Long taskId);

    @Modifying
    @Transactional
    @Query("update Task t set t.isActive = false where t.id = :id")
    void deactivateActiveTasks(Long id);

    List<Task> findAllByIsActiveTrue();


    //User stats
    @Query("SELECT COUNT (*) FROM Task t WHERE t.userId = :param")
    Integer findAllTasksByUser(@Param("param") String userId);

    @Query("SELECT COUNT (*) FROM Task t WHERE t.userId = :param AND t.isActive=true")
    Integer findAllActiveTasksByUser(@Param("param") String userId);

    @Query("SELECT COUNT (*) FROM Task t WHERE t.userId = :param AND t.isComplete=true")
    Integer findAllCompleteTasksByUser(@Param("param") String userId);

    @Query("SELECT MAX(t.spentTime) FROM Task t WHERE t.userId = :param")
    Long findLongestTaskByUser(@Param("param") String userId);

    @Query("SELECT SUM(t.spentTime) FROM Task t WHERE t.userId = :param")
    Long findTasksTotalSpentTimeByUser(@Param("param") String userId);
}
