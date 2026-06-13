package com.mehmet.tepkinet.controller;

import com.mehmet.tepkinet.dto.UserDTO;
import com.mehmet.tepkinet.entity.User;
import com.mehmet.tepkinet.service.UserService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {

        this.userService = userService;
    }

    @GetMapping
    public List<UserDTO> getAllUsers() {

        return userService.getAllUserDTOs();
    }
    @GetMapping("/{id}")
    public UserDTO getUserById(@PathVariable Long id) {

        return userService.getUserDTOById(id);
    }

    @PutMapping("/{id}")
    public UserDTO updateUser(@PathVariable Long id,
                           @RequestBody User updatedUser) {

        return userService.updateUser(id, updatedUser);
    
    }

    @DeleteMapping("/{id}")
        public void deleteUser(@PathVariable Long id){ 
        userService.deleteUser(id); 
    }

}

