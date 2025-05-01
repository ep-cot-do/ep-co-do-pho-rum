package com.fcoder.Fcoder.service;

import com.fcoder.Fcoder.model.dto.request.EventRequest;
import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.response.EventResponse;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;
import io.lettuce.core.dynamic.annotation.Param;

import java.util.List;

public interface EventService {
    PaginationWrapper<List<EventResponse>>getAllEvent(QueryWrapper queryWrapper);
    EventResponse createEvent(EventRequest eventRequest);
    EventResponse getEventById(Long id);
    List<EventResponse> getEventByUserId(Long userId);
    List<EventResponse> getEventByEventTitle(String eventTitle);
    EventResponse updateEvent(Long id , EventRequest eventRequest);
    void deleteEvent(Long id);
    void hideEvent(Long id);
    void showEvent(Long id);
}
