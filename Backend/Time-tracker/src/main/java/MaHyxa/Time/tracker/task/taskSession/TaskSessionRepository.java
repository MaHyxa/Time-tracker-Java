package MaHyxa.Time.tracker.task.taskSession;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.util.List;

public interface TaskSessionRepository extends JpaRepository <TaskSession, Long> {

    @Query("SELECT ts from TaskSession ts WHERE ts.task.id = :param AND ts.isActive=true")
    TaskSession findActiveSessionByTaskId(@Param("param") Long id);

    @Query("SELECT ts FROM TaskSession ts WHERE DATE(ts.startTime) >= :startDate AND DATE(ts.stopTime) <= :endDate AND ts.task.id = :task")
    List<TaskSession> selectSessionsByDate(@Param("startDate") Date startdate, @Param("endDate") Date endDate, @Param("task") Long id);
}
