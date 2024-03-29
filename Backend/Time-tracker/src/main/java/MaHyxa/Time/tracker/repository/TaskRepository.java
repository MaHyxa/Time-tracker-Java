package MaHyxa.Time.tracker.repository;

import MaHyxa.Time.tracker.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT t.id FROM Task t WHERE t.isActive=true")
    Optional<List<Long>> findActiveTasks();

    @Query("SELECT t FROM Task t WHERE t.user = :param ")
    Optional<List<Task>> findAllUserTasks(@Param("param") Long id);
}
