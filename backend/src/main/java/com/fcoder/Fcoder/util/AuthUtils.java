package com.fcoder.Fcoder.util;

import com.fcoder.Fcoder.model.entity.AccountEntity;
import com.fcoder.Fcoder.model.entity.RoleEntity;
import com.fcoder.Fcoder.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AuthUtils {
    private final AccountRepository accountRepository;

    public AccountEntity getUserFromAuthentication() {
        try {
            var auth = SecurityContextHolder.getContext().getAuthentication();
            if(auth == null) throw new AuthenticationException("This user isn't authentication, please login again") {
            };
            String username = auth.getName();
            return accountRepository.findByUsername(username).orElseThrow();
        } catch (Exception ex) {
            throw new AuthenticationException("This user isn't authentication, please login again") {
            };
        }
    }

    public static Collection<GrantedAuthority> convertRoleToAuthority(AccountEntity account) {
        if (account.getRole() == null || account.getRole().getRoleName() == null) {
            return List.of();
        }
        String roleName = account.getRole().getRoleName().toUpperCase();
        // Always prefix with ROLE_ if not already present
        roleName = roleName.startsWith("ROLE_") ? roleName : "ROLE_" + roleName;
        return List.of(new SimpleGrantedAuthority(roleName));
    }

    public static List<String> convertUserToRole(AccountEntity account) {
        return convertRoleToAuthority(account)
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
    }
}