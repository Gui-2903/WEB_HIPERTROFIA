package com.app.hipertrofia.repositories;

import com.app.hipertrofia.domain.SessaoTreino;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SessaoTreinoRepository extends JpaRepository<SessaoTreino, UUID> {
    List<SessaoTreino> findByUsuarioIdOrderByDataInicioDesc(UUID usuarioId);
}