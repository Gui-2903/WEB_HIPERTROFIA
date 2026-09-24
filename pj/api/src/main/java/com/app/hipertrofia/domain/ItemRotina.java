package com.app.hipertrofia.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "itens_rotina")
public class ItemRotina {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    // A qual rotina este item pertence
    @ManyToOne
    @JoinColumn(name = "rotina_id")
    @JsonIgnore // Impede loop infinito ao devolver o JSON
    private Rotina rotina;

    // Qual é o exercício do catálogo
    @ManyToOne
    @JoinColumn(name = "exercicio_id")
    private ExercicioCatalogo exercicio;

    // NOVO: A ordem que vai aparecer na tela (1, 2, 3...)
    private Integer ordem;

    // NOVO: O famoso campo de OBS para o Personal!
    private String observacaoPersonal;

    // Getters e Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Rotina getRotina() { return rotina; }
    public void setRotina(Rotina rotina) { this.rotina = rotina; }

    public ExercicioCatalogo getExercicio() { return exercicio; }
    public void setExercicio(ExercicioCatalogo exercicio) { this.exercicio = exercicio; }

    public Integer getOrdem() { return ordem; }
    public void setOrdem(Integer ordem) { this.ordem = ordem; }

    public String getObservacaoPersonal() { return observacaoPersonal; }
    public void setObservacaoPersonal(String observacaoPersonal) { this.observacaoPersonal = observacaoPersonal; }
}