package com.app.hipertrofia.domain;

import com.app.hipertrofia.domain.enums.TipoPerfil;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import java.util.UUID;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "usuarios")
@Data // Lombok gera os Getters e Setters
@NoArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "senha_hash", nullable = false)
    private String senhaHash;

    @CreationTimestamp
    @Column(name = "data_criacao", updatable = false)
    private ZonedDateTime dataCriacao;

    @Enumerated(EnumType.STRING)
    private TipoPerfil perfil = TipoPerfil.ALUNO; // Padrão é sempre aluno

    // NOVO: Se for um aluno, aqui fica o UUID do Personal que cuida dele
    private UUID personalId;

    // --- GETTERS E SETTERS ---
    public TipoPerfil getPerfil() { return perfil; }
    public void setPerfil(TipoPerfil perfil) { this.perfil = perfil; }

    public UUID getPersonalId() { return personalId; }
    public void setPersonalId(UUID personalId) { this.personalId = personalId; }


}
