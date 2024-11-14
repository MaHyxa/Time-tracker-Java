package MaHyxa.Time.tracker.task;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT t FROM Task t WHERE t.userId = :id ORDER BY t.id DESC")
    List<Task> findAllUserTasks(String id);

    @Query("SELECT t FROM Task t INNER JOIN TaskSession ts ON t.id = ts.task.id WHERE DATE(ts.startTime) >= :startDate AND DATE(ts.stopTime) <= :endDate AND t.userId = :user")
    List<Task> findTasksByDateRange(@Param("startDate") Date startdate, @Param("endDate") Date endDate, @Param("user") String id);

    Task findTaskByUserIdAndId(String userId, Long taskId);

    @Modifying
    @Transactional
    @Query("update Task t set t.taskStatus = 2 where t.id = :id")
    void deactivateActiveTasks(Long id);

    List<Task> findAllByTaskStatus(int taskStatus);


    //User stats
    @Query("SELECT COUNT (*) FROM Task t WHERE t.userId = :id")
    Integer findAllTasksByUser(String id);

    @Query("SELECT COUNT (*) FROM Task t WHERE t.userId = :id AND t.taskStatus = 1")
    Integer findAllActiveTasksByUser(String id);

    @Query("SELECT COUNT (*) FROM Task t WHERE t.userId = :id AND t.taskStatus = 6")
    Integer findAllCompleteTasksByUser(String id);

    @Query("SELECT MAX(t.spentTime) FROM Task t WHERE t.userId = :id")
    Long findLongestTaskByUser(String id);

    @Query("SELECT SUM(t.spentTime) FROM Task t WHERE t.userId = :id")
    Long findTasksTotalSpentTimeByUser(String id);
}
