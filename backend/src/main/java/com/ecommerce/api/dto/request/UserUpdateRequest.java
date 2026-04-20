package com.ecommerce.api.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequest {

    private String userEmail;

    private String userPassword;

    private String userFullName;

    private String userPhoneNumber;

    private String userRole;
}
