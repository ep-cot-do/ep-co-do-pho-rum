package com.fcoder.Fcoder.service.impl;

import com.fcoder.Fcoder.model.dto.request.LibraryRequest;
import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.response.LibraryResponse;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;
import com.fcoder.Fcoder.model.entity.AccountEntity;
import com.fcoder.Fcoder.model.entity.LibraryEntity;
import com.fcoder.Fcoder.model.exception.ActionFailedException;
import com.fcoder.Fcoder.model.exception.ValidationException;
import com.fcoder.Fcoder.repository.AccountRepository;
import com.fcoder.Fcoder.repository.LibraryRepository;
import com.fcoder.Fcoder.service.LibraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LibraryServiceImpl implements LibraryService {
    private final AccountRepository accountRepository;
    private final LibraryRepository libraryRepository;

    @Override
    public PaginationWrapper<List<LibraryResponse>> getAllLibraries(QueryWrapper queryWrapper) {
        return libraryRepository.query(queryWrapper,
                libraryRepository::queryAnySpecification,
                (items) -> {
                    var list = items.map(this::wrapLibraryResponse).stream().toList();
                    return new PaginationWrapper.Builder<List<LibraryResponse>>()
                            .setPaginationInfo(items)
                            .setData(list)
                            .build();
                });
    }

    @Override
    public LibraryResponse getLibraryById(Long id) {
        var library = libraryRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Library not found"));
        return wrapLibraryResponse(library);
    }

    @Transactional
    @Override
    public LibraryResponse createLibrary(LibraryRequest libraryRequest) {
        AccountEntity author = accountRepository.findById(libraryRequest.getAuthorId())
                .orElseThrow(() -> new RuntimeException("Author not found"));

        if (libraryRequest.getUrl() == null || libraryRequest.getUrl().trim().isEmpty()) {
            throw new ValidationException("URL cannot be null or empty");
        }

        var library = LibraryEntity.builder()
                .authorId(author)
                .semester(libraryRequest.getSemester())
                .major(libraryRequest.getMajor())
                .description(libraryRequest.getDescription())
                .type(libraryRequest.getType())
                .subjectCode(libraryRequest.getSubjectCode())
                .url(libraryRequest.getUrl())
                .thumbnail(libraryRequest.getThumbnail())
                .status("PUBLISHED")
                .build();

        return wrapLibraryResponse(libraryRepository.save(library));
    }

    @Transactional
    @Override
    public LibraryResponse updateLibrary(Long id, LibraryRequest libraryRequest) {
        var library = libraryRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Library not found"));

        library.setSemester(libraryRequest.getSemester());
        library.setMajor(libraryRequest.getMajor());
        library.setDescription(libraryRequest.getDescription());
        library.setType(libraryRequest.getType());
        library.setSubjectCode(libraryRequest.getSubjectCode());
        library.setUrl(libraryRequest.getUrl());
        library.setThumbnail(libraryRequest.getThumbnail());
        library.setStatus(libraryRequest.getStatus());
        library.setUpdatedDate(LocalDateTime.now());

        return wrapLibraryResponse(libraryRepository.save(library));
    }

    @Transactional
    @Override
    public void deleteLibrary(Long id) {
        if (!libraryRepository.existsById(id)) {
            throw new ValidationException("Library not found");
        }
        try {
            libraryRepository.deleteById(id);
        } catch (Exception ex) {
            throw new ActionFailedException("Failed to delete library", ex);
        }
    }

    @Transactional
    @Override
    public void hideLibrary(Long id, Long requestUserId) {
        var library = libraryRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Library not found"));

        var requestUser = accountRepository.findById(requestUserId)
                .orElseThrow(() -> new ValidationException("User not found"));

        if (!library.getAuthorId().getId().equals(requestUserId) && !"ADMIN".equals(requestUser.getRole().getRoleName())) {
            throw new ActionFailedException("You do not have permission to hide this library");
        }
        library.setStatus("HIDDEN");
        library.setUpdatedDate(LocalDateTime.now());
        libraryRepository.save(library);
    }

    @Transactional
    @Override
    public void showLibrary(Long id) {
        var library = libraryRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Library not found"));
        library.setStatus("PUBLISHED");
        library.setUpdatedDate(LocalDateTime.now());
        libraryRepository.save(library);
    }

    @Override
    public List<LibraryResponse> filterLibraries(Integer semester, String major, String subjectCode, String type, String status, Long authorId) {
        List<LibraryEntity> libraries = libraryRepository.filterLibrary(semester, major, subjectCode, type, status, authorId);
        return libraries.stream().map(this::wrapLibraryResponse).collect(Collectors.toList());
    }

    private LibraryResponse wrapLibraryResponse(LibraryEntity library) {
        var author = accountRepository.findById(library.getAuthorId().getId())
                .orElseThrow(() -> new RuntimeException("Author not found"));
        return LibraryResponse.builder()
                .id(library.getId())
                .authorId(author.getId().toString())
                .semester(library.getSemester())
                .major(library.getMajor())
                .description(library.getDescription())
                .url(library.getUrl())
                .thumbnail(library.getThumbnail())
                .type(library.getType())
                .status(library.getStatus())
                .createdDate(library.getCreatedDate())
                .updatedDate(library.getUpdatedDate())
                .build();
    }
}