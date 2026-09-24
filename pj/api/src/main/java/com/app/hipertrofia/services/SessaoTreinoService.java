package com.app.hipertrofia.services;

import com.app.hipertrofia.domain.*;
import com.app.hipertrofia.domain.enums.TipoSerieEnum;
import com.app.hipertrofia.dto.SessaoTreinoRequestDTO;
import com.app.hipertrofia.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.app.hipertrofia.dto.HistoricoTreinoDTO;
import java.util.List;
import com.app.hipertrofia.dto.UltimaCargaDTO;

import java.util.stream.Collectors;

@Service
public class SessaoTreinoService {

    private final SessaoTreinoRepository sessaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ExercicioCatalogoRepository exercicioRepository;

    // O Spring injeta os repositórios automaticamente aqui
    public SessaoTreinoService(SessaoTreinoRepository sessaoRepository,
                               UsuarioRepository usuarioRepository,
                               ExercicioCatalogoRepository exercicioRepository) {
        this.sessaoRepository = sessaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.exercicioRepository = exercicioRepository;
    }

    @Transactional // Garante que se uma série der erro, o treino todo é cancelado (Rollback)
    public SessaoTreino salvarTreino(SessaoTreinoRequestDTO dto) {

        // 1. Busca o usuário no banco
        Usuario usuario = usuarioRepository.findById(dto.usuarioId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));

        // 2. Monta a Sessão principal
        SessaoTreino sessao = new SessaoTreino();
        sessao.setUsuario(usuario);
        sessao.setRpeGeral(dto.rpeGeral());
        sessao.setPesoCorporalDia(dto.pesoCorporalDia());

        // 3. Monta as Séries e amarra na Sessão
        var seriesExecutadas = dto.series().stream().map(serieDto -> {
            ExercicioCatalogo exercicio = exercicioRepository.findById(serieDto.exercicioId())
                    .orElseThrow(() -> new RuntimeException("Exercício não encontrado!"));

            SerieExecutada serie = new SerieExecutada();
            serie.setSessaoTreino(sessao);
            serie.setExercicio(exercicio);
            serie.setTipoSerie(TipoSerieEnum.valueOf(serieDto.tipoSerie()));
            serie.setPeso(serieDto.peso());
            serie.setRepeticoes(serieDto.repeticoes());
            serie.setRepeticoesNaReserva(serieDto.rir());
            serie.setTempoDescansoSegundos(serieDto.tempoDescansoSegundos());

            return serie;
        }).collect(Collectors.toList());

        sessao.setSeries(seriesExecutadas);

        // 4. Salva tudo de uma vez (O CascadeType.ALL faz a mágica de salvar as séries junto)
        return sessaoRepository.save(sessao);
    }

    public List<HistoricoTreinoDTO> buscarHistorico(java.util.UUID usuarioId) {
        return sessaoRepository.findByUsuarioIdOrderByDataInicioDesc(usuarioId).stream()
                .map(sessao -> {
                    // Soma (Peso x Repetições) de todas as séries de Trabalho
                    double tonelagem = sessao.getSeries().stream()
                            .filter(serie -> serie.getTipoSerie().name().equals("TRABALHO"))
                            .mapToDouble(serie -> serie.getPeso().doubleValue() * serie.getRepeticoes())
                            .sum();

                    return new HistoricoTreinoDTO(
                            sessao.getId(),
                            sessao.getDataInicio().toOffsetDateTime(),
                            java.math.BigDecimal.valueOf(tonelagem),
                            sessao.getRpeGeral()
                    );
                }).toList();
    }

    public List<UltimaCargaDTO> buscarUltimaCargaExercicio(java.util.UUID usuarioId, java.util.UUID exercicioId) {
        var sessoes = sessaoRepository.findByUsuarioIdOrderByDataInicioDesc(usuarioId);

        for (var sessao : sessoes) {
            // Filtra e coleta todas as séries deste exercício na sessão mais recente
            List<UltimaCargaDTO> ultimasSeries = sessao.getSeries().stream()
                    .filter(serie -> serie.getExercicio().getId().equals(exercicioId) &&
                            serie.getTipoSerie().name().equals("TRABALHO"))
                    .map(serie -> new UltimaCargaDTO(serie.getPeso(), serie.getRepeticoes()))
                    .toList();

            // Se encontrou as séries neste treino, devolve a lista toda e para a busca
            if (!ultimasSeries.isEmpty()) {
                return ultimasSeries;
            }
        }
        return java.util.Collections.emptyList(); // Retorna vazio se nunca treinou
    }
}