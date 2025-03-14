package com.fcoder.Fcoder.model.dto.request;

import com.fcoder.Fcoder.model.exception.ValidationException;
import com.fcoder.Fcoder.util.TextUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class QueryWrapper {
    private final Map<String, String> search;
    private Pageable pageable;
    public QueryWrapper() {
        this.search = new HashMap<>();
    }

    private QueryWrapper(Map<String, String> search, Pageable pageable) {
        this.search = search;
        this.pageable = pageable;
    }

    public Map<String, String> search() {
        return this.search;
    }

    public String searchByField(String field){
        return this.search.get(field);
    }

    public Pageable pagination () {
        return this.pageable;
    }
    public static class QueryWrapperBuilder {
        private Map<String, String> search;
        private Pageable pageable;

        public QueryWrapperBuilder() {
            this.search = new HashMap<>();
        }


        public QueryWrapperBuilder search(String queryString) {
            if (queryString == null || queryString.isEmpty()) {
                this.search = new HashMap<>();
            } else {
                try {
                    String decodedQuery = URLDecoder.decode(queryString, StandardCharsets.UTF_8);
                    String[] queryPairs = decodedQuery.split("&");
                    Map<String, String> queryParams = new HashMap<>();
                    for (String queryPair : queryPairs) {
                        String[] parts = queryPair.split("=");
                        if (parts.length == 2) {
                            queryParams.put(parts[0], parts[1]);
                        }
                    }
                    this.search = TextUtils.convertKeysToCamel(queryParams);
                } catch (Exception e) {
                    throw new ValidationException("The query is not valid");
                }
            }
            return this;
        }

        public QueryWrapperBuilder wrapSort(Pageable ipPageable) {
            int page = ipPageable.getPageNumber();
            int pageSize = ipPageable.getPageSize();
            Sort sort = ipPageable.getSort();
            var orderList = sort.get().map(o -> {
                String prop = o.getProperty();
                Sort.Direction a = o.getDirection();
                String camelProp = TextUtils.kebabToCamel(prop);
                Order camelOrder = null;
                if(a.isAscending()) {
                    camelOrder = Order.asc(camelProp);
                }else {
                    camelOrder = Order.desc(camelProp);
                }
                return camelOrder;
            }).toList();
            Sort camelSort = Sort.by(orderList);
            this.pageable = PageRequest.of(page, pageSize, camelSort);
            return this;
        }

        public QueryWrapperBuilder pageable(Pageable pageable) {
            this.pageable = pageable;
            return this;
        }

        public QueryWrapper build() {
            if (this.pageable == null) {
                this.pageable = PageRequest.of(0, 10);
            }
            return new QueryWrapper(search, pageable);
        }
    }
    public static QueryWrapperBuilder builder() {
        return new QueryWrapperBuilder();
    }
}
