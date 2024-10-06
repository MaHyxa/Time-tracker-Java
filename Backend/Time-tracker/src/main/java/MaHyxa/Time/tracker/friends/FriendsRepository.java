package MaHyxa.Time.tracker.friends;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FriendsRepository extends JpaRepository <Friends, Long> {

    @Query("SELECT f.status FROM Friends f WHERE ((f.user = :user AND f.requestedBy = :requestedBy) OR (f.user = :requestedBy AND f.requestedBy = :user))")
    RelationshipStatus checkFriends(@Param("user") String user, @Param("requestedBy") String requestedBy);

    @Query("SELECT f FROM Friends f WHERE f.user = :user OR f.requestedBy = :user ORDER BY f.status ASC ")
    List<Friends> getAllFriendsByUser(@Param("user") String user);

}
