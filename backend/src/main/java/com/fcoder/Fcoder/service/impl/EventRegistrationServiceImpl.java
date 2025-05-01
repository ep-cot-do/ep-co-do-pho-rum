package com.fcoder.Fcoder.service.impl;

import com.fcoder.Fcoder.model.dto.request.EventRegistrationRequest;
import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.response.EventRecapResponse;
import com.fcoder.Fcoder.model.dto.response.EventRegistrationResponse;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;
import com.fcoder.Fcoder.model.entity.AccountEntity;
import com.fcoder.Fcoder.model.entity.EventEntity;
import com.fcoder.Fcoder.model.entity.EventRecapEntity;
import com.fcoder.Fcoder.model.entity.EventRegistrationEntity;
import com.fcoder.Fcoder.model.exception.ActionFailedException;
import com.fcoder.Fcoder.model.exception.ValidationException;
import com.fcoder.Fcoder.repository.AccountRepository;
import com.fcoder.Fcoder.repository.EventRegistrationRepository;
import com.fcoder.Fcoder.repository.EventRepository;
import com.fcoder.Fcoder.service.EventRegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventRegistrationServiceImpl implements EventRegistrationService {
    private final EventRegistrationRepository eventRegistrationRepository;
    private final EventRepository eventRepository;
    private final AccountRepository accountRepository;

    @Override
    public PaginationWrapper<List<EventRegistrationResponse>> getAllEventRegistrations(QueryWrapper queryWrapper) {
        return eventRegistrationRepository.query(queryWrapper,
                eventRegistrationRepository::queryAnySpecification,
                (items) -> {
                    var list = items.map(this::mapToEventRegistrationResponse).stream().toList();
                    return new PaginationWrapper.Builder<List<EventRegistrationResponse>>()
                            .setPaginationInfo(items)
                            .setData(list)
                            .build();
                });
    }

    @Transactional
    @Override
    public EventRegistrationResponse registerForEvent(EventRegistrationRequest registrationRequest) {
        EventEntity event = eventRepository.findById(registrationRequest.getEventId())
                .orElseThrow(() -> new ValidationException("Event not found"));

        AccountEntity user = accountRepository.findById(registrationRequest.getUserId())
                .orElseThrow(() -> new ValidationException("User not found"));

        // Check if the event is active
        if (!event.getIsActive()) {
            throw new ValidationException("Event is not active");
        }

        // Check if event is full (only for participant role)
        if ("PARTICIPANT".equals(registrationRequest.getRole())) {
            long currentParticipants = eventRegistrationRepository.findAll().stream()
                    .filter(reg -> reg.getEvent().getId().equals(event.getId()) &&
                            "PARTICIPANT".equals(reg.getRole()) &&
                            reg.isActive())
                    .count();

            if (currentParticipants >= event.getMaxParticipants()) {
                throw new ValidationException("Event has reached maximum participants");
            }
        }

        var registration = EventRegistrationEntity.builder()
                .event(event)
                .user(user)
                .role(registrationRequest.getRole())
                .isActive(true)
                .build();

        return mapToEventRegistrationResponse(eventRegistrationRepository.save(registration));
    }

    @Override
    public EventRegistrationResponse getEventRegistrationById(Long id) {
        var registration = eventRegistrationRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Event registration not found"));
        return mapToEventRegistrationResponse(registration);
    }

    @Override
    public List<EventRegistrationResponse> getEventRegistrationByEventTitle(String eventTitle) {
        List<EventEntity> matchingEvents = eventRepository.findByTitleContainingIgnoreCase(eventTitle);

        if (matchingEvents.isEmpty()) {
            throw new ValidationException("No events found matching: " + eventTitle);
        }

        List<Long> eventIds = matchingEvents.stream()
                .map(EventEntity::getId)
                .toList();

        List<EventRegistrationEntity> registrations = new ArrayList<>();

        for (Long eventId : eventIds) {
            List<EventRegistrationEntity> eventRegistrations = eventRegistrationRepository.findAllByEventId(eventId);
            registrations.addAll(eventRegistrations);
        }

        if (registrations.isEmpty()) {
            throw new ValidationException("No registrations found for events matching: " + eventTitle);
        }
        return registrations.stream()
                .map(this::mapToEventRegistrationResponse)
                .toList();
    }

    @Transactional
    @Override
    public EventRegistrationResponse updateEventRegistration(Long id, EventRegistrationRequest registrationRequest) {
        var registration = eventRegistrationRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Event registration not found"));

        EventEntity event = eventRepository.findById(registrationRequest.getEventId())
                .orElseThrow(() -> new ValidationException("Event not found"));

        AccountEntity user = accountRepository.findById(registrationRequest.getUserId())
                .orElseThrow(() -> new ValidationException("User not found"));

        registration.setEvent(event);
        registration.setUser(user);
        registration.setRole(registrationRequest.getRole());
        registration.setUpdatedDate(LocalDateTime.now());

        return mapToEventRegistrationResponse(eventRegistrationRepository.save(registration));
    }

    @Transactional
    @Override
    public void deleteEventRegistration(Long id) {
        if (!eventRegistrationRepository.existsById(id)) {
            throw new ValidationException("Event registration not found");
        }
        try {
            eventRegistrationRepository.deleteById(id);
        } catch (Exception ex) {
            throw new ActionFailedException("Failed to delete event registration", ex);
        }
    }

    @Override
    public List<EventRegistrationResponse> getRegistrationsByEventId(Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new ValidationException("Event not found");
        }

        return eventRegistrationRepository.findAll().stream()
                .filter(reg -> reg.getEvent().getId().equals(eventId))
                .map(this::mapToEventRegistrationResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<EventRegistrationResponse> getRegistrationsByUserId(Long userId) {
        if (!accountRepository.existsById(userId)) {
            throw new ValidationException("User not found");
        }

        return eventRegistrationRepository.findAll().stream()
                .filter(reg -> reg.getUser().getId().equals(userId))
                .map(this::mapToEventRegistrationResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public void deactivateRegistration(Long id) {
        var registration = eventRegistrationRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Event registration not found"));

        registration.setActive(false);
        registration.setUpdatedDate(LocalDateTime.now());
        eventRegistrationRepository.save(registration);
    }

    @Transactional
    @Override
    public void activateRegistration(Long id) {
        var registration = eventRegistrationRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Event registration not found"));

        registration.setActive(true);
        registration.setUpdatedDate(LocalDateTime.now());
        eventRegistrationRepository.save(registration);
    }

    private EventRegistrationResponse mapToEventRegistrationResponse(EventRegistrationEntity registration) {
        return EventRegistrationResponse.builder()
                .id(registration.getId())
                .userId(registration.getUser().getId())
                .role(registration.getRole())
                .created_date(registration.getCreatedDate())
                .updated_date(registration.getUpdatedDate())
                .isActive(registration.isActive())
                .build();
    }
}