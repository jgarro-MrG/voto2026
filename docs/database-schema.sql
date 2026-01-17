-- Database Schema for Voto2026
-- PostgreSQL / Neon Database

-- ============================================
-- 1. TABLA: candidates (Candidatos)
-- ============================================
CREATE TABLE candidates (
  id SERIAL PRIMARY KEY,
  party_code VARCHAR(10) UNIQUE NOT NULL,  -- Código del partido (ej: 'PUSC', 'PLN', 'PAC')
  party_name VARCHAR(255) NOT NULL,        -- Nombre completo del partido
  candidate_name VARCHAR(255) NOT NULL,    -- Nombre del candidato presidencial
  candidate_photo_url TEXT,                -- URL de foto del candidato
  party_logo_url TEXT,                     -- URL del logo del partido
  slogan TEXT,                             -- Slogan de campaña
  color_primary VARCHAR(7),                -- Color primario del partido (hex)
  color_secondary VARCHAR(7),              -- Color secundario del partido (hex)
  website_url TEXT,                        -- Sitio web de campaña

  -- Puntuaciones por dimensión (escala 1-5)
  score_security DECIMAL(3,2) NOT NULL CHECK (score_security BETWEEN 1 AND 5),
  score_economy DECIMAL(3,2) NOT NULL CHECK (score_economy BETWEEN 1 AND 5),
  score_education DECIMAL(3,2) NOT NULL CHECK (score_education BETWEEN 1 AND 5),
  score_health DECIMAL(3,2) NOT NULL CHECK (score_health BETWEEN 1 AND 5),
  score_agriculture DECIMAL(3,2) NOT NULL CHECK (score_agriculture BETWEEN 1 AND 5),
  score_environment DECIMAL(3,2) NOT NULL CHECK (score_environment BETWEEN 1 AND 5),
  score_reforms DECIMAL(3,2) NOT NULL CHECK (score_reforms BETWEEN 1 AND 5),
  score_social DECIMAL(3,2) NOT NULL CHECK (score_social BETWEEN 1 AND 5),

  -- Metadata
  plan_summary TEXT,                        -- Resumen ejecutivo del plan
  plan_file_path TEXT,                      -- Ruta al archivo del plan completo
  is_active BOOLEAN DEFAULT true,           -- Si el candidato está activo
  display_order INT DEFAULT 0,              -- Orden de visualización
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimizar consultas
CREATE INDEX idx_candidates_active ON candidates(is_active);
CREATE INDEX idx_candidates_party_code ON candidates(party_code);

-- ============================================
-- 2. TABLA: users (Usuarios - opcional)
-- ============================================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,               -- Email (si se registra)
  email_verified BOOLEAN DEFAULT false,
  password_hash TEXT,                      -- Hash de contraseña (si se registra)
  full_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- 3. TABLA: sessions (Sesiones de cuestionario)
-- ============================================
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INT REFERENCES users(id) ON DELETE SET NULL,  -- NULL si es anónimo

  -- Datos demográficos
  age_range VARCHAR(20),                   -- '18-25', '26-35', etc.
  province VARCHAR(50),                    -- Provincia de residencia
  gender VARCHAR(20),                      -- Género
  prior_vote_intention VARCHAR(50),        -- Intención previa de voto

  -- Metadata de sesión
  ip_address INET,                         -- IP del usuario (para estadísticas)
  user_agent TEXT,                         -- User agent del navegador
  is_completed BOOLEAN DEFAULT false,      -- Si completó todo el cuestionario
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,

  -- Puntuaciones calculadas por dimensión
  score_security DECIMAL(3,2),
  score_economy DECIMAL(3,2),
  score_education DECIMAL(3,2),
  score_health DECIMAL(3,2),
  score_agriculture DECIMAL(3,2),
  score_environment DECIMAL(3,2),
  score_reforms DECIMAL(3,2),
  score_social DECIMAL(3,2)
);

CREATE INDEX idx_sessions_completed ON sessions(is_completed);
CREATE INDEX idx_sessions_province ON sessions(province);
CREATE INDEX idx_sessions_age_range ON sessions(age_range);
CREATE INDEX idx_sessions_created_at ON sessions(started_at);

