package com.fcoder.Fcoder.controller;

import com.fcoder.Fcoder.model.dto.request.FaqRequest;
import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.response.FaqResponse;
import com.fcoder.Fcoder.model.dto.response.ResponseObject;
import com.fcoder.Fcoder.service.FaqService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/faqs", produces = MediaType.APPLICATION_JSON_VALUE)
public class FaqController {

    private final FaqService faqService;

    @GetMapping
    @Operation(summary = "Get all FAQ", description = "This API will return all FAQ")
    public ResponseEntity<ResponseObject<List<FaqResponse>>> getAllFaqs(@RequestParam(name = "q", required = false) String query,
                                                                        @PageableDefault(page = 0, size = 10) Pageable pageable) {
        var queryWrapperBuilder = QueryWrapper.builder().wrapSort(pageable);
        if (query != null && !query.isBlank()) {
            queryWrapperBuilder.search(query);
        }

        var result = faqService.getAllFaqs(queryWrapperBuilder.build());

        return ResponseEntity.ok(new ResponseObject.Builder<List<FaqResponse>>()
                .success(true)
                .code("SUCCESS")
                .unwrapPaginationWrapper(result)
                .message("FAQs  retrieved successfully")
                .build());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get FAQ by ID")
    public ResponseEntity<ResponseObject<FaqResponse>> getFaqById(@PathVariable Long id) {
        var faq = faqService.getFaqById(id);
        return ResponseEntity.ok(new ResponseObject.Builder<FaqResponse>()
                .success(true)
                .code("SUCCESS")
                .content(faq)
                .message("Retrieve Success")
                .build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Operation(summary = "Create a new FAQ (Admin only)", security = {@SecurityRequirement(name =
            "accessCookie")})
    public ResponseEntity<ResponseObject<FaqResponse>> createFaq(@RequestBody FaqRequest faqRequest) {
        var faq = faqService.createFaq(faqRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<FaqResponse>()
                .success(true)
                .code("SUCCESS")
                .content(faq)
                .message("Create Success")
                .build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Operation(summary = "Update FAQ (Admin only)", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<FaqResponse>> updateFaq(@PathVariable Long id, @RequestBody FaqRequest faqRequest) {
        var faq = faqService.updateFaq(id, faqRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<FaqResponse>()
                .success(true)
                .code("SUCCESS")
                .content(faq)
                .message("Update Success")
                .build());
    }

    @PatchMapping("/publish/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Operation(summary = "Publish a faq by ID (Admin only)", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<Void>> publishFaq(@PathVariable Long id) {
        faqService.publishFaq(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Publish Success")
                .build());
    }

    @PatchMapping("/unpublish/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Operation(summary = "Unpublish a faq by ID (Admin only)", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<Void>> unpublishFaq(@PathVariable Long id) {
        faqService.unpublishFaq(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Unpublish Success")
                .build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Operation(summary = "Delete FAQ (Admin only)", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<String>> deleteFaq(@PathVariable Long id) {
        faqService.deleteFaq(id);
        return ResponseEntity.ok(new ResponseObject.Builder<String>()
                .success(true)
                .code("SUCCESS")
                .content("Deleted Successfully")
                .message("Delete Success")
                .build());
    }
}