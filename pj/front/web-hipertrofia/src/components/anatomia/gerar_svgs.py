#!/usr/bin/env python3
"""
Gera, a partir de UMA definição de formas:
  - corpo-frente.svg / corpo-costas.svg  (ativos standalone)
  - anatomia.js                          (dados consumidos pelo React)

Todas as formas são desenhadas para a METADE ESQUERDA do corpo (x <= 100)
e espelhadas em torno de x = 100 (viewBox 200 x 450).
"""
import json, sys, pathlib

OUT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "out")
OUT.mkdir(parents=True, exist_ok=True)


import re as _re
def sx(d, dx):
    """desloca em x todos os pontos de um path absoluto (M/C/L/Z)"""
    toks = _re.findall(r"[A-Za-z]|-?\d*\.?\d+", d)
    res, i = [], 0
    for t in toks:
        if t.isalpha():
            res.append(t); i = 0
        else:
            v = float(t) + (dx if i % 2 == 0 else 0)
            res.append(f"{v:g}" + ("," if i % 2 == 0 else " "))
            i += 1
    return "".join(res).replace(" Z", "Z").replace(" C", "C").replace(" L", "L").replace(" M", "M").strip()

# ---------------------------------------------------------------- partes fixas
CABECA_FRENTE = "M100,7 C110,7 116,15 116,26 C116,37 110,46 100,47 C90,46 84,37 84,26 C84,15 90,7 100,7 Z"
CABECA_COSTAS = CABECA_FRENTE
MAO = "M40,195 C38,205 37,214 38,222 C40,227 46,227 48,223 C50,226 54,225 54,220 C55,212 54,204 52,195 Z"
PE  = "M73,400 C73,414 70,428 68,436 C72,441 82,442 87,438 C88,430 85,414 84,400 Z"

# ---------------------------------------------------------------- FRENTE
# cada músculo: id, grupo (valor enviado a grupoFiltro), rótulo, partes (paths da metade esquerda)
FRENTE = [
    # -- decorativos (não clicáveis): dão contexto anatômico
    dict(id="pescoco", grupo=None, label="Pescoço", interativo=False,
         partes=["M100,46 L91,46 C91,54 93,60 96,65 L100,72 Z"]),
    dict(id="antebraco", grupo=None, label="Antebraço", interativo=False,
         partes=["M44,149 C49,150 55,150 59,149 C59,162 55,180 51,195 L40,194 C41,178 42,162 44,149 Z"]),
    dict(id="obliquos", grupo=None, label="Oblíquos", interativo=False,
         partes=["M86,120 C79,119 73,121 69,126 C70,146 72,166 75,188 L86,186 C86.6,160 86.6,140 86,120 Z"]),
    dict(id="quadril", grupo=None, label="Quadril", interativo=False,
         partes=["M86,187 C92,188 96,191 99.5,195 L99.5,230 C90,228 80,221 73,214 C73,204 78,194 86,187 Z"]),
    dict(id="joelho", grupo=None, label="Joelho", interativo=False,
         partes=["M72,320 C78,317 86,317 89,320 C91,326 90,332 88,337 C82,339 76,339 71,337 C69,331 70,325 72,320 Z"]),

    # -- clicáveis
    dict(id="trapezio", grupo="Trapézio", label="Trapézio", interativo=True,
         partes=["M95,57 C88,62 78,66 65,71 C68,75 75,77 81,76 C88,74 94,70 97,66 C96,62 95,59 95,57 Z"]),
    dict(id="deltoide-anterior", grupo="Deltoides", label="Deltoide anterior", interativo=True,
         linhas=['M60,76 C55,86 53,97 55,107'],
         partes=["M66,72 C58,71 50,78 48,90 C47,98 50,105 54,110 C58,104 62,96 65,88 C67,82 68,77 70,74 C69,73 67,72 66,72 Z"]),
    dict(id="peitoral", grupo="Peitoral", label="Peitoral", interativo=True,
         partes=["M71,77 C80,75 90,78 99.5,82 L99.5,112 C90,118 77,116 69,108 C65,98 66,86 71,77 Z"],
         linhas=["M99.5,84 L99.5,112"]),
    dict(id="biceps", grupo="Bíceps", label="Bíceps", interativo=True,
         partes=[sx("M53,111 C58,109 62,113 62,121 C62,130 58,139 54,146 C50,146 45,145 42,142 C42,130 46,119 53,111 Z", 3)],
         linhas=[sx("M52,118 C54,128 54,136 52,143", 3)]),
    dict(id="abdomen", grupo="Abdômen", label="Abdômen", interativo=True,
         partes=[
             "M89,118 C92,116.5 96,117 99.5,117.5 L99.5,132 L88,132 C88,127 88,122 89,118 Z",
             "M88,134 L99.5,134 L99.5,149 L87,149 C87,143 87.5,138 88,134 Z",
             "M87,151 L99.5,151 L99.5,166 L87.5,166 C87,160 87,155 87,151 Z",
             "M88,168 L99.5,168 L99.5,186 C94,186 90,182 89,177 C88,173 88,170 88,168 Z",
         ]),
    dict(id="quadriceps", grupo="Quadríceps", label="Quadríceps", interativo=True,
         linhas=['M70,240 C68,262 69,286 74,308'],
         partes=[
             # vasto lateral
             "M69,227 C73,228 77,231 80,235 C77,255 77,285 81,313 C79,317 76,319 73,319 C66,298 63,268 65,248 C66,240 67,233 69,227 Z",
             # reto femoral
             "M81,236 C88,236 95,238 99.5,240 L99.5,261 C96,262 93,268 92,273 C90,288 87,304 83,314 L82,313 C79,290 79,258 81,236 Z",
             # vasto medial
             "M99.5,264 C99.5,284 95,302 88,319 C85,320 83,318 83.5,316 C87,306 91,290 92.5,274 C94,268 96,265 99.5,264 Z",
         ]),
    dict(id="panturrilha-anterior", grupo="Panturrilhas", label="Panturrilha (anterior)", interativo=True,
         partes=["M69,340 C66,354 67,376 72,399 L84,399 C88,380 89,360 89,342 C85,339 82,341 79,340 C75,338 72,338 69,340 Z"],
         linhas=["M79,346 C79,366 78.5,384 78,398"]),
]

