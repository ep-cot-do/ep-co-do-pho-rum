package com.fcoder.Fcoder.service;

import com.fcoder.Fcoder.model.dto.request.GameRequest;
import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.response.GameResponse;
import com.fcoder.Fcoder.model.dto.response.PaginationWrapper;
import io.lettuce.core.dynamic.annotation.Param;

import java.util.List;
public interface GameService {
    PaginationWrapper<List<GameResponse>> getAllGames(QueryWrapper queryWrapper);
    GameResponse getGameById(Long id);
    List<GameResponse> getGameByUserId(Long userId);
    List<GameResponse> getGameByGameTitle(String gameTitle);
    GameResponse createGame(GameRequest gameRequest);
    GameResponse updateGame(Long id, GameRequest gameRequest);
    void deleteGame(Long id);
    List<GameResponse> getGameByCategory(String category);
    void hideGame(Long id);
    void showGame(Long id);
}
