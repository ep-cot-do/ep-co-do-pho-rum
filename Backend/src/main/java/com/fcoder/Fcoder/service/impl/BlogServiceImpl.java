package com.fcoder.Fcoder.service.impl;

import com.fcoder.Fcoder.model.dto.request.BlogRequest;
import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.response.BlogResponse;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;
import com.fcoder.Fcoder.model.entity.AccountEntity;
import com.fcoder.Fcoder.model.entity.BlogEntity;
import com.fcoder.Fcoder.model.exception.ActionFailedException;
import com.fcoder.Fcoder.model.exception.ValidationException;
import com.fcoder.Fcoder.repository.AccountRepository;
import com.fcoder.Fcoder.repository.BlogRepository;
import com.fcoder.Fcoder.service.BlogService;
import com.fcoder.Fcoder.util.AuthUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogServiceImpl implements BlogService {
    private final AccountRepository accountRepository;
    private final BlogRepository blogRepository;
    private final AuthUtils authUtils;

    @Override
    public PaginationWrapper<List<BlogResponse>> getAllBlogs(QueryWrapper queryWrapper) {
        return blogRepository.query(queryWrapper,
                blogRepository::queryAnySpecification,
                (items) -> {
                    var list = items.map(this::wrapBlogResponse).stream().toList();
                    return new PaginationWrapper.Builder<List<BlogResponse>>()
                            .setPaginationInfo(items)
                            .setData(list)
                            .build();
                });
    }

    @Override
    public BlogResponse getBlogById(Long id) {
        var blog = blogRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Blog not found"));
        return wrapBlogResponse(blog);
    }

    @Transactional
    @Override
    public BlogResponse createBlog(BlogRequest blogRequest) {
        AccountEntity author = accountRepository.findById(blogRequest.getAuthorId())
                .orElseThrow(() -> new RuntimeException("Author not found"));

        if (blogRequest.getContent() == null || blogRequest.getContent().trim().isEmpty()) {
            throw new ValidationException("Content cannot be null or empty");
        }

        var blog = BlogEntity.builder()
                .title(blogRequest.getTitle())
                .description(blogRequest.getDescription())
                .content(blogRequest.getContent() != null ? blogRequest.getContent() : "")
                .thumbnail(blogRequest.getThumbnail())
                .authorId(author)
                .category(blogRequest.getCategory())
                .images(blogRequest.getImages())
                .view(0)
                .likes(0)
                .status("DRAFT")
                .build();

        return wrapBlogResponse(blogRepository.save(blog));
    }


    @Transactional
    @Override
    public BlogResponse updateBlog(Long id, BlogRequest blogRequest) {
        var blog = blogRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Blog not found"));

        blog.setTitle(blogRequest.getTitle());
        blog.setDescription(blogRequest.getDescription());
        blog.setContent(blogRequest.getContent());
        blog.setThumbnail(blogRequest.getThumbnail());
        blog.setCategory(blogRequest.getCategory());
        blog.setImages(blogRequest.getImages());
        blog.setUpdatedDate(LocalDateTime.now());

        return wrapBlogResponse(blogRepository.save(blog));
    }


    @Transactional
    @Override
    public void deleteBlog(Long id) {
        if (!blogRepository.existsById(id)) {
            throw new ValidationException("Blog not found");
        }
        try {
            blogRepository.deleteById(id);
        } catch (Exception ex) {
            throw new ActionFailedException("Failed to delete blog", ex);
        }
    }

    @Transactional
    @Override
    public void publishBlog(Long id) {
        var blog = blogRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Blog not found"));
        blog.setStatus("PUBLISHED");
        blog.setUpdatedDate(LocalDateTime.now());
        blogRepository.save(blog);
    }

    @Transactional
    @Override
    public void unpublishBlog(Long id) {
        var blog = blogRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Blog not found"));

        var requestUser = authUtils.getUserFromAuthentication();

        boolean isAdmin = "ADMIN".equals(requestUser.getRole().getRoleName());
        boolean isAuthor = blog.getAuthorId().getId().equals(requestUser.getId());

        if (!isAdmin && !isAuthor) {
            throw new ActionFailedException("You do not have permission to unpublish this blog");
        }

        blog.setStatus("DRAFT");
        blog.setUpdatedDate(LocalDateTime.now());
        blogRepository.save(blog);
    }

    @Override
    public List<BlogResponse> filterBlog(String title, String category, String status, Integer minViews, Integer maxViews, Long authorId) {
        List<BlogEntity> blogs = blogRepository.filterBlogs(title, category, status, minViews, maxViews, authorId);
        return blogs.stream().map(this::wrapBlogResponse).collect(Collectors.toList());
    }

    @Override
    public List<BlogResponse> getMyBlog() {
        AccountEntity currentUser = authUtils.getUserFromAuthentication();

        List<BlogEntity> userPosts = blogRepository.findAll()
                .stream()
                .filter(post -> post.getAuthorId() != null &&
                        post.getAuthorId().getId().equals(currentUser.getId()))
                .toList();

        if (userPosts.isEmpty()) {
            throw new ValidationException("No Blogs found for current user");
        }

        return userPosts.stream()
                .map(this::mapToResponse)
                .toList();
    }


    private BlogResponse mapToResponse(BlogEntity blog) {
        return BlogResponse.builder()
                .id(blog.getId())
                .title(blog.getTitle())
                .description(blog.getDescription())
                .content(blog.getContent())
                .thumbnail(blog.getThumbnail())
                .authorName(blog.getAuthorId().getFullName())
                .category(blog.getCategory())
                .images(blog.getImages())
                .view(blog.getView())
                .likes(blog.getLikes())
                .status(blog.getStatus())
                .createdDate(blog.getCreatedDate())
                .updatedDate(blog.getUpdatedDate())
                .build();
    }

    private BlogResponse wrapBlogResponse(BlogEntity blog) {
        var author = accountRepository.findById(blog.getAuthorId().getId())
                .orElseThrow(() -> new RuntimeException("Author not found"));
        return BlogResponse.builder()
                .id(blog.getId())
                .title(blog.getTitle())
                .description(blog.getDescription())
                .content(blog.getContent())
                .thumbnail(blog.getThumbnail())
                .authorName(author.getFullName())
                .category(blog.getCategory())
                .images(blog.getImages())
                .view(blog.getView())
                .likes(blog.getLikes())
                .status(blog.getStatus())
                .createdDate(blog.getCreatedDate())
                .updatedDate(blog.getUpdatedDate())
                .build();
    }

}