-- ====================================================================================
-- INICIALIZAÇÃO DE EXTENSÕES E TIPOS (ENUMS)
-- ====================================================================================

-- Extensão essencial para gerar UUIDs no banco, caso o Backend não envie.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criando tipos fixos para otimizar armazenamento e evitar erros de digitação (String)
CREATE TYPE tipo_serie_enum AS ENUM ('AQUECIMENTO', 'TRABALHO', 'DROP_SET', 'FALHA');
CREATE TYPE tipo_rotacao_enum AS ENUM ('DIAS_DA_SEMANA', 'SEQUENCIAL');

-- ====================================================================================
-- MÓDULO 0: USUÁRIOS
-- ====================================================================================

CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================================
-- MÓDULO 1: PLANEJAMENTO (O DICIONÁRIO E AS ROTINAS)
-- ====================================================================================

CREATE TABLE exercicios_catalogo (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(150) NOT NULL,
    grupo_muscular VARCHAR(50) NOT NULL, -- Ex: 'Peito', 'Quadriceps', 'Costas'
    tipo_equipamento VARCHAR(50) NOT NULL, -- Ex: 'Halter', 'Barra', 'Máquina'
    instrucoes TEXT
);

CREATE TABLE planos_treino (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL, -- Ex: 'Projeto Verão 2026'
    tipo_rotacao tipo_rotacao_enum NOT NULL DEFAULT 'SEQUENCIAL',
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dias_treino (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plano_treino_id UUID NOT NULL REFERENCES planos_treino(id) ON DELETE CASCADE,
    nome VARCHAR(50) NOT NULL, -- Ex: 'Treino A - Push'
    ordem_execucao INT NOT NULL -- Ex: 1 (Treino A), 2 (Treino B)
);

CREATE TABLE dias_treino_exercicios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dia_treino_id UUID NOT NULL REFERENCES dias_treino(id) ON DELETE CASCADE,
    exercicio_id UUID NOT NULL REFERENCES exercicios_catalogo(id) ON DELETE RESTRICT,
    ordem INT NOT NULL, -- Posição do exercício na ficha do dia
    series_alvo INT NOT NULL DEFAULT 3,
    reps_alvo_min INT NOT NULL DEFAULT 8,
    reps_alvo_max INT NOT NULL DEFAULT 12,
    descanso_alvo_segundos INT DEFAULT 90
);

-- ====================================================================================
-- MÓDULO 2: EXECUÇÃO E TONELAGEM (O CORAÇÃO DO APP)
-- ====================================================================================

CREATE TABLE sessoes_treino (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    dia_treino_id UUID REFERENCES dias_treino(id) ON DELETE SET NULL, -- Permite treino livre se for NULO
    data_inicio TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_fim TIMESTAMP WITH TIME ZONE,
    rpe_geral INT CHECK (rpe_geral BETWEEN 1 AND 10), -- Nível de Esforço Percepção Geral
    peso_corporal_dia NUMERIC(5,2), -- Peso no dia do treino (opcional, p/ cruzar performance)
    notas TEXT
);

CREATE TABLE series_executadas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sessao_treino_id UUID NOT NULL REFERENCES sessoes_treino(id) ON DELETE CASCADE,
    exercicio_id UUID NOT NULL REFERENCES exercicios_catalogo(id) ON DELETE RESTRICT,
    tipo_serie tipo_serie_enum NOT NULL DEFAULT 'TRABALHO',
    peso NUMERIC(6,2) NOT NULL, -- Em Kg. Usamos NUMERIC para lidar com anilhas de 1.25kg, 2.5kg.
    repeticoes INT NOT NULL,
    rir INT CHECK (rir BETWEEN 0 AND 10), -- Repetições na Reserva
    tempo_descanso_segundos INT,
    data_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================================
-- MÓDULO 3: SAÚDE, CORPO E BIOMARCADORES
-- ====================================================================================

CREATE TABLE avaliacoes_corporais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    data_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    peso_kg NUMERIC(5,2) NOT NULL,
    percentual_gordura NUMERIC(4,2),
    medida_braco_cm NUMERIC(4,2),
    medida_torax_cm NUMERIC(4,2),
    medida_cintura_cm NUMERIC(4,2),
    medida_coxa_cm NUMERIC(4,2)
);

CREATE TABLE exames_biomarcadores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    data_exame DATE NOT NULL,
    -- O uso de JSONB aqui é a grande sacada. Você pode enviar qualquer chave/valor:
    -- {"testosterona_livre": 450, "vitamina_d": 35, "tgo": 22} 
    -- sem precisar alterar colunas no banco de dados futuramente.
    resultados JSONB NOT NULL 
);

CREATE TABLE fotos_evolucao (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    data_foto TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    url_imagem VARCHAR(2048) NOT NULL,
    tipo_pose VARCHAR(50) -- Ex: 'FRENTE_RELAXADO', 'DUPLO_BICEPS', 'COSTAS'
);

-- ====================================================================================
-- MÓDULO 4: CHECK-IN DIÁRIO (LIFESTYLE & RECUPERAÇÃO)
-- ====================================================================================

CREATE TABLE checkin_diario_lifestyle (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    data_registro DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Nutrição
    calorias_totais INT,
    proteinas_g INT,
    carbos_g INT,
    gorduras_g INT,
    agua_litros NUMERIC(4,2),
    
    -- Recuperação
    horas_sono NUMERIC(4,2),
    qualidade_sono_1_5 INT CHECK (qualidade_sono_1_5 BETWEEN 1 AND 5),
    
    -- Prontidão
    nivel_estresse_1_5 INT CHECK (nivel_estresse_1_5 BETWEEN 1 AND 5),
    dor_muscular_doms_1_5 INT CHECK (dor_muscular_doms_1_5 BETWEEN 1 AND 5),
    
    -- Garante que o usuário só possa fazer um check-in por dia
    CONSTRAINT unique_checkin_por_dia UNIQUE (usuario_id, data_registro)
);

-- ====================================================================================
-- ÍNDICES DE PERFORMANCE (VITAL PARA HISTÓRICO DE TREINOS)
-- ====================================================================================

-- Indexa as séries para podermos buscar quase instantaneamente a última carga usada
CREATE INDEX idx_series_exercicio_sessao ON series_executadas (exercicio_id, sessao_treino_id);
CREATE INDEX idx_sessoes_data ON sessoes_treino (usuario_id, data_inicio DESC);