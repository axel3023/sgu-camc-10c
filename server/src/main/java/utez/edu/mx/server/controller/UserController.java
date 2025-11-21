package utez.edu.mx.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.server.modules.UserDto;

@RestController
@RequestMapping("/sgu-api/users")
@CrossOrigin("*")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("")
    public ResponseEntity<?> getUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("")
    public ResponseEntity<?> createUser(@RequestBody UserDto userDto) {
        return userService.createUser(userDto.toEntity());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable("id") Long id, @RequestBody UserDto userDto) {
        return userService.updateUser(id, userDto.toEntity());
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable("id") Long id) {
        userService.deleteUser(id);
    }
}
