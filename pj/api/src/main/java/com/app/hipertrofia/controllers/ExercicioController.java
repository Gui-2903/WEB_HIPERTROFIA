package com.app.hipertrofia.controllers;

import com.app.hipertrofia.domain.ExercicioCatalogo;
import com.app.hipertrofia.repositories.ExercicioCatalogoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exercicios")
@CrossOrigin(origins = "*")
public class ExercicioController {

    private final ExercicioCatalogoRepository repository;

    public ExercicioController(ExercicioCatalogoRepository repository) {
        this.repository = repository;
    }

    // 1. ROTA QUE O BONECO DO REACT USA PARA LISTAR TUDO
    @GetMapping
    public ResponseEntity<List<ExercicioCatalogo>> listarTodos() {
        return ResponseEntity.ok(repository.findAll());
    }

    // 2. A ROTA NOVA! Salva o exercício criado manualmente direto no banco
    @PostMapping
    public ResponseEntity<ExercicioCatalogo> criar(@RequestBody ExercicioCatalogo exercicio) {
        ExercicioCatalogo salvo = repository.save(exercicio);
        return ResponseEntity.ok(salvo);
    }
}