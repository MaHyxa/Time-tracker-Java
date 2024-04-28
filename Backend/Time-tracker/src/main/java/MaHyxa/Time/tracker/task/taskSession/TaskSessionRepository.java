package MaHyxa.Time.tracker.task.taskSession;

import MaHyxa.Time.tracker.task.TaskController;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TaskSessionRepository extends JpaRepository <TaskSession, Long> {

    @Query("SELECT t from TaskSession t WHERE t.task.id = :param AND t.isActive=true")
    TaskSession findByTaskIdAndIsActiveTrue(@Param("param") Long id);

}
