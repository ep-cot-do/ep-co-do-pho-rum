package com.fcoder.Fcoder.controller;

import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.request.BlogRequest;
import com.fcoder.Fcoder.model.dto.response.BlogResponse;
import com.fcoder.Fcoder.model.dto.response.ResponseObject;
import com.fcoder.Fcoder.service.BlogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/blogs", produces = MediaType.APPLICATION_JSON_VALUE)
public class BlogController {
    private final BlogService blogService;

    @GetMapping
    @Operation(summary = "Get all blog", description = "This API will return all blogs")
    public ResponseEntity<ResponseObject<List<BlogResponse>>> getAllBlogs(@RequestParam(name = "q", required = false) String query,
                                                                          @PageableDefault(page = 0, size = 10) Pageable pageable) {
        var result = blogService.getAllBlogs(QueryWrapper.builder()
                .wrapSort(pageable)
                .search(query)
                .build());
        return ResponseEntity.ok(new ResponseObject.Builder<List<BlogResponse>>()
                .success(true)
                .code("SUCCESS")
                .unwrapPaginationWrapper(result)
                .message("Accounts retrieved successfully")
                .build());
    }

    @Operation(summary = "Get blog by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject<BlogResponse>> getBlogById(@PathVariable Long id) {
        var blog = blogService.getBlogById(id);
        return ResponseEntity.ok(new ResponseObject.Builder<BlogResponse>()
                .success(true)
                .code("SUCCESS")
                .content(blog)
                .message("Get Success")
                .build());
    }

    @Operation(summary = "Create a new blog (Admin and Header of club only)", security = {@SecurityRequirement(name = "accessCookie")})
    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_HOC')")
    public ResponseEntity<ResponseObject<BlogResponse>> createBlog(@RequestBody BlogRequest blogRequest) {
        var blog = blogService.createBlog(blogRequest);
        System.out.println("blog = " + blog);
        return ResponseEntity.ok(new ResponseObject.Builder<BlogResponse>()
                .success(true)
                .code("SUCCESS")
                .content(blog)
                .message("Create Success")
                .build());
    }

    @Operation(summary = "Update a blog by ID (Admin and Header of club only)", security = {@SecurityRequirement(name = "accessCookie")})
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_HOC')")
    public ResponseEntity<ResponseObject<BlogResponse>> updateBlogDetails(@PathVariable Long id,
                                                                    @RequestBody BlogRequest blogRequest) {
        var blog = blogService.updateBlog(id, blogRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<BlogResponse>()
                .success(true)
                .code("SUCCESS")
                .content(blog)
                .message("Update Success")
                .build());
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_HOC')")
    @Operation(summary = "Update a blog by ID (Admin and Header of club only)", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<BlogResponse>> updateBlog(@PathVariable Long id, @RequestBody BlogRequest blogRequest) {
        var blog = blogService.updateBlog(id, blogRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<BlogResponse>()
                .success(true)
                .code("SUCCESS")
                .content(blog)
                .message("Update Success")
                .build());
    }


    @PatchMapping("/publish/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_HOC')")
    @Operation(summary = "Publish a blog by ID (Admin and Header of club only)", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<Void>> publishBlog(@PathVariable Long id) {
        blogService.publishBlog(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Publish Success")
                .build());
    }

    @PatchMapping("/unpublish/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_HOC')")
    @Operation(summary = "Unpublish a blog by ID (Admin and Header of club only)", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<Void>> unpublishBlog(@PathVariable Long id) {
        blogService.unpublishBlog(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Unpublish Success")
                .build());
    }

    @Operation(summary = "Delete a blog by ID (Admin only)", security = {@SecurityRequirement(name = "accessCookie")})
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseObject<Void>> deleteBlog(@PathVariable Long id) {
        blogService.deleteBlog(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Delete Success")
                .build());
    }

    @GetMapping("/filter")
    @Operation(summary = "Filter blogs", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<List<BlogResponse>>>
    filterBlog(@RequestParam(required = false) String title,
               @RequestParam(required = false) String category,
               @RequestParam(required = false) String status,
               @RequestParam(required = false) Integer minViews,
               @RequestParam(required = false) Integer maxViews,
               @RequestParam(required = false) Long authorId) {
        var blogs = blogService.filterBlog(title, category, status, minViews, maxViews, authorId);
        return ResponseEntity.ok(new ResponseObject.Builder<List<BlogResponse>>()
                .success(true)
                .code("SUCCESS")
                .content(blogs)
                .message("Filter Success")
                .build());
    }

    @GetMapping("/my-blogs")
    @Operation(summary = "Get all blogs of current user", description = "This API will return all blogs of current user")
    public ResponseEntity<ResponseObject<List<BlogResponse>>> getMyBlogs(@PageableDefault(page = 0, size = 10) Pageable pageable) {
        var result = blogService.getMyBlog();
        return ResponseEntity.ok(new ResponseObject.Builder<List<BlogResponse>>()
                .success(true)
                .code("SUCCESS")
                .content(result)
                .message("Accounts retrieved successfully")
                .build());
    }
}