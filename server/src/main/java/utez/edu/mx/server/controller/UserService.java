package utez.edu.mx.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.server.config.CustomResponse;
import utez.edu.mx.server.modules.User;
import utez.edu.mx.server.modules.UserRepository;

import java.util.Optional;
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomResponse customResponse;

    @Transactional(rollbackFor = Exception.class)
    public ResponseEntity<?> getAllUsers() {
        return customResponse.getJSONResponse(userRepository.findAll());
    }

    @Transactional(rollbackFor = Exception.class)
    public ResponseEntity<?> createUser(User user) {
        User savedUser = userRepository.save(user);
        return customResponse.getJSONResponse(savedUser);
    }

    @Transactional(rollbackFor = Exception.class)
    public ResponseEntity<?> updateUser(Long id, User user) {
        Optional<User> foundUser = userRepository.findById(id);
        if (foundUser.isEmpty()) {
            return customResponse.getBadRequest("Usuario no encontrado"); // User not found
        }
        User existingUser = foundUser.get();
        existingUser.setName(user.getName());
        existingUser.setCorreo(user.getCorreo());
        existingUser.setTel(user.getTel());
        User updatedUser = userRepository.save(existingUser);
        return customResponse.getJSONResponse(updatedUser);
    }

    @Transactional(rollbackFor = Exception.class)
    public ResponseEntity<?> deleteUser(Long id) {
        Optional<User> foundUser = userRepository.findById(id);
        if (foundUser.isEmpty()) {
            return customResponse.getBadRequest("Usuario no encontrado"); // User not found
        }
        userRepository.deleteById(id);
        return customResponse.getOkResponse("Usuario eliminado exitosamente");
    }
}
