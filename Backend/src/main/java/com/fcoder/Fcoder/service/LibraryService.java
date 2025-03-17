package com.fcoder.Fcoder.service;

import com.fcoder.Fcoder.model.dto.request.LibraryRequest;
import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.response.LibraryResponse;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;

import java.util.List;

public interface LibraryService {
    PaginationWrapper<List<LibraryResponse>> getAllLibraries(QueryWrapper queryWrapper);
    LibraryResponse createLibrary(LibraryRequest libraryRequest);
    LibraryResponse getLibraryById(Long id);
    LibraryResponse updateLibrary(Long id , LibraryRequest libraryRequest);
    void deleteLibrary(Long id);
    void hideLibrary(Long id, Long requestUserId);
    void showLibrary(Long id);

    List<LibraryResponse> filterLibraries(Integer semester, String major, String subjectCode, String type, String status, Long authorId);
}
