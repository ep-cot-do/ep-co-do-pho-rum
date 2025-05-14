package com.fcoder.Fcoder.controller;

import com.fcoder.Fcoder.model.dto.request.GameRequest;
import com.fcoder.Fcoder.model.dto.request.QueryWrapper;
import com.fcoder.Fcoder.model.dto.response.GameResponse;
import com.fcoder.Fcoder.model.dto.response.ResponseObject;
import com.fcoder.Fcoder.service.GameService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Pageable;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/games", produces = MediaType.APPLICATION_JSON_VALUE)
public class GameController {
    private final GameService gameService;

    @GetMapping
    @Operation(summary = "Get all games", description = "This API returns all games")
    public ResponseEntity<ResponseObject<List<GameResponse>>> getAllGames(@RequestParam(name = "q", required = false) String query,
                                                                          @PageableDefault(page = 0, size = 10) Pageable pageable) {
        var result = gameService.getAllGames(QueryWrapper.builder()
                .wrapSort(pageable)
                .search(query)
                .build());
        return ResponseEntity.ok(new ResponseObject.Builder<List<GameResponse>>()
                .success(true)
                .code("SUCCESS")
                .unwrapPaginationWrapper(result)
                .message("Games retrieved successfully")
                .build());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get game by ID")
    public ResponseEntity<ResponseObject<GameResponse>> getGameById(@PathVariable Long id) {
        var game = gameService.getGameById(id);
        return ResponseEntity.ok(new ResponseObject.Builder<GameResponse>()
                .success(true)
                .code("SUCCESS")
                .content(game)
                .message("Get Success")
                .build());
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get games by user ID")
    public ResponseEntity<ResponseObject<List<GameResponse>>> getGameByUserId(@PathVariable Long userId) {
        var games = gameService.getGameByUserId(userId);
        return ResponseEntity.ok(new ResponseObject.Builder<List<GameResponse>>()
                .success(true)
                .code("SUCCESS")
                .content(games)
                .message("Get Success")
                .build());
    }

    @GetMapping("/search")
    @Operation(summary = "Search games by title")
    public ResponseEntity<ResponseObject<List<GameResponse>>> getGameByGameTitle(@RequestParam String title) {
        var games = gameService.getGameByGameTitle(title);
        return ResponseEntity.ok(new ResponseObject.Builder<List<GameResponse>>()
                .success(true)
                .code("SUCCESS")
                .content(games)
                .message("Get Success")
                .build());
    }

    @PostMapping
    @Operation(summary = "Create a new game", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<GameResponse>> createGame(@Valid @RequestBody GameRequest gameRequest) {
        var game = gameService.createGame(gameRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<GameResponse>()
                .success(true)
                .code("SUCCESS")
                .content(game)
                .message("Create Success")
                .build());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a game by ID", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<GameResponse>> updateGame(@PathVariable Long id, @Valid @RequestBody GameRequest gameRequest) {
        var game = gameService.updateGame(id, gameRequest);
        return ResponseEntity.ok(new ResponseObject.Builder<GameResponse>()
                .success(true)
                .code("SUCCESS")
                .content(game)
                .message("Update Success")
                .build());
    }

    @PatchMapping("/publish/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_HOC')")
    @Operation(summary = "Publish a game by ID", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<Void>> publishGame(@PathVariable Long id) {
        gameService.showGame(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Publish Success")
                .build());
    }

    @PatchMapping("/unpublish/{id}")
    @Operation(summary = "Unpublish a game by ID", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<Void>> unpublishGame(@PathVariable Long id) {
        gameService.hideGame(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Unpublish Success")
                .build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a game by ID", security = {@SecurityRequirement(name = "accessCookie")})
    public ResponseEntity<ResponseObject<Void>> deleteGame(@PathVariable Long id) {
        gameService.deleteGame(id);
        return ResponseEntity.ok(new ResponseObject.Builder<Void>()
                .success(true)
                .code("SUCCESS")
                .message("Delete Success")
                .build());
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "Get games by category")
    public ResponseEntity<ResponseObject<List<GameResponse>>> getGameByCategory(@PathVariable String category) {
        var games = gameService.getGameByCategory(category);
        return ResponseEntity.ok(new ResponseObject.Builder<List<GameResponse>>()
                .success(true)
                .code("SUCCESS")
                .content(games)
                .message("Get Success")
                .build());
    }
}