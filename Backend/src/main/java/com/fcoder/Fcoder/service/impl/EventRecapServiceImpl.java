package com.fcoder.Fcoder.service.impl;

import com.fcoder.Fcoder.model.dto.request.EventRecapRequest;
import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.response.EventRecapResponse;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;
import com.fcoder.Fcoder.model.entity.EventEntity;
import com.fcoder.Fcoder.model.entity.EventRecapEntity;
import com.fcoder.Fcoder.model.exception.ActionFailedException;
import com.fcoder.Fcoder.model.exception.ValidationException;
import com.fcoder.Fcoder.repository.EventRecapRepository;
import com.fcoder.Fcoder.repository.EventRepository;
import com.fcoder.Fcoder.repository.AccountRepository;
import com.fcoder.Fcoder.service.EventRecapService;
import com.fcoder.Fcoder.util.AuthUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventRecapServiceImpl implements EventRecapService {
    private final EventRecapRepository eventRecapRepository;
    private final EventRepository eventRepository;
    private final AccountRepository accountRepository;
    private final AuthUtils authUtils;

    @Override
    public PaginationWrapper<List<EventRecapResponse>> getAllEventRecaps(QueryWrapper queryWrapper) {
        return eventRecapRepository.query(queryWrapper,
                eventRecapRepository::queryAnySpecification,
                (items) -> {
                    var list = items.map(this::mapToEventRecapResponse).stream().toList();
                    return new PaginationWrapper.Builder<List<EventRecapResponse>>()
                            .setPaginationInfo(items)
                            .setData(list)
                            .build();
                });
    }

    @Transactional
    @Override
    public EventRecapResponse createEventRecap(EventRecapRequest eventRecapRequest) {
        EventEntity event = eventRepository.findById(eventRecapRequest.getEventId())
                .orElseThrow(() -> new ValidationException("Event not found"));

        var eventRecap = EventRecapEntity.builder()
                .event(event)
                .recapContent(eventRecapRequest.getRecapContent())
                .images(eventRecapRequest.getImages())
                .status("PUBLISHED")
                .build();

        return mapToEventRecapResponse(eventRecapRepository.save(eventRecap));
    }

    @Override
    public EventRecapResponse getEventRecapById(Long id) {
        var eventRecap = eventRecapRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Event recap not found"));
        return mapToEventRecapResponse(eventRecap);
    }

    @Transactional
    @Override
    public EventRecapResponse updateEventRecap(Long id, EventRecapRequest eventRecapRequest) {
        var eventRecap = eventRecapRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Event recap not found"));

        EventEntity event = eventRepository.findById(eventRecapRequest.getEventId())
                .orElseThrow(() -> new ValidationException("Event not found"));

        eventRecap.setEvent(event);
        eventRecap.setRecapContent(eventRecapRequest.getRecapContent());
        eventRecap.setImages(eventRecapRequest.getImages());
        eventRecap.setStatus(eventRecapRequest.getStatus());
        eventRecap.setUpdatedDate(LocalDateTime.now());

        return mapToEventRecapResponse(eventRecapRepository.save(eventRecap));
    }

    @Transactional
    @Override
    public void deleteEventRecap(Long id) {
        if (!eventRecapRepository.existsById(id)) {
            throw new ValidationException("Event recap not found");
        }
        try {
            eventRecapRepository.deleteById(id);
        } catch (Exception ex) {
            throw new ActionFailedException("Failed to delete event recap", ex);
        }
    }

    @Transactional
    @Override
    public void hideEventRecap(Long id) {
        var eventRecap = eventRecapRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Event recap not found"));

        var requestUser = authUtils.getUserFromAuthentication();

        boolean isAdmin = "ADMIN".equals(requestUser.getRole().getRoleName());
        boolean isOrganizer = eventRecap.getEvent().getOrganizer().getId().equals(requestUser.getId());

        if (!isAdmin && !isOrganizer) {
            throw new ActionFailedException("You do not have permission to hide this event recap");
        }

        eventRecap.setStatus("HIDDEN");
        eventRecap.setUpdatedDate(LocalDateTime.now());
        eventRecapRepository.save(eventRecap);
    }

    @Transactional
    @Override
    public void showEventRecap(Long id) {
        var eventRecap = eventRecapRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Event recap not found"));

        eventRecap.setStatus("PUBLISHED");
        eventRecap.setUpdatedDate(LocalDateTime.now());
        eventRecapRepository.save(eventRecap);
    }

    private EventRecapResponse mapToEventRecapResponse(EventRecapEntity eventRecap) {
        return EventRecapResponse.builder()
                .id(eventRecap.getId())
                .eventId(eventRecap.getEvent().getId())
                .recapContent(eventRecap.getRecapContent())
                .images(eventRecap.getImages())
                .status(eventRecap.getStatus())
                .createdDate(eventRecap.getCreatedDate())
                .updatedDate(eventRecap.getUpdatedDate())
                .build();
    }
}