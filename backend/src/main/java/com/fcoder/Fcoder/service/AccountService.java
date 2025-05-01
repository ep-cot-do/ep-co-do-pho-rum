package com.fcoder.Fcoder.service;

import com.fcoder.Fcoder.model.dto.request.*;
import com.fcoder.Fcoder.model.dto.response.AuthResponse;
import com.fcoder.Fcoder.model.dto.response.MemberAccountRegisterResponse;
import com.fcoder.Fcoder.model.dto.response.ProfileResponse;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;
import java.util.List;

public interface AccountService {
    PaginationWrapper<List<ProfileResponse>> getAllMemberPagination(QueryWrapper queryWrapper);
    MemberAccountRegisterResponse registerMemberAccountFull(MemberAccountDetailRegisterRequest MemberAccountDetailRegisterRequest);
    MemberAccountRegisterResponse getAccountById(Long id);
    boolean checkUsernameExist(String username);
    MemberAccountRegisterResponse registerMemberAccount(AccountRegisterRequest MemberAccountDetailRegisterRequest);

    void disableAccountById(Long id);
    void enableAccountById(Long id);
    ProfileResponse updateMemberAccount(Long id, ProfileRequest profileRequest);
    AuthResponse authenticate(LoginRequest loginRequest);

    void changePassword(ChangePasswordRequest changePasswordRequest);

    void resetPassword(String email);

    List<String> getUserCurrentRole();

    ProfileResponse getProfile();
    ProfileResponse getMemberByStudentCode(String studentCode);
    List<ProfileResponse> getUsersWithBirthdayToday();
}