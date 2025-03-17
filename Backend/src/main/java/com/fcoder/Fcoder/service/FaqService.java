package com.fcoder.Fcoder.service;

import com.fcoder.Fcoder.model.dto.request.FaqRequest;
import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.response.FaqResponse;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;
import io.lettuce.core.dynamic.annotation.Param;

import java.util.List;

public interface FaqService {

    PaginationWrapper<List<FaqResponse>> getAllFaqs(QueryWrapper queryWrapper);

    FaqResponse getFaqById(Long id);

    FaqResponse createFaq(FaqRequest faqRequest);

    FaqResponse updateFaq(Long id, FaqRequest faqRequest);

    void publishFaq(Long id);

    void unpublishFaq(Long id);

    void deleteFaq(Long id);

}