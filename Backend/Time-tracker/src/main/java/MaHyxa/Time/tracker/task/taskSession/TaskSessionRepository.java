package MaHyxa.Time.tracker.task.taskSession;

import MaHyxa.Time.tracker.task.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.util.List;

public interface TaskSessionRepository extends JpaRepository <TaskSession, Long> {

    @Query("SELECT t from TaskSession t WHERE t.task.id = :param AND t.isActive=true")
    TaskSession findByTaskIdAndIsActiveTrue(@Param("param") Long id);

    @Query("SELECT ts FROM TaskSession ts WHERE DATE(ts.startTime) >= :startDate AND DATE(ts.stopTime) <= :endDate AND ts.task.id = :task")
    List<TaskSession> selectSessionsByDate(@Param("startDate") Date startdate, @Param("endDate") Date endDate, @Param("task") Long id);
}