# ---------------------------------------------------------------- COSTAS
COSTAS = [
    dict(id="pescoco", grupo=None, label="Pescoço", interativo=False,
         partes=["M100,46 L92,46 C92,52 93,56 95,60 L100,66 Z"]),
    dict(id="antebraco", grupo=None, label="Antebraço", interativo=False,
         partes=["M44,149 C49,150 55,150 59,149 C59,162 55,180 51,195 L40,194 C41,178 42,162 44,149 Z"]),
    dict(id="joelho", grupo=None, label="Joelho", interativo=False,
         partes=["M74,319 C79,317 85,317 88,319 C90,325 89,331 87,336 C82,338 76,338 72,336 C70,330 71,324 74,319 Z"]),

    dict(id="trapezio", grupo="Trapézio", label="Trapézio", interativo=True,
         linhas=['M99,66 C92,76 86,86 82,96'],
         partes=["M100,52 C95,56 88,60 80,64 C74,67 68,70 63,73 C67,80 74,88 81,96 C88,112 95,128 100,140 Z"]),
    dict(id="deltoide-posterior", grupo="Deltoides", label="Deltoide posterior", interativo=True,
         linhas=['M57,76 C52,86 51,97 54,107'],
         partes=["M63,73 C56,72 50,78 48,90 C47,98 50,105 54,110 C58,104 62,96 64,88 C65,82 65,77 63,73 Z"]),
    dict(id="dorsais", grupo="Costas", label="Dorsais (costas)", interativo=True,
         linhas=['M99,152 C90,154 82,162 76,178'],
         partes=[
             # infraespinhal / redondo (região da escápula)
             "M65,86 C71,90 77,95 81,101 C80,108 76,114 70,114 C67,108 65,98 65,86 Z",
             # latíssimo do dorso
             "M68,119 C74,121 80,117 84,109 C90,121 96,133 100,143 L100,165 C92,167 84,174 78,185 C76,167 72,141 68,119 Z",
         ]),
    dict(id="lombares", grupo="Lombares", label="Lombares", interativo=True,
         partes=["M100,167 C92,169 86,175 82,183 C84,195 92,203 100,207 Z"]),
    dict(id="gluteos", grupo="Glúteos", label="Glúteos", interativo=True,
         linhas=['M98,214 C90,214 82,221 78,233'],
         partes=["M100,209 C90,204 80,206 73,214 C69,227 76,243 90,247 C96,247 100,243 100,239 Z"]),
    dict(id="triceps", grupo="Tríceps", label="Tríceps", interativo=True,
         partes=[
             sx("M48,111 C53,109 57,112 58,117 C58,129 55,139 51,146 C47,146 44,144 42,142 C42,130 44,119 48,111 Z", 3),
             sx("M59,113 C61,113 63,115 63,121 C63,131 59,140 55,146 L52,146 C56,139 59,129 59,117 Z", 3),
         ]),
    dict(id="isquiotibiais", grupo="Isquiotibiais", label="Isquiotibiais", interativo=True,
         linhas=['M78,262 C77,280 79,298 82,312'],
         partes=[
             # bíceps femoral (lateral)
             "M71,250 C67,274 69,300 76,318 C80,318 84,316 86,314 C86,294 85,270 86,252 C80,254 75,254 71,250 Z",
             # semitendíneo / semimembranáceo (medial)
             "M88,252 C92,254 96,254 99.5,252 C99.5,276 95,298 88,318 C87,316 86.6,315 86.6,314 C87,294 88,272 88,252 Z",
         ]),
    dict(id="panturrilha-posterior", grupo="Panturrilhas", label="Panturrilha (posterior)", interativo=True,
         partes=[
             # gastrocnêmio lateral
             "M69,340 C74,336 79.5,338 79.5,345 C79.5,360 79,375 78,390 C73,382 67,366 67.5,352 C67.5,346 68,342 69,340 Z",
             # gastrocnêmio medial
             "M81,345 C81,338 86,336 89,341 C90,358 87,378 80.5,394 C79.5,378 80.5,360 81,345 Z",
             # tendão de Aquiles / sóleo
             "M74,383 C76,389 77.5,392 78.5,396 L78.5,402 L82.5,402 L82.5,396 C83.5,392 85,388 86,382 C84,388 82,392 80.5,396 C79,392 76,388 74,383 Z",
         ]),
]

