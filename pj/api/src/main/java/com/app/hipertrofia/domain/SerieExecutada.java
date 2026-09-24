package com.app.hipertrofia.domain;

import com.app.hipertrofia.domain.enums.TipoSerieEnum;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "series_executadas")
@Data
@NoArgsConstructor
public class SerieExecutada {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sessao_treino_id", nullable = false)
    @JsonIgnoreProperties("series") // <--- nova ESTA LINHA!
    private SessaoTreino sessaoTreino;

    // Qual exercício foi feito
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercicio_id", nullable = false)
    private ExercicioCatalogo exercicio;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_serie", nullable = false)
    private TipoSerieEnum tipoSerie = TipoSerieEnum.TRABALHO;

    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal peso;

    @Column(nullable = false)
    private Integer repeticoes;

    @Column(name = "rir")
    private Integer repeticoesNaReserva;

    @Column(name = "tempo_descanso_segundos")
    private Integer tempoDescansoSegundos;

    @CreationTimestamp
    @Column(name = "data_registro", updatable = false)
    private ZonedDateTime dataRegistro;
}