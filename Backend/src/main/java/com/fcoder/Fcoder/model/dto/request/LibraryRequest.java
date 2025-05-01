package com.fcoder.Fcoder.model.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class LibraryRequest {
    @NotNull(message = "Author id shouldn't be empty")
    private Long authorId;
    @NotNull(message = "Semester shouldn't be empty")
    private int semester;
    @NotNull(message = "Major shouldn't be empty")
    private String major;
    @NotNull(message = "Description shouldn't be empty")
    private String description;
    @NotNull(message = "Type shouldn't be empty")
    private String type;
    @NotNull(message = "Subject code shouldn't be empty")
    @Size(min = 3, max = 10, message = "Subject code must be between 3 and 10 characters")
    private String subjectCode;
    @NotNull(message = "Url shouldn't be empty")
    private String url;
    @NotNull(message = "Thumbnail shouldn't be empty")
    private String thumbnail;
    @NotNull(message = "Status shouldn't be empty")
    private String status;
}