# ---------------------------------------------------------------- geração
COR = dict(musculo="#64798f", linha="#ffffff", ativo="#e5383b", contorno="#cfd7e2")
ESPELHO = 'transform="translate(200 0) scale(-1 1)"'


def svg_corpo(nome, cabeca, musculos):
    p = []
    p.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 450" role="img" aria-label="Mapa anatômico — {nome}">')
    p.append(f'  <g id="silhueta" fill="#ffffff" stroke="{COR["contorno"]}" stroke-width="1" stroke-linejoin="round">')
    for side in ("", ESPELHO):
        p.append(f'    <path d="{cabeca}" {side}/>' if side else f'    <path d="{cabeca}"/>')
    p.append("  </g>")
    p.append(f'  <g id="musculos" fill="{COR["musculo"]}" stroke="{COR["linha"]}" stroke-width="1.2" stroke-linejoin="round">')
    for m in musculos:
        p.append(f'    <g id="{m["id"]}" data-grupo="{m["grupo"] or ""}">')
        for d in m["partes"]:
            p.append(f'      <path d="{d}"/>')
            p.append(f'      <path d="{d}" {ESPELHO}/>')
        for d in m.get("linhas", []):
            p.append(f'      <path d="{d}" fill="none" stroke="{COR["linha"]}" stroke-width="0.8" opacity="0.7"/>')
            p.append(f'      <path d="{d}" fill="none" stroke="{COR["linha"]}" stroke-width="0.8" opacity="0.7" {ESPELHO}/>')
        p.append("    </g>")
    p.append("  </g>")
    p.append(f'  <g id="extremidades" fill="#ffffff" stroke="{COR["contorno"]}" stroke-width="1" stroke-linejoin="round">')
    for d in (MAO, PE):
        p.append(f'    <path d="{d}"/>')
        p.append(f'    <path d="{d}" {ESPELHO}/>')
    p.append("  </g>")
    p.append("</svg>")
    return "\n".join(p)


def render(nome, arquivo, cabeca, musculos, destaque=None):
    svg = svg_corpo(nome, cabeca, musculos)
    (OUT / arquivo).write_text(svg, encoding="utf-8")
    return svg


render("vista frontal", "corpo-frente.svg", CABECA_FRENTE, FRENTE)
render("vista traseira", "corpo-costas.svg", CABECA_COSTAS, COSTAS)

# dados para o React
dados = dict(
    cores=COR,
    silhueta=dict(cabeca=CABECA_FRENTE, mao=MAO, pe=PE),
    frente=FRENTE,
    costas=COSTAS,
)
js = (
    "// GERADO por gerar_svgs.py — edite as formas lá e rode: python3 gerar_svgs.py saida/ (ou edite direto aqui).\n"
    "// Todas as formas descrevem a metade esquerda do corpo (x <= 100); o componente espelha em x = 200 - x.\n"
    f"export const SILHUETA = {json.dumps(dados['silhueta'], ensure_ascii=False, indent=2)};\n\n"
    f"export const MUSCULOS_FRENTE = {json.dumps(FRENTE, ensure_ascii=False, indent=2)};\n\n"
    f"export const MUSCULOS_COSTAS = {json.dumps(COSTAS, ensure_ascii=False, indent=2)};\n"
)
(OUT / "anatomia.js").write_text(js, encoding="utf-8")
print("ok")
