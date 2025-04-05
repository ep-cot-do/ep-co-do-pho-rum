package com.fcoder.Fcoder.service.impl;

import com.fcoder.Fcoder.model.dto.request.FaqRequest;
import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.response.FaqResponse;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;
import com.fcoder.Fcoder.model.entity.FaqEntity;
import com.fcoder.Fcoder.repository.FaqRepository;
import com.fcoder.Fcoder.service.FaqService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FaqServiceImpl implements FaqService {

    private final FaqRepository faqRepository;

    @Override
    public PaginationWrapper<List<FaqResponse>> getAllFaqs(QueryWrapper queryWrapper) {
        return faqRepository.query(queryWrapper,
                faqRepository::queryAnySpecification,
                (items) -> {
                    var list = items.map(this::mapToResponse).stream().toList();
                    return new PaginationWrapper.Builder<List<FaqResponse>>()
                            .setPaginationInfo(items)
                            .setData(list)
                            .build();
                });
    }

    @Override
    public FaqResponse getFaqById(Long id) {
        FaqEntity faqEntity = faqRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FAQ not found with id: " + id));
        return mapToResponse(faqEntity);
    }


    @Override
    public FaqResponse createFaq(FaqRequest faqRequest) {
        FaqEntity faqEntity = FaqEntity.builder()
                .question(faqRequest.getQuestion())
                .answer(faqRequest.getAnswer())
                .isActive(faqRequest.isActive())
                .build();
        FaqEntity savedFaq = faqRepository.save(faqEntity);
        return mapToResponse(savedFaq);
    }

    @Override
    public FaqResponse updateFaq(Long id, FaqRequest faqRequest) {
        FaqEntity faqEntity = faqRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FAQ not found with id: " + id));

        faqEntity.setQuestion(faqRequest.getQuestion());
        faqEntity.setAnswer(faqRequest.getAnswer());
        faqEntity.setActive(faqRequest.isActive());
        faqEntity.setUpdatedDate(LocalDateTime.now());

        FaqEntity updatedFaq = faqRepository.save(faqEntity);
        return mapToResponse(updatedFaq);
    }

    @Override
    public void publishFaq(Long id) {
        FaqEntity faqEntity = faqRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FAQ not found with id: " + id));
        faqEntity.setActive(true);
        faqRepository.save(faqEntity);
    }

    @Override
    public void unpublishFaq(Long id) {
        FaqEntity faqEntity = faqRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FAQ not found with id: " + id));
        faqEntity.setActive(false);
        faqRepository.save(faqEntity);
    }

    @Override
    public void deleteFaq(Long id) {
        if (!faqRepository.existsById(id)) {
            throw new RuntimeException("FAQ not found with id: " + id);
        }
        faqRepository.deleteById(id);
    }

    private FaqResponse mapToResponse(FaqEntity faqEntity) {
        return FaqResponse.builder()
                .id(faqEntity.getId())
                .question(faqEntity.getQuestion())
                .answer(faqEntity.getAnswer())
                .createdDate(faqEntity.getCreatedDate())
                .updatedDate(faqEntity.getUpdatedDate())
                .isActive(faqEntity.isActive())
                .build();
    }
}