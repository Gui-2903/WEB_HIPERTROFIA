package com.app.hipertrofia.config;

import com.app.hipertrofia.domain.ExercicioCatalogo;
import com.app.hipertrofia.repositories.ExercicioCatalogoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeeder implements CommandLineRunner {

    private final ExercicioCatalogoRepository repository;

    public DataSeeder(ExercicioCatalogoRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Em vez de checar se é 0, vamos ver se falta o Supino (sinal de que o catálogo não foi injetado)
        boolean catalogoVazio = repository.findAll().stream()
                .noneMatch(ex -> "Supino Reto com Barra".equals(ex.getNome()));

        if (catalogoVazio) {
            ExercicioCatalogo ex1 = new ExercicioCatalogo();
            ex1.setNome("Supino Reto com Barra"); ex1.setGrupoMuscular("Peitoral");

            ExercicioCatalogo ex2 = new ExercicioCatalogo();
            ex2.setNome("Crucifixo na Máquina"); ex2.setGrupoMuscular("Peitoral");

            ExercicioCatalogo ex3 = new ExercicioCatalogo();
            ex3.setNome("Puxada Alta (Frente)"); ex3.setGrupoMuscular("Costas");

            ExercicioCatalogo ex4 = new ExercicioCatalogo();
            ex4.setNome("Remada Curvada"); ex4.setGrupoMuscular("Costas");

            ExercicioCatalogo ex5 = new ExercicioCatalogo();
            ex5.setNome("Agachamento Livre"); ex5.setGrupoMuscular("Pernas");

            ExercicioCatalogo ex6 = new ExercicioCatalogo();
            ex6.setNome("Leg Press 45"); ex6.setGrupoMuscular("Pernas");

            ExercicioCatalogo ex7 = new ExercicioCatalogo();
            ex7.setNome("Rosca Direta"); ex7.setGrupoMuscular("Braços");

            ExercicioCatalogo ex8 = new ExercicioCatalogo();
            ex8.setNome("Tríceps Corda"); ex8.setGrupoMuscular("Braços");

            ExercicioCatalogo ex9 = new ExercicioCatalogo();
            ex9.setNome("Prancha Abdominal"); ex9.setGrupoMuscular("Core");

            repository.saveAll(java.util.List.of(ex1, ex2, ex3, ex4, ex5, ex6, ex7, ex8, ex9));
            System.out.println("✅ BANCO POPULADO COM EXERCÍCIOS PADRÃO DO BONECO!");
        }
    }
}