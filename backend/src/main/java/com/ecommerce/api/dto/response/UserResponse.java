package com.ecommerce.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {

    private Long userId;

    private String userEmail;

    private String userFullName;

    private String userPhoneNumber;

    private String userRole;

    private Timestamp userCreateDate;

    private Timestamp userUpdatedDate;
}
