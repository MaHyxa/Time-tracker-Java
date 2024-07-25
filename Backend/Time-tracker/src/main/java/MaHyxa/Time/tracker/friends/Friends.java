package MaHyxa.Time.tracker.friends;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Friends {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long friendship;

    @JoinColumn(name = "friend_one", nullable = false)
    private String friendOne;

    @JoinColumn(name = "friend_two", nullable = false)
    private String friendTwo;

    @Column(name = "status", columnDefinition = "TINYINT DEFAULT 0")
    @Enumerated(EnumType.ORDINAL)
    private Status status;

    public enum Status {
        ZERO,
        ONE,
        TWO
    }

}
