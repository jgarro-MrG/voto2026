-- ==============================================
-- SCRIPT DE RESET COMPLETO DE BASE DE DATOS
-- ==============================================
-- Este script elimina todas las tablas y las recrea desde cero
-- ADVERTENCIA: Esto borrará TODOS los datos existentes
-- ==============================================

-- 1. Eliminar todas las tablas en orden (por dependencias)
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS results CASCADE;
DROP TABLE IF EXISTS responses CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS candidates CASCADE;

-- 2. Eliminar vistas si existen
DROP VIEW IF EXISTS session_statistics CASCADE;
DROP VIEW IF EXISTS candidate_popularity CASCADE;
DROP VIEW IF EXISTS demographic_analysis CASCADE;

-- 3. Recrear todas las tablas desde cero
-- (El contenido completo del schema original sigue a continuación)

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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_candidates_active ON candidates(is_active);
CREATE INDEX idx_candidates_party_code ON candidates(party_code);

-- ============================================
-- 2. TABLA: users (Usuarios - Opcional)
-- ============================================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),               -- NULL si usa OAuth
  full_name VARCHAR(255),
  auth_provider VARCHAR(50) DEFAULT 'email', -- 'email', 'google', 'facebook', etc
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- 3. TABLA: sessions (Sesiones de Cuestionario)
-- ============================================
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INT REFERENCES users(id) ON DELETE SET NULL,  -- NULL si es anónimo

  -- Datos demográficos
  age_range VARCHAR(20),                    -- '18-25', '26-35', etc
  province VARCHAR(50),                     -- Provincia de Costa Rica
  gender VARCHAR(20),                       -- 'Masculino', 'Femenino', 'Otro', etc
  prior_vote_intention VARCHAR(50),         -- '¿Ya tenías candidato?', etc

  -- Puntuaciones calculadas del usuario (promedio por dimensión)
  score_security DECIMAL(3,2),
  score_economy DECIMAL(3,2),
  score_education DECIMAL(3,2),
  score_health DECIMAL(3,2),
  score_agriculture DECIMAL(3,2),
  score_environment DECIMAL(3,2),
  score_reforms DECIMAL(3,2),
  score_social DECIMAL(3,2),

  -- Control de flujo
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_completed ON sessions(is_completed);
CREATE INDEX idx_sessions_province ON sessions(province);
CREATE INDEX idx_sessions_created ON sessions(created_at);

-- ============================================
-- 4. TABLA: responses (Respuestas Individuales)
-- ============================================
CREATE TABLE responses (
  id SERIAL PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  question_id INT NOT NULL,                 -- ID de la pregunta (1-18)
  dimension VARCHAR(50) NOT NULL,           -- 'security', 'economy', etc
  score DECIMAL(3,2) NOT NULL CHECK (score BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(session_id, question_id)           -- Una respuesta por pregunta por sesión
);

CREATE INDEX idx_responses_session ON responses(session_id);
CREATE INDEX idx_responses_dimension ON responses(dimension);

-- ============================================
-- 5. TABLA: results (Resultados - Top 3)
-- ============================================
CREATE TABLE results (
  id SERIAL PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  candidate_id INT NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  affinity_percentage DECIMAL(5,2) NOT NULL CHECK (affinity_percentage BETWEEN 0 AND 100),
  match_rank INT NOT NULL CHECK (match_rank BETWEEN 1 AND 3),  -- Top 3 solamente
  was_helpful BOOLEAN,                      -- Feedback del usuario
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(session_id, candidate_id),         -- Un resultado por candidato por sesión
  UNIQUE(session_id, match_rank)            -- Un candidato por posición (1, 2, 3)
);

CREATE INDEX idx_results_session ON results(session_id);
CREATE INDEX idx_results_candidate ON results(candidate_id);
CREATE INDEX idx_results_rank ON results(match_rank);

-- ============================================
-- 6. TABLA: admin_users (Administradores)
-- ============================================
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  email VARCHAR(255),
  role VARCHAR(20) DEFAULT 'admin',         -- 'admin', 'superadmin'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

CREATE INDEX idx_admin_users_username ON admin_users(username);

-- ============================================
-- 7. TABLA: audit_log (Auditoría)
-- ============================================
CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  admin_user_id INT REFERENCES admin_users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,             -- 'CREATE', 'UPDATE', 'DELETE', 'LOGIN'
  entity_type VARCHAR(50),                  -- 'candidate', 'user', 'session'
  entity_id INT,                            -- ID del registro afectado
  old_values JSONB,                         -- Valores antes del cambio
  new_values JSONB,                         -- Valores después del cambio
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_log_admin ON audit_log(admin_user_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);
CREATE INDEX idx_audit_log_action ON audit_log(action);

-- ============================================
-- VISTAS (Views)
-- ============================================

-- Vista: Estadísticas por sesión
CREATE VIEW session_statistics AS
SELECT
  DATE(s.created_at) as date,
  COUNT(*) as total_sessions,
  COUNT(CASE WHEN s.is_completed THEN 1 END) as completed_sessions,
  ROUND(
    100.0 * COUNT(CASE WHEN s.is_completed THEN 1 END) / COUNT(*),
    2
  ) as completion_rate,
  s.province,
  s.age_range,
  s.gender
FROM sessions s
GROUP BY DATE(s.created_at), s.province, s.age_range, s.gender;

-- Vista: Popularidad de candidatos
CREATE VIEW candidate_popularity AS
SELECT
  c.id,
  c.party_name,
  c.candidate_name,
  COUNT(r.id) as times_in_top3,
  COUNT(CASE WHEN r.match_rank = 1 THEN 1 END) as times_first,
  ROUND(AVG(r.affinity_percentage), 2) as avg_affinity
FROM candidates c
LEFT JOIN results r ON c.id = r.candidate_id
GROUP BY c.id, c.party_name, c.candidate_name;

-- Vista: Análisis demográfico
CREATE VIEW demographic_analysis AS
SELECT
  s.province,
  s.age_range,
  s.gender,
  c.party_name,
  COUNT(*) as times_matched,
  ROUND(AVG(r.affinity_percentage), 2) as avg_affinity
FROM results r
JOIN sessions s ON r.session_id = s.id
JOIN candidates c ON r.candidate_id = c.id
WHERE r.match_rank = 1
GROUP BY s.province, s.age_range, s.gender, c.party_name;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger: Actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON candidates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_responses_updated_at BEFORE UPDATE ON responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FIN DEL SCRIPT
-- ============================================

-- Verificación: Listar todas las tablas creadas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
