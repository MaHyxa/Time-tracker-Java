package MaHyxa.Time.tracker.repository;

import MaHyxa.Time.tracker.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
}
