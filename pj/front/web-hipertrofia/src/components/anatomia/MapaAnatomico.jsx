import { Fragment, useMemo, useState } from 'react';
import { MUSCULOS_FRENTE, MUSCULOS_COSTAS, SILHUETA } from './anatomia';
import './MapaAnatomico.css';

/** Espelha uma forma da metade esquerda para a metade direita (viewBox 200 de largura). */
const ESPELHO = 'translate(200 0) scale(-1 1)';

/** Lista de grupos clicáveis, na ordem em que aparecem no mapa (útil para chips/filtros). */
export const GRUPOS_MUSCULARES = [
  ...new Set(
    [...MUSCULOS_FRENTE, ...MUSCULOS_COSTAS]
      .filter((m) => m.interativo)
      .map((m) => m.grupo),
  ),
];

function Musculo({ musculo, nomeGrupo, ativo, onSelecionar, onHover }) {
  const { id, label, partes, linhas = [], interativo } = musculo;

  const classe = [
    'mapa-anat__musculo',
    interativo ? 'mapa-anat__musculo--interativo' : 'mapa-anat__musculo--decorativo',
    ativo && 'mapa-anat__musculo--ativo',
  ]
    .filter(Boolean)
    .join(' ');

  const acessibilidade = interativo
    ? {
        role: 'button',
        tabIndex: 0,
        'aria-label': label,
        'aria-pressed': ativo,
        onClick: () => onSelecionar(nomeGrupo),
        onKeyDown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelecionar(nomeGrupo);
          }
        },
        onMouseEnter: () => onHover(label),
        onMouseLeave: () => onHover(null),
        onFocus: () => onHover(label),
        onBlur: () => onHover(null),
      }
    : { 'aria-hidden': true };

  return (
    <g id={`musculo-${id}`} data-grupo={nomeGrupo ?? undefined} className={classe} {...acessibilidade}>
      {partes.map((d, i) => (
        <Fragment key={i}>
          <path d={d} />
          <path d={d} transform={ESPELHO} />
        </Fragment>
      ))}
      {linhas.map((d, i) => (
        <Fragment key={`l${i}`}>
          <path d={d} className="mapa-anat__fibra" />
          <path d={d} className="mapa-anat__fibra" transform={ESPELHO} />
        </Fragment>
      ))}
    </g>
  );
}

/**
 * Mapa anatômico interativo (frente / costas).
 *
 * Props
 * - grupoFiltro        grupo atualmente selecionado (ex.: 'Peitoral' ou 'Todos')
 * - onSelecionarGrupo  recebe o nome do grupo clicado — normalmente `setGrupoFiltro`
 * - visaoFrontal       true = frente, false = costas
 * - valorTodos         valor "sem filtro"; clicar no grupo já ativo volta para ele (padrão 'Todos')
 * - aliasGrupos        renomeia grupos do SVG para o vocabulário dos seus dados,
 *                      ex.: { Deltoides: 'Ombros', Costas: 'Dorsais' }
 */
export default function MapaAnatomico({
  grupoFiltro,
  onSelecionarGrupo,
  visaoFrontal = true,
  valorTodos = 'Todos',
  aliasGrupos = {},
  className = '',
}) {
  const [hover, setHover] = useState(null);

  const musculos = visaoFrontal ? MUSCULOS_FRENTE : MUSCULOS_COSTAS;
  const nomeDoGrupo = (grupo) => (grupo ? aliasGrupos[grupo] ?? grupo : null);

  const selecionar = (nomeGrupo) =>
    onSelecionarGrupo(nomeGrupo === grupoFiltro ? valorTodos : nomeGrupo);

  const legenda = useMemo(() => {
    if (hover) return hover;
    if (grupoFiltro && grupoFiltro !== valorTodos) return grupoFiltro;
    return 'Toque em um músculo para filtrar';
  }, [hover, grupoFiltro, valorTodos]);

  return (
    <figure className={`mapa-anat ${className}`.trim()}>
      <svg
        key={visaoFrontal ? 'frente' : 'costas'}
        className="mapa-anat__svg"
        viewBox="0 0 200 450"
        role="group"
        aria-label={visaoFrontal ? 'Mapa anatômico, vista frontal' : 'Mapa anatômico, vista traseira'}
      >
        <g className="mapa-anat__extremidade">
          <path d={SILHUETA.cabeca} />
        </g>

        {musculos.map((m) => {
          const nomeGrupo = nomeDoGrupo(m.grupo);
          return (
            <Musculo
              key={m.id}
              musculo={m}
              nomeGrupo={nomeGrupo}
              ativo={Boolean(nomeGrupo) && nomeGrupo === grupoFiltro}
              onSelecionar={selecionar}
              onHover={setHover}
            />
          );
        })}

        <g className="mapa-anat__extremidade">
          {[SILHUETA.mao, SILHUETA.pe].map((d, i) => (
            <Fragment key={i}>
              <path d={d} />
              <path d={d} transform={ESPELHO} />
            </Fragment>
          ))}
        </g>
      </svg>

      <figcaption className="mapa-anat__legenda" aria-live="polite">
        {legenda}
      </figcaption>
    </figure>
  );
}
