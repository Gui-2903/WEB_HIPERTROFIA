package com.app.hipertrofia.domain;

import jakarta.persistence.*;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "rotinas")
public class Rotina {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private UUID usuarioId;

    private String nome;

    // ESTA É A ÚNICA LISTA QUE DEVE EXISTIR AGORA:
    @OneToMany(mappedBy = "rotina", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemRotina> itens;

    // --- GETTERS E SETTERS ---

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUsuarioId() { return usuarioId; }
    public void setUsuarioId(UUID usuarioId) { this.usuarioId = usuarioId; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public List<ItemRotina> getItens() { return itens; }
    public void setItens(List<ItemRotina> itens) {
        this.itens = itens;
        // Essa mágica garante que cada item saiba a qual rotina ele pertence
        if (itens != null) {
            for (ItemRotina item : itens) {
                item.setRotina(this);
            }
        }
    }
}