package com.fcoder.Fcoder.service.impl;

import com.fcoder.Fcoder.model.dto.request.GameRequest;
import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.response.GameResponse;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;
import com.fcoder.Fcoder.model.entity.AccountEntity;
import com.fcoder.Fcoder.model.entity.GameEntity;
import com.fcoder.Fcoder.model.exception.ActionFailedException;
import com.fcoder.Fcoder.model.exception.ValidationException;
import com.fcoder.Fcoder.repository.AccountRepository;
import com.fcoder.Fcoder.repository.GameRepository;
import com.fcoder.Fcoder.service.GameService;
import com.fcoder.Fcoder.util.AuthUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GameServiceImpl implements GameService {
    private final GameRepository gameRepository;
    private final AccountRepository accountRepository;
    private final AuthUtils authUtils;

    @Override
    public PaginationWrapper<List<GameResponse>> getAllGames(QueryWrapper queryWrapper) {
        return gameRepository.query(queryWrapper,
                gameRepository::queryAnySpecification,
                (items) -> {
                    var list = items.map(this::mapToResponse).stream().toList();
                    return new PaginationWrapper.Builder<List<GameResponse>>()
                            .setPaginationInfo(items)
                            .setData(list)
                            .build();
                });
    }

    @Override
    public GameResponse getGameById(Long id) {
        var game = gameRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Game not found"));
        return mapToResponse(game);
    }

    @Transactional
    @Override
    public GameResponse createGame(GameRequest gameRequest) {
        AccountEntity author = accountRepository.findById(gameRequest.getAuthorId())
                .orElseThrow(() -> new ValidationException("Author not found"));

        var game = GameEntity.builder()
                .authorId(author)
                .title(gameRequest.getTitle())
                .description(gameRequest.getDescription())
                .thumbnail(gameRequest.getThumbnail())
                .url(gameRequest.getUrl())
                .category(gameRequest.getCategory())
                .isActive(true)
                .build();

        return mapToResponse(gameRepository.save(game));
    }

    @Transactional
    @Override
    public GameResponse updateGame(Long id, GameRequest gameRequest) {
        var game = gameRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Game not found"));

        game.setTitle(gameRequest.getTitle());
        game.setDescription(gameRequest.getDescription());
        game.setThumbnail(gameRequest.getThumbnail());
        game.setUrl(gameRequest.getUrl());
        game.setCategory(gameRequest.getCategory());
        game.setUpdatedDate(LocalDateTime.now());

        return mapToResponse(gameRepository.save(game));
    }

    @Transactional
    @Override
    public void deleteGame(Long id) {
        if (!gameRepository.existsById(id)) {
            throw new ValidationException("Game not found");
        }
        try {
            gameRepository.deleteById(id);
        } catch (Exception ex) {
            throw new ActionFailedException("Failed to delete game", ex);
        }
    }

    @Override
    public GameResponse getGameByCategory(String category) {
        return gameRepository.findByCategory(category)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ValidationException("Game not found"));
    }

    @Transactional
    @Override
    public void hideGame(Long id) {
        var game = gameRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Game not found"));

        var requestUser = authUtils.getUserFromAuthentication();

        boolean isAdmin = "ADMIN".equals(requestUser.getRole().getRoleName());
        boolean isAuthor = game.getAuthorId().getId().equals(requestUser.getId());

        if (!isAdmin && !isAuthor) {
            throw new ActionFailedException("You do not have permission to hide this game");
        }

        game.setIsActive(false);
        game.setUpdatedDate(LocalDateTime.now());
        gameRepository.save(game);
    }


    @Transactional
    @Override
    public void showGame(Long id) {
        var game = gameRepository.findById(id)
                .orElseThrow(() -> new ValidationException("Game not found"));
        game.setIsActive(true);
        game.setUpdatedDate(LocalDateTime.now());
        gameRepository.save(game);
    }

    private GameResponse mapToResponse(GameEntity game) {
        return GameResponse.builder()
                .id(game.getId())
                .authorId(game.getAuthorId().getId())
                .title(game.getTitle())
                .description(game.getDescription())
                .thumbnail(game.getThumbnail())
                .url(game.getUrl())
                .category(game.getCategory())
                .createdDate(game.getCreatedDate())
                .updatedDate(game.getUpdatedDate())
                .isActive(game.getIsActive())
                .build();
    }
}
