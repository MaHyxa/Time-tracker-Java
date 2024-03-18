package MaHyxa.Time.tracker.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    private String surname;

    @NotBlank
    private String nickname;

    @NotBlank
    private String password;

    @OneToMany
    @JoinColumn
    private List<Task> user_tasks;

}
