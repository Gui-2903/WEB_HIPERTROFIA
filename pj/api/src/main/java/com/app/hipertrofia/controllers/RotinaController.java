package com.app.hipertrofia.controllers;

import com.app.hipertrofia.domain.Rotina;
import com.app.hipertrofia.repositories.RotinaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/rotinas")
@CrossOrigin(origins = "*")
public class RotinaController {

    private final RotinaRepository repository;

    public RotinaController(RotinaRepository repository) {
        this.repository = repository;
    }

    // Busca todas as rotinas do usuário (Vai ser usado na Tela Home)
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Rotina>> buscarPorUsuario(@PathVariable UUID usuarioId) {
        return ResponseEntity.ok(repository.findByUsuarioId(usuarioId));
    }

    // Cria uma nova rotina
    @PostMapping
    public ResponseEntity<Rotina> criarRotina(@RequestBody Rotina rotina) {
        return ResponseEntity.ok(repository.save(rotina));
    }
}