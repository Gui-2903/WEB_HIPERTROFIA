// GERADO por gerar_svgs.py — edite as formas lá e rode: python3 gerar_svgs.py saida/ (ou edite direto aqui).
// Todas as formas descrevem a metade esquerda do corpo (x <= 100); o componente espelha em x = 200 - x.
export const SILHUETA = {
  "cabeca": "M100,7 C110,7 116,15 116,26 C116,37 110,46 100,47 C90,46 84,37 84,26 C84,15 90,7 100,7 Z",
  "mao": "M40,195 C38,205 37,214 38,222 C40,227 46,227 48,223 C50,226 54,225 54,220 C55,212 54,204 52,195 Z",
  "pe": "M73,400 C73,414 70,428 68,436 C72,441 82,442 87,438 C88,430 85,414 84,400 Z"
};

export const MUSCULOS_FRENTE = [
  {
    "id": "pescoco",
    "grupo": null,
    "label": "Pescoço",
    "interativo": false,
    "partes": [
      "M100,46 L91,46 C91,54 93,60 96,65 L100,72 Z"
    ]
  },
  {
    "id": "antebraco",
    "grupo": null,
    "label": "Antebraço",
    "interativo": false,
    "partes": [
      "M44,149 C49,150 55,150 59,149 C59,162 55,180 51,195 L40,194 C41,178 42,162 44,149 Z"
    ]
  },
  {
    "id": "obliquos",
    "grupo": null,
    "label": "Oblíquos",
    "interativo": false,
    "partes": [
      "M86,120 C79,119 73,121 69,126 C70,146 72,166 75,188 L86,186 C86.6,160 86.6,140 86,120 Z"
    ]
  },
  {
    "id": "quadril",
    "grupo": null,
    "label": "Quadril",
    "interativo": false,
    "partes": [
      "M86,187 C92,188 96,191 99.5,195 L99.5,230 C90,228 80,221 73,214 C73,204 78,194 86,187 Z"
    ]
  },
  {
    "id": "joelho",
    "grupo": null,
    "label": "Joelho",
    "interativo": false,
    "partes": [
      "M72,320 C78,317 86,317 89,320 C91,326 90,332 88,337 C82,339 76,339 71,337 C69,331 70,325 72,320 Z"
    ]
  },
  {
    "id": "trapezio",
    "grupo": "Trapézio",
    "label": "Trapézio",
    "interativo": true,
    "partes": [
      "M95,57 C88,62 78,66 65,71 C68,75 75,77 81,76 C88,74 94,70 97,66 C96,62 95,59 95,57 Z"
    ]
  },
  {
    "id": "deltoide-anterior",
    "grupo": "Deltoides",
    "label": "Deltoide anterior",
    "interativo": true,
    "linhas": [
      "M60,76 C55,86 53,97 55,107"
    ],
    "partes": [
      "M66,72 C58,71 50,78 48,90 C47,98 50,105 54,110 C58,104 62,96 65,88 C67,82 68,77 70,74 C69,73 67,72 66,72 Z"
    ]
  },
  {
    "id": "peitoral",
    "grupo": "Peitoral",
    "label": "Peitoral",
    "interativo": true,
    "partes": [
      "M71,77 C80,75 90,78 99.5,82 L99.5,112 C90,118 77,116 69,108 C65,98 66,86 71,77 Z"
    ],
    "linhas": [
      "M99.5,84 L99.5,112"
    ]
  },
  {
    "id": "biceps",
    "grupo": "Bíceps",
    "label": "Bíceps",
    "interativo": true,
    "partes": [
      "M56,111C61,109 65,113 65,121C65,130 61,139 57,146C53,146 48,145 45,142C45,130 49,119 56,111Z"
    ],
    "linhas": [
      "M55,118C57,128 57,136 55,143"
    ]
  },
  {
    "id": "abdomen",
    "grupo": "Abdômen",
    "label": "Abdômen",
    "interativo": true,
    "partes": [
      "M89,118 C92,116.5 96,117 99.5,117.5 L99.5,132 L88,132 C88,127 88,122 89,118 Z",
      "M88,134 L99.5,134 L99.5,149 L87,149 C87,143 87.5,138 88,134 Z",
      "M87,151 L99.5,151 L99.5,166 L87.5,166 C87,160 87,155 87,151 Z",
      "M88,168 L99.5,168 L99.5,186 C94,186 90,182 89,177 C88,173 88,170 88,168 Z"
    ]
  },
  {
    "id": "quadriceps",
    "grupo": "Quadríceps",
    "label": "Quadríceps",
    "interativo": true,
    "linhas": [
      "M70,240 C68,262 69,286 74,308"
    ],
    "partes": [
      "M69,227 C73,228 77,231 80,235 C77,255 77,285 81,313 C79,317 76,319 73,319 C66,298 63,268 65,248 C66,240 67,233 69,227 Z",
      "M81,236 C88,236 95,238 99.5,240 L99.5,261 C96,262 93,268 92,273 C90,288 87,304 83,314 L82,313 C79,290 79,258 81,236 Z",
      "M99.5,264 C99.5,284 95,302 88,319 C85,320 83,318 83.5,316 C87,306 91,290 92.5,274 C94,268 96,265 99.5,264 Z"
    ]
  },
  {
    "id": "panturrilha-anterior",
    "grupo": "Panturrilhas",
    "label": "Panturrilha (anterior)",
    "interativo": true,
    "partes": [
      "M69,340 C66,354 67,376 72,399 L84,399 C88,380 89,360 89,342 C85,339 82,341 79,340 C75,338 72,338 69,340 Z"
    ],
    "linhas": [
      "M79,346 C79,366 78.5,384 78,398"
    ]
  }
];

