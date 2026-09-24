package com.app.hipertrofia.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "sessoes_treino")
@Data
@NoArgsConstructor
public class SessaoTreino {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @CreationTimestamp
    @Column(name = "data_inicio", nullable = false, updatable = false)
    private ZonedDateTime dataInicio;

    @Column(name = "data_fim")
    private ZonedDateTime dataFim;

    @Column(name = "rpe_geral")
    private Integer rpeGeral;

    @Column(name = "peso_corporal_dia", precision = 5, scale = 2)
    private BigDecimal pesoCorporalDia;

    // Relacionamento 1:N com as séries (Se o treino for apagado, as séries somem)
    @OneToMany(mappedBy = "sessaoTreino", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SerieExecutada> series;
}