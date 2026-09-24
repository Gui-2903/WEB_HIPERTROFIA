package com.app.hipertrofia.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record SessaoTreinoRequestDTO(
        UUID usuarioId, // Quem está treinando
        Integer rpeGeral, // Esforço de 1 a 10
        BigDecimal pesoCorporalDia,
        List<SerieRequestDTO> series // A lista de séries feitas no dia
) {}