export const MUSCULOS_COSTAS = [
  {
    "id": "pescoco",
    "grupo": null,
    "label": "Pescoço",
    "interativo": false,
    "partes": [
      "M100,46 L92,46 C92,52 93,56 95,60 L100,66 Z"
    ]
  },
  {
    "id": "antebraco",
    "grupo": null,
    "label": "Antebraço",
    "interativo": false,
    "partes": [
      "M44,149 C49,150 55,150 59,149 C59,162 55,180 51,195 L40,194 C41,178 42,162 44,149 Z"
    ]
  },
  {
    "id": "joelho",
    "grupo": null,
    "label": "Joelho",
    "interativo": false,
    "partes": [
      "M74,319 C79,317 85,317 88,319 C90,325 89,331 87,336 C82,338 76,338 72,336 C70,330 71,324 74,319 Z"
    ]
  },
  {
    "id": "trapezio",
    "grupo": "Trapézio",
    "label": "Trapézio",
    "interativo": true,
    "linhas": [
      "M99,66 C92,76 86,86 82,96"
    ],
    "partes": [
      "M100,52 C95,56 88,60 80,64 C74,67 68,70 63,73 C67,80 74,88 81,96 C88,112 95,128 100,140 Z"
    ]
  },
  {
    "id": "deltoide-posterior",
    "grupo": "Deltoides",
    "label": "Deltoide posterior",
    "interativo": true,
    "linhas": [
      "M57,76 C52,86 51,97 54,107"
    ],
    "partes": [
      "M63,73 C56,72 50,78 48,90 C47,98 50,105 54,110 C58,104 62,96 64,88 C65,82 65,77 63,73 Z"
    ]
  },
  {
    "id": "dorsais",
    "grupo": "Costas",
    "label": "Dorsais (costas)",
    "interativo": true,
    "linhas": [
      "M99,152 C90,154 82,162 76,178"
    ],
    "partes": [
      "M65,86 C71,90 77,95 81,101 C80,108 76,114 70,114 C67,108 65,98 65,86 Z",
      "M68,119 C74,121 80,117 84,109 C90,121 96,133 100,143 L100,165 C92,167 84,174 78,185 C76,167 72,141 68,119 Z"
    ]
  },
  {
    "id": "lombares",
    "grupo": "Lombares",
    "label": "Lombares",
    "interativo": true,
    "partes": [
      "M100,167 C92,169 86,175 82,183 C84,195 92,203 100,207 Z"
    ]
  },
  {
    "id": "gluteos",
    "grupo": "Glúteos",
    "label": "Glúteos",
    "interativo": true,
    "linhas": [
      "M98,214 C90,214 82,221 78,233"
    ],
    "partes": [
      "M100,209 C90,204 80,206 73,214 C69,227 76,243 90,247 C96,247 100,243 100,239 Z"
    ]
  },
  {
    "id": "triceps",
    "grupo": "Tríceps",
    "label": "Tríceps",
    "interativo": true,
    "partes": [
      "M51,111C56,109 60,112 61,117C61,129 58,139 54,146C50,146 47,144 45,142C45,130 47,119 51,111Z",
      "M62,113C64,113 66,115 66,121C66,131 62,140 58,146L55,146C59,139 62,129 62,117Z"
    ]
  },
  {
    "id": "isquiotibiais",
    "grupo": "Isquiotibiais",
    "label": "Isquiotibiais",
    "interativo": true,
    "linhas": [
      "M78,262 C77,280 79,298 82,312"
    ],
    "partes": [
      "M71,250 C67,274 69,300 76,318 C80,318 84,316 86,314 C86,294 85,270 86,252 C80,254 75,254 71,250 Z",
      "M88,252 C92,254 96,254 99.5,252 C99.5,276 95,298 88,318 C87,316 86.6,315 86.6,314 C87,294 88,272 88,252 Z"
    ]
  },
  {
    "id": "panturrilha-posterior",
    "grupo": "Panturrilhas",
    "label": "Panturrilha (posterior)",
    "interativo": true,
    "partes": [
      "M69,340 C74,336 79.5,338 79.5,345 C79.5,360 79,375 78,390 C73,382 67,366 67.5,352 C67.5,346 68,342 69,340 Z",
      "M81,345 C81,338 86,336 89,341 C90,358 87,378 80.5,394 C79.5,378 80.5,360 81,345 Z",
      "M74,383 C76,389 77.5,392 78.5,396 L78.5,402 L82.5,402 L82.5,396 C83.5,392 85,388 86,382 C84,388 82,392 80.5,396 C79,392 76,388 74,383 Z"
    ]
  }
];
