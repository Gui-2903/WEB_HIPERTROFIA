package com.app.hipertrofia.domain;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "exercicios_catalogo")
public class ExercicioCatalogo {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String nome;

    // O React usa esse campo exato para o Filtro do Boneco!
    private String grupoMuscular;

    // Getters e Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getGrupoMuscular() { return grupoMuscular; }
    public void setGrupoMuscular(String grupoMuscular) { this.grupoMuscular = grupoMuscular; }
}