package com.fcoder.Fcoder.model.dto.response;

import lombok.Data;

@Data
public class UserSubmissionStatsResponse {
    private Integer acceptedSubmissions;
    private Integer solvedProblems;

    public UserSubmissionStatsResponse(Integer acceptedSubmissions, Integer solvedProblems) {
        this.acceptedSubmissions = acceptedSubmissions;
        this.solvedProblems = solvedProblems;
    }
}
