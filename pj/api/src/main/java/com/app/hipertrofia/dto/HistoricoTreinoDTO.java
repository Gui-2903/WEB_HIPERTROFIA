package com.app.hipertrofia.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record HistoricoTreinoDTO(
        UUID sessaoId,
        OffsetDateTime data,
        BigDecimal tonelagemTotal,
        Integer rpe
) {}