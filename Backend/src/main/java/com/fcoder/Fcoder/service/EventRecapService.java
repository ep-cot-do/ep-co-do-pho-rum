package com.fcoder.Fcoder.service;

import com.fcoder.Fcoder.model.dto.request.EventRecapRequest;
import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.response.EventRecapResponse;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;
import io.lettuce.core.dynamic.annotation.Param;

import java.util.List;

public interface EventRecapService {
    PaginationWrapper<List<EventRecapResponse>> getAllEventRecaps(QueryWrapper queryWrapper);
    EventRecapResponse createEventRecap(EventRecapRequest eventRecapRequest);
    EventRecapResponse getEventRecapById(Long id);
    EventRecapResponse updateEventRecap(Long id , EventRecapRequest eventRecapRequest);
    void deleteEventRecap(Long id);
    void hideEventRecap(Long id);
    void showEventRecap(Long id);
}
