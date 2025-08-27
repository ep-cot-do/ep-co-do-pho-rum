package com.fcoder.Fcoder.service.impl;

import com.fcoder.Fcoder.model.dto.request.*;
import com.fcoder.Fcoder.model.dto.response.AuthResponse;
import com.fcoder.Fcoder.model.dto.response.MemberAccountRegisterResponse;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;
import com.fcoder.Fcoder.model.dto.response.ProfileResponse;
import com.fcoder.Fcoder.model.entity.AccountEntity;
import com.fcoder.Fcoder.model.entity.RoleEntity;
import com.fcoder.Fcoder.model.exception.ActionFailedException;
import com.fcoder.Fcoder.model.exception.ValidationException;
import com.fcoder.Fcoder.repository.AccountRepository;
import com.fcoder.Fcoder.repository.RoleRepository;
import com.fcoder.Fcoder.service.AccountService;
import com.fcoder.Fcoder.util.AuthUtils;
import com.fcoder.Fcoder.util.RandomUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.authentication.AuthenticationManager;
import com.fcoder.Fcoder.util.JwtTokenProvider;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.mail.javamail.JavaMailSender;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {
    private final AccountRepository accountRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthUtils authUtils;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final JavaMailSender mailSender;

    @Override
    public PaginationWrapper<List<ProfileResponse>> getAllMemberPagination(QueryWrapper queryWrapper) {
        return accountRepository.query(queryWrapper,
                accountRepository::queryAnySpecification,
                (items) -> {
                    var list = items.map(this::wrapAccountResponse).stream().toList();
                    return new PaginationWrapper.Builder<List<ProfileResponse>>()
                            .setPaginationInfo(items)
                            .setData(list)
                            .build();
                });
    }

    @Override
    @Transactional(rollbackFor = {ActionFailedException.class}, isolation = Isolation.REPEATABLE_READ)
    public MemberAccountRegisterResponse registerMemberAccountFull(MemberAccountDetailRegisterRequest request) {
        validatePassword(request.getPassword(), request.getRePassword());

        if (accountRepository.existsByUsername(request.getUsername())) {
            throw new ValidationException("Username is already taken");
        }

        if (accountRepository.existsByEmail(request.getEmail())) {
            throw new ValidationException("Email is already taken");
        }

        var account = buildAccountEntity(request);
        return saveAccountRegisterAndBuildResponse(account);
    }

    @Override
    public boolean checkUsernameExist(String username) {
        return accountRepository.findByUsername(username).isPresent();
    }

    @Transactional(rollbackFor = {ActionFailedException.class}, isolation = Isolation.REPEATABLE_READ)
    @Override
    public MemberAccountRegisterResponse registerMemberAccount(AccountRegisterRequest request) {
        validatePassword(request.getPassword(), request.getRePassword());

        if (accountRepository.existsByUsername(request.getUsername())) {
            throw new ValidationException("Username is already taken");
        }

        if (accountRepository.existsByEmail(request.getEmail())) {
            throw new ValidationException("Email is already taken");
        }

        var account = AccountEntity.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .major(request.getMajor())
                .studentCode(request.getStudentCode())
                .fundStatus(false)
                .role(roleRepository.findByRoleName("ROLE_MEMBER")
                        .orElseThrow(() -> new ValidationException("Default member role not found")))
                .lastLogin(LocalDateTime.now())
                .isActive(true)
                .build();

        return saveAccountRegisterAndBuildResponse(account);
    }



    private void validatePassword(String password, String rePassword) {
        if (password == null || rePassword == null) {
            throw new ValidationException("Password and re-password cannot be null");
        }
        if (!password.equals(rePassword)) {
            throw new ValidationException("Password and re-password do not match");
        }
    }

    private AccountEntity buildAccountEntity(MemberAccountDetailRegisterRequest request) {
        RoleEntity role;


        if (request.getRoleId() != null) {
            role = roleRepository.findById(request.getRoleId())
                    .orElseThrow(() -> new ValidationException("Role not found with ID: " + request.getRoleId()));
        } else {
            // Fallback to default MEMBER role
            role = roleRepository.findByRoleName("MEMBER")
                    .orElseThrow(() -> new ValidationException("Default member role not found"));
        }

        return AccountEntity.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .role(role)  // Sử dụng role từ request thay vì cứng MEMBER
                .fullName(request.getFullName())
                .gender(request.getGender())
                .phone(request.getPhone())
                .github(request.getGithub())
                .studentCode(request.getStudentCode())
                .major(request.getMajor())
                .currentTerm(request.getCurrentTerm())
                .fundStatus(request.getFundStatus())
                .birthday(request.getBirthday())
                .profileImg(request.getProfileImg())
                .lastLogin(LocalDateTime.now())
                .isActive(true)
                .build();
    }

    private MemberAccountRegisterResponse saveAccountRegisterAndBuildResponse(AccountEntity account) {
        try {
            var savedAccount = accountRepository.save(account);
            return MemberAccountRegisterResponse.builder()
                    .id(savedAccount.getId())
                    .username(savedAccount.getUsername())
                    .role(savedAccount.getRole().getRoleName())
                    .email(savedAccount.getEmail())
                    .fullName(savedAccount.getFullName())
                    .gender(savedAccount.getGender())
                    .phone(savedAccount.getPhone())
                    .github(savedAccount.getGithub())
                    .studentCode(savedAccount.getStudentCode())
                    .birthday(savedAccount.getBirthday())
                    .major(savedAccount.getMajor())
                    .currentTerm(savedAccount.getCurrentTerm())
                    .fundStatus(savedAccount.getFundStatus())
                    .createdDate(savedAccount.getCreatedDate())
                    .updatedDate(savedAccount.getUpdatedDate())
                    .profileImg(savedAccount.getProfileImg())
                    .lastLogin(savedAccount.getLastLogin())
                    .isActive(savedAccount.getIsActive())
                    .build();
        } catch (DataIntegrityViolationException ex) {
            throw new ValidationException("Account data violates constraints", ex);
        } catch (Exception ex) {
            throw new ActionFailedException("Failed to create account", ex);
        }
    }

    @Override
    public MemberAccountRegisterResponse getAccountById(Long id) {
        var account = accountRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Account not found"));

        return MemberAccountRegisterResponse.builder()
                .id(account.getId())
                .username(account.getUsername())
                .email(account.getEmail())
                .fullName(account.getFullName())
                .role(account.getRole().getRoleName())
                .gender(account.getGender())
                .phone(account.getPhone())
                .github(account.getGithub())
                .studentCode(account.getStudentCode())
                .major(account.getMajor())
                .currentTerm(account.getCurrentTerm())
                .fundStatus(account.getFundStatus())
                .profileImg(account.getProfileImg())
                .createdDate(account.getCreatedDate())
                .updatedDate(account.getUpdatedDate())
                .lastLogin(account.getLastLogin())
                .isActive(account.getIsActive())
                .build();
    }


    @Transactional(rollbackFor = {ActionFailedException.class}, isolation = Isolation.REPEATABLE_READ)
    @Override
    public void disableAccountById(Long id) {
        var account = accountRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Account not found"));

        if (!account.getIsActive()) {
            throw new ValidationException("Account is already disabled");
        }

        account.setIsActive(false);
        account.setUpdatedDate(LocalDateTime.now());

        try {
            accountRepository.save(account);
        } catch (Exception ex) {
            throw new ActionFailedException("Failed to disable account", ex);
        }
    }

    @Transactional(rollbackFor = {ActionFailedException.class}, isolation = Isolation.REPEATABLE_READ)
    @Override
    public void enableAccountById(Long id) {
        var account = accountRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Account not found"));

        if (account.getIsActive()) {  // Sửa logic check
            throw new ValidationException("Account is already enabled");
        }

        account.setIsActive(true);
        account.setUpdatedDate(LocalDateTime.now());

        try {
            accountRepository.save(account);
        } catch (Exception ex) {
            throw new ActionFailedException("Failed to enable account", ex);  // Sửa message
        }
    }

    @Override
    public AuthResponse authenticate(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String accessToken = jwtTokenProvider.generateAccessToken(userDetails);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

        String role = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse(null);

        AccountEntity account = accountRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ValidationException("Account not found"));

        account.setLastLogin(LocalDateTime.now());
        accountRepository.save(account);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .role(role)
                .build();
    }

    @Transactional(rollbackFor = {ActionFailedException.class}, isolation = Isolation.REPEATABLE_READ)
    @Override
    public ProfileResponse updateMemberAccount(Long id, ProfileRequest request) {
        var account = accountRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Account not found"));

        account.setEmail(request.getEmail());
        account.setFullName(request.getFullName());
        account.setGender(request.getGender());
        account.setPhone(request.getPhone());
        account.setGithub(request.getGithub());
        account.setStudentCode(request.getStudentCode());
        account.setMajor(request.getMajor());
        account.setCurrentTerm(request.getCurrentTerm());
        account.setBirthday(request.getBirthday());
        account.setProfileImg(request.getProfileImg());
        account.setLastLogin(LocalDateTime.now());
        account.setUpdatedDate(LocalDateTime.now());

        try {
            var updatedAccount = accountRepository.save(account);
            return ProfileResponse.builder()
                    .email(updatedAccount.getEmail())
                    .github(updatedAccount.getGithub())
                    .studentCode(updatedAccount.getStudentCode())
                    .fullName(updatedAccount.getFullName())
                    .gender(updatedAccount.getGender())
                    .phone(updatedAccount.getPhone())
                    .major(updatedAccount.getMajor())
                    .birthday(updatedAccount.getBirthday())
                    .profileImg(updatedAccount.getProfileImg())
                    .lastLogin(updatedAccount.getLastLogin())
                    .currentTerm(updatedAccount.getCurrentTerm())
                    .build();
        } catch (Exception ex) {
            throw new ActionFailedException("Failed to update account", ex);
        }
    }


    @Transactional
    public void resetPassword(String email) {
        AccountEntity account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new ValidationException("No account found with this email"));

        String randomPassword = RandomUtils.generateSecurePassword(12L);
        account.setPassword(passwordEncoder.encode(randomPassword));
        accountRepository.save(account);

        sendPasswordResetEmail(account, randomPassword);
    }

    @Override
    public List<String> getUserCurrentRole() {
        var account = authUtils.getUserFromAuthentication();
        return AuthUtils.convertUserToRole(account);
    }

    @Override
    public ProfileResponse getProfile() {
        var account = authUtils.getUserFromAuthentication();

        return buildProfileResponse(account);
    }

    @Override
    public ProfileResponse getMemberByStudentCode(String studentCode) {
        var account = accountRepository.findByStudentCode(studentCode)
                .orElseThrow(() -> new ValidationException("Account not found with student code: " + studentCode));

        return buildProfileResponse(account);
    }

    @Transactional
    public void changePassword(ChangePasswordRequest changePasswordRequest) {
        AccountEntity account = accountRepository.findByUsername(changePasswordRequest.getUsername())
                .orElseThrow(() -> new ValidationException("No account found with this username"));

        if (!passwordEncoder.matches(changePasswordRequest.getOldPassword(), account.getPassword())) {
            throw new ValidationException("Old password is incorrect");
        }

        validateNewPassword(changePasswordRequest.getNewPassword(), changePasswordRequest.getReNewPassword());

        account.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
        accountRepository.save(account);
    }

    private void sendPasswordResetEmail(AccountEntity account, String resetInfo) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(account.getEmail());
        mailMessage.setSubject("Password Reset Request");
        mailMessage.setText("Your password reset token is: " + resetInfo +
                "\nThis token will expire in 15 minutes.");

        mailSender.send(mailMessage);
    }

    private void validateNewPassword(String password, String rePassword) {
        if (password == null || rePassword == null) {
            throw new ValidationException("Passwords cannot be null");
        }
        if (!password.equals(rePassword)) {
            throw new ValidationException("Passwords do not match");
        }
        if (password.length() < 8) {
            throw new ValidationException("Password must be at least 8 characters");
        }
    }

    @Override
    public List<ProfileResponse> getUsersWithBirthdayToday() {
        LocalDate today = LocalDate.now();
        int todayMonth = today.getMonthValue();
        int todayDay = today.getDayOfMonth();

        List<AccountEntity> accounts = accountRepository.findAll();

        return accounts.stream()
                .filter(account -> {
                    LocalDate birthday = account.getBirthday();
                    return birthday != null &&
                            birthday.getMonthValue() == todayMonth &&
                            birthday.getDayOfMonth() == todayDay;
                })
                .map(this::buildProfileResponse)
                .collect(Collectors.toList());
    }

    private ProfileResponse wrapAccountResponse(AccountEntity account) {
        return buildProfileResponse(account);
    }

    private ProfileResponse buildProfileResponse(AccountEntity account) {
        return ProfileResponse.builder()
                .id(account.getId())
                .email(account.getEmail())
                .fullName(account.getFullName())
                .role(account.getRole().getRoleName())
                .birthday(account.getBirthday())
                .github(account.getGithub())
                .studentCode(account.getStudentCode())
                .major(account.getMajor())
                .currentTerm(account.getCurrentTerm())
                .fundStatus(account.getFundStatus())
                .profileImg(account.getProfileImg())
                .createdDate(account.getCreatedDate())
                .updatedDate(account.getUpdatedDate())
                .lastLogin(account.getLastLogin())
                .isActive(account.getIsActive())
                .build();
    }
}