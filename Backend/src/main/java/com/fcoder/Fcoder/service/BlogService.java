package com.fcoder.Fcoder.service;

import com.fcoder.Fcoder.model.dto.request.BlogRequest;
import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.response.BlogResponse;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;
import io.lettuce.core.dynamic.annotation.Param;

import java.util.List;

public interface BlogService {
    PaginationWrapper<List<BlogResponse>> getAllBlogs(QueryWrapper queryWrapper);

    BlogResponse getBlogById(Long id);

    BlogResponse createBlog(BlogRequest blogRequest);

    BlogResponse updateBlog(Long id, BlogRequest blogRequest);

    void deleteBlog(Long id);

    void publishBlog(Long id);

    void unpublishBlog(Long id);

    List<BlogResponse> filterBlog(String title, String category, String status, Integer minViews, Integer maxViews, Long authorId);
}
