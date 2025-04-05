package com.fcoder.Fcoder.service;

import com.fcoder.Fcoder.model.dto.request.EventRegistrationRequest;
import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.response.EventRegistrationResponse;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;

import java.util.List;

public interface EventRegistrationService {
    PaginationWrapper<List<EventRegistrationResponse>> getAllEventRegistrations(QueryWrapper queryWrapper);
    EventRegistrationResponse registerForEvent(EventRegistrationRequest registrationRequest);
    EventRegistrationResponse getEventRegistrationById(Long id);
    List<EventRegistrationResponse> getEventRegistrationByEventTitle(String eventTitle);
    EventRegistrationResponse updateEventRegistration(Long id, EventRegistrationRequest registrationRequest);
    void deleteEventRegistration(Long id);
    List<EventRegistrationResponse> getRegistrationsByEventId(Long eventId);
    List<EventRegistrationResponse> getRegistrationsByUserId(Long userId);
    void deactivateRegistration(Long id);
    void activateRegistration(Long id);
}