-- ============================================
-- 4. TABLA: responses (Respuestas individuales)
-- ============================================
CREATE TABLE responses (
  id SERIAL PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  question_number INT NOT NULL,            -- Número de pregunta (1-18)
  answer_value INT NOT NULL CHECK (answer_value BETWEEN 1 AND 5),  -- Respuesta 1-5
  dimension VARCHAR(50) NOT NULL,          -- Dimensión asociada
  time_spent_seconds INT,                  -- Tiempo en responder (opcional)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_responses_session ON responses(session_id);
CREATE INDEX idx_responses_dimension ON responses(dimension);
CREATE INDEX idx_responses_question ON responses(question_number);

-- ============================================
-- 5. TABLA: results (Resultados calculados)
-- ============================================
CREATE TABLE results (
  id SERIAL PRIMARY KEY,
  session_id UUID NOT NULL UNIQUE REFERENCES sessions(id) ON DELETE CASCADE,

  -- Top 3 candidatos con mayor afinidad
  top1_candidate_id INT REFERENCES candidates(id),
  top1_affinity_percentage DECIMAL(5,2),   -- Porcentaje de afinidad 0-100
  top1_dimension_match JSONB,              -- Match por dimensión en JSON

  top2_candidate_id INT REFERENCES candidates(id),
  top2_affinity_percentage DECIMAL(5,2),
  top2_dimension_match JSONB,

  top3_candidate_id INT REFERENCES candidates(id),
  top3_affinity_percentage DECIMAL(5,2),
  top3_dimension_match JSONB,

  -- Metadatos
  was_helpful BOOLEAN,                     -- Respuesta a pregunta final
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  viewed_at TIMESTAMP,                     -- Última vez que vio resultados
  shared BOOLEAN DEFAULT false             -- Si compartió resultados
);

CREATE INDEX idx_results_session ON results(session_id);
CREATE INDEX idx_results_top1 ON results(top1_candidate_id);

-- ============================================
-- 6. TABLA: admin_users (Usuarios admin)
-- ============================================
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',        -- 'admin', 'super_admin', 'viewer'
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admin_users_username ON admin_users(username);
CREATE INDEX idx_admin_users_active ON admin_users(is_active);

-- ============================================
-- 7. TABLA: audit_log (Log de auditoría)
-- ============================================
CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  admin_user_id INT REFERENCES admin_users(id),
  action VARCHAR(100) NOT NULL,            -- 'login', 'update_candidate', 'export_data'
  table_name VARCHAR(100),
  record_id INT,
  changes JSONB,                           -- Cambios realizados en JSON
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_log_admin ON audit_log(admin_user_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);

-- ============================================
-- TRIGGERS para updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON candidates
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VIEWS para reportes y analytics
-- ============================================

-- Vista de estadísticas por provincia
CREATE OR REPLACE VIEW stats_by_province AS
SELECT
  province,
  COUNT(*) as total_sessions,
  COUNT(CASE WHEN is_completed = true THEN 1 END) as completed_sessions,
  AVG(score_security) as avg_security,
  AVG(score_economy) as avg_economy,
  AVG(score_education) as avg_education,
  AVG(score_health) as avg_health,
  AVG(score_agriculture) as avg_agriculture,
  AVG(score_environment) as avg_environment,
  AVG(score_reforms) as avg_reforms,
  AVG(score_social) as avg_social
FROM sessions
WHERE is_completed = true
GROUP BY province;

-- Vista de estadísticas por rango de edad
CREATE OR REPLACE VIEW stats_by_age AS
SELECT
  age_range,
  COUNT(*) as total_sessions,
  AVG(score_security) as avg_security,
  AVG(score_economy) as avg_economy,
  AVG(score_education) as avg_education,
  AVG(score_health) as avg_health
FROM sessions
WHERE is_completed = true
GROUP BY age_range
ORDER BY age_range;

-- Vista de candidatos más afines por demografía
CREATE OR REPLACE VIEW top_candidates_by_demographics AS
SELECT
  s.age_range,
  s.province,
  s.gender,
  c.party_name,
  c.candidate_name,
  COUNT(*) as times_as_top1,
  AVG(r.top1_affinity_percentage) as avg_affinity
FROM results r
JOIN sessions s ON r.session_id = s.id
JOIN candidates c ON r.top1_candidate_id = c.id
WHERE s.is_completed = true
GROUP BY s.age_range, s.province, s.gender, c.party_name, c.candidate_name
ORDER BY times_as_top1 DESC;

-- ============================================
-- SEED DATA - Ejemplo de candidato
-- ============================================

-- Insertar un candidato de ejemplo (PUSC)
INSERT INTO candidates (
  party_code, party_name, candidate_name, slogan,
  color_primary, color_secondary,
  score_security, score_economy, score_education, score_health,
  score_agriculture, score_environment, score_reforms, score_social,
  plan_summary, is_active
) VALUES (
  'PUSC',
  'Partido Unidad Social Cristiana',
  'Juan Carlos Hidalgo',
  'Emparejar la cancha',
  '#0066CC',
  '#FFFFFF',
  2.5,  -- Seguridad (equilibrado)
  3.0,  -- Economía (mixta)
  4.0,  -- Educación (inversión fuerte)
  3.5,  -- Salud (fortalecer público)
  3.5,  -- Agricultura (protección balanceada)
  3.5,  -- Ambiente (desarrollo sostenible)
  4.0,  -- Reformas (estructurales)
  4.0,  -- Social (programas amplios)
  'Plan centrado en emparejar la cancha con cuatro ejes: seguridad y orden, reforma institucional, agenda social y transformación económica. Propone aumentar 6,500 efectivos policiales, crear Fondo de Seguridad Nacional, reformar sistema educativo con enfoque en calidad y bilingüismo, y fortalecer el sector agropecuario.',
  true
);

-- Crear usuario admin por defecto (password: admin123 - cambiar en producción)
INSERT INTO admin_users (username, password_hash, email, full_name, role)
VALUES (
  'admin',
  '$2a$10$XQjUBF5qCjKLwHwqW4nXyexamplehash',  -- Este es un hash de ejemplo
  'admin@voto2026.cr',
  'Administrador',
  'super_admin'
);

-- ============================================
-- COMENTARIOS ÚTILES
-- ============================================

COMMENT ON TABLE candidates IS 'Almacena información de candidatos y sus puntuaciones por dimensión';
COMMENT ON TABLE sessions IS 'Sesiones de cuestionario completadas por usuarios';
COMMENT ON TABLE responses IS 'Respuestas individuales a cada pregunta del cuestionario';
COMMENT ON TABLE results IS 'Resultados calculados con los top 3 candidatos por sesión';
COMMENT ON TABLE admin_users IS 'Usuarios con acceso al dashboard administrativo';
COMMENT ON TABLE audit_log IS 'Registro de acciones administrativas para auditoría';

-- ============================================
-- PERMISOS (opcional, según configuración)
-- ============================================

-- Crear rol de solo lectura para reportes
-- CREATE ROLE voto2026_readonly;
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO voto2026_readonly;
