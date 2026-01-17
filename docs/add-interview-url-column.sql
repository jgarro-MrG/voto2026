-- Agregar columna para URL de entrevista del TSE
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS interview_url TEXT;

-- Comentario de la columna
COMMENT ON COLUMN candidates.interview_url IS 'URL de la entrevista oficial del TSE en YouTube';
