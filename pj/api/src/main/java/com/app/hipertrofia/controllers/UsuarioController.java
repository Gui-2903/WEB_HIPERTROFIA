package com.app.hipertrofia.controllers;

import com.app.hipertrofia.domain.Usuario;
import com.app.hipertrofia.dto.LoginRequestDTO;
import com.app.hipertrofia.repositories.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioRepository repository;

    public UsuarioController(UsuarioRepository repository) {
        this.repository = repository;
    }

    // --------------------------------------------------
    // ROTA 1: Criar Usuário
    // --------------------------------------------------
    @PostMapping
    public ResponseEntity<Usuario> criar(@RequestBody Usuario usuario) {
        return ResponseEntity.ok(repository.save(usuario));
    }

    // --------------------------------------------------
    // ROTA 2: Fazer Login (Devolve ID, Nome e Perfil)
    // --------------------------------------------------
    @PostMapping("/login")
    public ResponseEntity<?> fazerLogin(@RequestBody LoginRequestDTO dto) {
        return repository.findByEmail(dto.email())
                .filter(usuario -> usuario.getSenhaHash().equals(dto.senha()))
                .map(usuario -> {
                    return ResponseEntity.ok(Map.of(
                            "id", usuario.getId(),
                            "nome", usuario.getNome(),
                            "perfil", usuario.getPerfil()
                    ));
                })
                .orElseGet(() -> ResponseEntity.status(401).body(Map.of("erro", "Credenciais inválidas")));
    }

    // --------------------------------------------------
    // ROTA 3: Listar alunos de um Personal
    // --------------------------------------------------
    @GetMapping("/personal/{personalId}/alunos")
    public ResponseEntity<List<Usuario>> listarAlunosDoPersonal(@PathVariable UUID personalId) {
        List<Usuario> alunos = repository.findByPersonalId(personalId);
        return ResponseEntity.ok(alunos);
    }

    // --------------------------------------------------
    // ROTA 4: Vincular um Aluno a um Personal
    // --------------------------------------------------
    @PutMapping("/{alunoId}/vincular-personal/{personalId}")
    public ResponseEntity<Usuario> vincularAluno(@PathVariable UUID alunoId, @PathVariable UUID personalId) {
        return repository.findById(alunoId).map(aluno -> {
            aluno.setPersonalId(personalId);
            return ResponseEntity.ok(repository.save(aluno));
        }).orElse(ResponseEntity.notFound().build());
    }

}