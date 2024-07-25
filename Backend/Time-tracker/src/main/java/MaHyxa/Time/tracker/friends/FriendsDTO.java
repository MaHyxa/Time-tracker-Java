package MaHyxa.Time.tracker.friends;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FriendsDTO {

    private String friendOne;

    private String friendTwo;

    private int status;

}
