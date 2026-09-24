package com.app.hipertrofia.repositories;

import com.app.hipertrofia.domain.ExercicioCatalogo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ExercicioCatalogoRepository extends JpaRepository<ExercicioCatalogo, UUID> {
}