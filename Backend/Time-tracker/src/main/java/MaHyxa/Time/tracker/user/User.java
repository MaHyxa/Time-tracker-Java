package MaHyxa.Time.tracker.user;


import MaHyxa.Time.tracker.task.Task;
import MaHyxa.Time.tracker.auth.token.Token;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User implements UserDetails {

  @Id
  @GeneratedValue
  private Integer id;

  @Column(nullable = false)
  @NotNull(message = "Full name cannot be null")
  private String fullName;

  @Column(unique = true, nullable = false)
  @Email(message = "Invalid email format")
  @NotNull(message = "Email cannot be null")
  private String email;


  @Size(min = 6, message = "Password must be at least 6 characters long")
  @Column(nullable = false)
  @NotNull(message = "Password cannot be null")
  private String password;

  @Enumerated(EnumType.STRING)
  private Role role;

  @OneToMany(mappedBy = "user", orphanRemoval = true)
  @ToString.Exclude
  private List<Token> tokens;

  @OneToMany(mappedBy = "user", orphanRemoval = true)
  @ToString.Exclude
  private List<Task> tasks;

  public User(String testfullname, String testemail, String testpassword) {
    this.fullName = testfullname;
    this.email = testemail;
    this.password = testpassword;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return role.getAuthorities();
  }

  @Override
  public String getPassword() {
    return password;
  }

  @Override
  public String getUsername() {
    return email;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }
}
