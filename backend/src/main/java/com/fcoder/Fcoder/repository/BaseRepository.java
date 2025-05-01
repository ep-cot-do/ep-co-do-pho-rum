package com.fcoder.Fcoder.repository;

import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.NoRepositoryBean;

import java.io.Serializable;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@NoRepositoryBean
public interface BaseRepository<T, ID extends Serializable> extends JpaRepository<T, ID>, JpaSpecificationExecutor<T> {
    default Specification<T> queryAnySpecification(Map<String, String> param) {
        return (root, query, criteriaBuilder) -> {
            if (param == null || param.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.or(
                    createDefaultPredicate(criteriaBuilder,root,param)
            );
        };
    }
    default Predicate[] createDefaultPredicate(CriteriaBuilder criteriaBuilder, Root<?> root, Map<String, String> param) {
        return param.entrySet().stream().map(entry -> {
            String key = entry.getKey();
            String value = entry.getValue();
            if (key.toLowerCase().endsWith("id")) {
                try {
                    Long longValue = Long.parseLong(value);
                    if (root.get(key).getJavaType().isAssignableFrom(Number.class)) {
                        return criteriaBuilder.equal(root.get(key), longValue);
                    } else {
                        return criteriaBuilder.equal(root.get(key).get("id"), longValue);
                    }
                } catch (NumberFormatException e) {
                    return criteriaBuilder.like(
                            criteriaBuilder.lower(root.get(key).as(String.class)),
                            "%" + value.toLowerCase() + "%"
                    );
                }
            } else {
                return criteriaBuilder.like(
                        criteriaBuilder.lower(root.get(key).as(String.class)),
                        "%" + value.toLowerCase() + "%"
                );
            }
        }).toArray(Predicate[]::new);
    }

    default Page<T> queryAny(Map<String, String> param, Pageable pageable) {
        Specification<T> spec = queryAnySpecification(param);
        return findAll(spec,pageable);
    }
    default Page<T> query(Map<String, String> param, Pageable pageable, Function<Map<String, String>, Specification<T>> query) {
        return findAll(query.apply(param), pageable);
    }
    default Page<T> query(QueryWrapper queryWrapper, Function<Map<String, String>, Specification<T>> query) {
        return query(queryWrapper.search(), queryWrapper.pagination(), query);
    }
    default Page<T> query(Specification<T> query, Pageable pageable) {
        return findAll(query, pageable);
    }
    default <D extends List<?>> PaginationWrapper<D> query(Map<String, String> param, Pageable pageable, Function<Map<String, String>, Specification<T>> query, Function<Page<T>, PaginationWrapper<D>> mapper) {
        var entityResult = findAll(query.apply(param), pageable);
        return mapper.apply(entityResult);
    }
    default <D extends List<?>> PaginationWrapper<D> query(QueryWrapper queryWrapper, Function<Map<String, String>, Specification<T>> query, Function<Page<T>, PaginationWrapper<D>> mapper) {
        return query(queryWrapper.search(), queryWrapper.pagination(), query, mapper);
    }
}
