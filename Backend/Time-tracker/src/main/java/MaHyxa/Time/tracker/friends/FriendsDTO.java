package MaHyxa.Time.tracker.friends;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FriendsDTO implements Serializable {

    private String friend;

    private int status;

}
