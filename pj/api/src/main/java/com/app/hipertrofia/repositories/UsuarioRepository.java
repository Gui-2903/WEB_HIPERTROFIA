package com.app.hipertrofia.repositories;

import com.app.hipertrofia.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional; // <- Isso aqui é essencial para o Login
import java.util.UUID;

public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {

    // 1. Essencial para a Rota de Login funcionar
    Optional<Usuario> findByEmail(String email);

    // 2. Essencial para a Rota do Personal listar alunos
    List<Usuario> findByPersonalId(UUID personalId);
}