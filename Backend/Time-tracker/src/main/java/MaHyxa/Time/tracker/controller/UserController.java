package MaHyxa.Time.tracker.controller;

import MaHyxa.Time.tracker.model.User;
import MaHyxa.Time.tracker.service.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin
public class UserController {

    private final IUserService userService;


    @PostMapping("/new")
    public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
        if(userService.getUserByNickname(user.getNickname()).isPresent())
        {
            return ResponseEntity.status(HttpStatus.FOUND).body(user);
        }
        else {
            User newUser = userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
        }

    }

    @GetMapping("/{nickname}")
    public ResponseEntity<String> getUserByNickname(@PathVariable String nickname) {
        Optional<User> user = userService.getUserByNickname(nickname);
        if(user.isPresent())
        {
            return ResponseEntity.ok(user.get().getNickname());
        }
        else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User already exist");
        }
    }


}
