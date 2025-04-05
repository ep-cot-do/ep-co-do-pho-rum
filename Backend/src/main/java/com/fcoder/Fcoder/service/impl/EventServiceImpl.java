package com.fcoder.Fcoder.service.impl;

import com.fcoder.Fcoder.model.dto.request.EventRequest;
import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.response.EventResponse;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;
import com.fcoder.Fcoder.model.entity.AccountEntity;
import com.fcoder.Fcoder.model.entity.EventEntity;
import com.fcoder.Fcoder.model.exception.ActionFailedException;
import com.fcoder.Fcoder.model.exception.ValidationException;
import com.fcoder.Fcoder.repository.AccountRepository;
import com.fcoder.Fcoder.repository.EventRepository;
import com.fcoder.Fcoder.service.EventService;
import com.fcoder.Fcoder.util.AuthUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {
    private final EventRepository eventRepository;
    private final AccountRepository accountRepository;
    private final AuthUtils authUtils;

    @Override
    public PaginationWrapper<List<EventResponse>> getAllEvent(QueryWrapper queryWrapper) {
        return eventRepository.query(queryWrapper,
                eventRepository::queryAnySpecification,
                (items) -> {
                    var list = items.map(this::mapToEventResponse).stream().toList();
                    return new PaginationWrapper.Builder<List<EventResponse>>()
                            .setPaginationInfo(items)
                            .setData(list)
                            .build();
                });
    }

    @Transactional
    @Override
    public EventResponse createEvent(EventRequest eventRequest) {
        AccountEntity organizer = accountRepository.findById(eventRequest.getOrganizerId())
                .orElseThrow(() -> new ValidationException("Organizer not found"));

        var event = EventEntity.builder()
                .organizer(organizer)
                .type(eventRequest.getType())
                .title(eventRequest.getTitle())
                .description(eventRequest.getDescription())
                .location(eventRequest.getLocation())
                .eventStartDate(eventRequest.getEventStartDate())
                .eventEndDate(eventRequest.getEventEndDate())
                .maxParticipants(eventRequest.getMaxParticipant().intValue())
                .status(eventRequest.getStatus())
                .documentLink(eventRequest.getDocumentLink())
                .eventImage(eventRequest.getEventImg())
                .isActive(true)
                .build();

        return mapToEventResponse(eventRepository.save(event));
    }

    @Override
    public EventResponse getEventById(Long id) {
        var event = eventRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Event not found"));
        return mapToEventResponse(event);
    }

    @Override
    public List<EventResponse> getEventByUserId(Long userId) {
        AccountEntity user = accountRepository.findById(userId)
                .orElseThrow(() -> new ValidationException("User not found"));

        List<EventEntity> events = eventRepository.findAll()
                .stream()
                .filter(event -> event.getOrganizer().getId().equals(userId))
                .toList();

        return events.stream()
                .map(this::mapToEventResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<EventResponse> getEventByEventTitle(String eventTitle) {
        List<EventEntity> events = eventRepository.findByTitleContainingIgnoreCase(eventTitle);

        return events.stream()
                .map(this::mapToEventResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public EventResponse updateEvent(Long id, EventRequest eventRequest) {
        var event = eventRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Event not found"));

        AccountEntity organizer = accountRepository.findById(eventRequest.getOrganizerId())
                .orElseThrow(() -> new ValidationException("Organizer not found"));

        event.setOrganizer(organizer);
        event.setType(eventRequest.getType());
        event.setTitle(eventRequest.getTitle());
        event.setDescription(eventRequest.getDescription());
        event.setLocation(eventRequest.getLocation());
        event.setEventStartDate(eventRequest.getEventStartDate());
        event.setEventEndDate(eventRequest.getEventEndDate());
        event.setMaxParticipants(eventRequest.getMaxParticipant().intValue());
        event.setStatus(eventRequest.getStatus());
        event.setDocumentLink(eventRequest.getDocumentLink());
        event.setEventImage(eventRequest.getEventImg());
        event.setUpdatedDate(LocalDateTime.now());

        return mapToEventResponse(eventRepository.save(event));
    }

    @Transactional
    @Override
    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new ValidationException("Event not found");
        }
        try {
            eventRepository.deleteById(id);
        } catch (Exception ex) {
            throw new ActionFailedException("Failed to delete event", ex);
        }
    }

    @Transactional
    @Override
    public void hideEvent(Long id) {
        var event = eventRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Event not found"));

        var requestUser = authUtils.getUserFromAuthentication();

        boolean isAdmin = "ADMIN".equals(requestUser.getRole().getRoleName());
        boolean isOrganizer = event.getOrganizer().getId().equals(requestUser.getId());

        if (!isAdmin && !isOrganizer) {
            throw new ActionFailedException("You do not have permission to hide this event");
        }

        event.setIsActive(false);
        event.setUpdatedDate(LocalDateTime.now());
        eventRepository.save(event);
    }

    @Transactional
    @Override
    public void showEvent(Long id) {
        var event = eventRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Event not found"));

        event.setIsActive(true);
        event.setUpdatedDate(LocalDateTime.now());
        eventRepository.save(event);
    }

    private EventResponse mapToEventResponse(EventEntity event) {
        return EventResponse.builder()
                .id(event.getId())
                .organizerId(event.getOrganizer().getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .location(event.getLocation())
                .eventStartDate(event.getEventStartDate())
                .eventEndDate(event.getEventEndDate())
                .maxParticipant(event.getMaxParticipants().longValue())
                .status(event.getStatus())
                .type(event.getType())
                .eventImage(event.getEventImage())
                .createdDate(event.getCreatedDate())
                .updatedDate(event.getUpdatedDate())
                .isActive(event.getIsActive())
                .build();
    }
}