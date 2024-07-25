package MaHyxa.Time.tracker.friends;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FriendsRepository extends JpaRepository <Friends, Long> {

    @Query("SELECT f.status FROM Friends f WHERE ((f.friendOne = :friendOne AND f.friendTwo = :friendTwo) OR (f.friendOne = :friendTwo AND f.friendTwo = :friendOne))")
    Friends.Status checkFriends(@Param("friendOne") String friendOne, @Param("friendTwo") String friendTwo);

    @Query("SELECT f FROM Friends f WHERE f.friendOne = :user OR f.friendTwo = :user ORDER BY f.status ASC ")
    List<Friends> getAllFriendsByUser(@Param("user") String user);

    Friends getFriendsByFriendship(Long id);
}
