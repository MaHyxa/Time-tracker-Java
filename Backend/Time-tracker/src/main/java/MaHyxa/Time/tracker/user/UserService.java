package MaHyxa.Time.tracker.user;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;

@Service
@RequiredArgsConstructor
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository repository;
    public void changePassword(ChangePasswordRequest request, Principal connectedUser) {

        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        // check if the current password is correct
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalStateException("Wrong password");
        }
        // check if the two new passwords are the same
        if (!request.getNewPassword().equals(request.getConfirmationPassword())) {
            throw new IllegalStateException("Password are not the same");
        }

        // update the password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        // save the new password
        repository.save(user);
    }

    public UserResponse getUser(Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        return UserResponse.builder()
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .build();
    }


    public UserResponse changeUserDetails(JsonNode requestBody, Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        user.setFirstname(requestBody.get("firstname").asText());
        user.setLastname(requestBody.get("lastname").asText());
        user.setEmail(requestBody.get("email").asText());
        repository.save(user);
        return UserResponse.builder()
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .build();
    }

    public void deleteUser(String password, Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        //require confirmation before deletion via entering current password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalStateException("Wrong password");
        }
        else{
            repository.deleteById(user.getId());
        }
    }

    public StatisticResponse getStatistic(Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        return StatisticResponse.builder()
                .totalUserTasks(repository.findAllTasksByUser(user.getEmail()))
                .activeUserTasks(repository.findAllActiveTasksByUser(user.getEmail()))
                .completeUserTasks(repository.findAllCompleteTasksByUser(user.getEmail()))
                .longestTask(repository.findLongestTaskByUser(user.getEmail()))
                .totalTimeSpent(repository.findTasksTotalSpentTimeByUser(user.getEmail()))
                .build();
    }
}
