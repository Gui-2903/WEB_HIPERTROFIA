package com.app.hipertrofia.controllers;

import com.app.hipertrofia.domain.SessaoTreino;
import com.app.hipertrofia.dto.HistoricoTreinoDTO;
import com.app.hipertrofia.dto.SessaoTreinoRequestDTO;
import com.app.hipertrofia.services.SessaoTreinoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;
import com.app.hipertrofia.dto.UltimaCargaDTO;

@RestController
@RequestMapping("/api/treinos")
@CrossOrigin(origins = "*")
public class SessaoTreinoController {

    private final SessaoTreinoService service;

    public SessaoTreinoController(SessaoTreinoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<SessaoTreino> registrarTreino(@RequestBody SessaoTreinoRequestDTO dto) {
        SessaoTreino sessaoSalva = service.salvarTreino(dto);
        return ResponseEntity.ok(sessaoSalva);
    }
    @GetMapping("/historico/{usuarioId}")
    public ResponseEntity<List<HistoricoTreinoDTO>> listarHistorico(@PathVariable UUID usuarioId) {
        return ResponseEntity.ok(service.buscarHistorico(usuarioId));
    }

    @GetMapping("/ultima-carga/{usuarioId}/{exercicioId}")
    public ResponseEntity<List<UltimaCargaDTO>> obterUltimaCarga(
            @PathVariable java.util.UUID usuarioId,
            @PathVariable java.util.UUID exercicioId) {

        List<UltimaCargaDTO> ultimasCargas = service.buscarUltimaCargaExercicio(usuarioId, exercicioId);

        if (!ultimasCargas.isEmpty()) {
            return ResponseEntity.ok(ultimasCargas);
        }
        return ResponseEntity.noContent().build();
    }
}