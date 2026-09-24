package com.app.hipertrofia.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record SerieRequestDTO(
        UUID exercicioId,
        String tipoSerie, // AQUECIMENTO, TRABALHO, FALHA
        BigDecimal peso,
        Integer repeticoes,
        Integer rir,
        Integer tempoDescansoSegundos
) {}