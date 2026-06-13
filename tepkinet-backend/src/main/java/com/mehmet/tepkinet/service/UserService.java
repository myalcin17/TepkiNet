package com.mehmet.tepkinet.service;

import com.mehmet.tepkinet.dto.LoginResponseDTO;
import com.mehmet.tepkinet.dto.UserDTO;
import com.mehmet.tepkinet.entity.CompanyApplicationStatus;
import com.mehmet.tepkinet.entity.User;
import com.mehmet.tepkinet.exception.BadRequestException;
import com.mehmet.tepkinet.repository.CompanyApplicationRepository;
import com.mehmet.tepkinet.repository.ComplaintRepository;
import com.mehmet.tepkinet.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final CompanyApplicationRepository applicationRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final ComplaintRepository complaintRepository;

    public UserService(UserRepository userRepository,
                       CompanyApplicationRepository applicationRepository,
                       BCryptPasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       ComplaintRepository complaintRepository) {
        this.userRepository = userRepository;
        this.applicationRepository = applicationRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.complaintRepository = complaintRepository;
    }

    public UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setComplaintCount(complaintRepository.findByUserId(user.getId()).size());
        return dto;
    }

    public UserDTO createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new BadRequestException("Bu e-posta adresi zaten kullanılıyor.");
        }
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new BadRequestException("Bu kullanıcı adı zaten kullanılıyor.");
        }

        user.setRole("USER");
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public UserDTO updateUser(Long id, User updatedUser) {
        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser == null) {
            return null;
        }

        existingUser.setUsername(updatedUser.getUsername());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        existingUser.setRole(existingUser.getRole());

        User updated = userRepository.save(existingUser);
        return convertToDTO(updated);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public List<UserDTO> getAllUserDTOs() {
        List<User> users = userRepository.findAll();
        List<UserDTO> dtoList = new ArrayList<>();
        for (User user : users) {
            dtoList.add(convertToDTO(user));
        }
        return dtoList;
    }

    public UserDTO getUserDTOById(Long id) {
        User user = userRepository.findById(id).orElse(null);
        return user != null ? convertToDTO(user) : null;
    }

    public UserDTO getUserDTOByEmail(String email) {
        User user = userRepository.findByEmail(email);
        return user != null ? convertToDTO(user) : null;
    }

    public LoginResponseDTO loginUser(String email, String password) {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            return handlePendingCompanyLogin(email, password);
        }

        boolean isMatch = passwordEncoder.matches(password, user.getPassword());
        if (!isMatch) {
            throw new BadRequestException("E-posta veya şifre hatalı.");
        }

        String token = jwtService.generateToken(user.getEmail());
        LoginResponseDTO response = new LoginResponseDTO();
        response.setToken(token);
        response.setUser(convertToDTO(user));
        return response;
    }

    private LoginResponseDTO handlePendingCompanyLogin(String email, String password) {
        var applicationOptional = applicationRepository.findByCompanyEmail(email);
        if (applicationOptional.isPresent()) {
            var application = applicationOptional.get();
            if (application.getStatus() == CompanyApplicationStatus.PENDING
                    && passwordEncoder.matches(password, application.getPasswordHash())) {
                throw new BadRequestException("Başvurunuz inceleme aşamasındadır. Yönetici onayı sonrası giriş yapabilirsiniz.");
            }
        }
        throw new BadRequestException("E-posta veya şifre hatalı.");
    }
    public void changePassword(
        String email,
        String currentPassword,
        String newPassword
) {
    User user = userRepository.findByEmail(email);

    if (user == null) {
        throw new BadRequestException("Kullanıcı bulunamadı.");
    }

    if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
        throw new BadRequestException("Mevcut şifre hatalı.");
    }

    if (currentPassword.equals(newPassword)) {
        throw new BadRequestException("Yeni şifre mevcut şifre ile aynı olamaz.");
    }

    user.setPassword(passwordEncoder.encode(newPassword));
    userRepository.save(user);
}
}
