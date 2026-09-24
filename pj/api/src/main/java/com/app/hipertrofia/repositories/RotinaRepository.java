package com.app.hipertrofia.repositories;

import com.app.hipertrofia.domain.Rotina;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface RotinaRepository extends JpaRepository<Rotina, UUID> {
    List<Rotina> findByUsuarioId(UUID usuarioId);
}