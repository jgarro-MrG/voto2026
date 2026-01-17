# Pipeline de Análisis con IA para Transcripciones

Este documento describe el sistema completo para analizar las transcripciones de entrevistas del TSE usando Inteligencia Artificial (Claude) y actualizar la base de datos con información mejorada.

## 🎯 Objetivo

Convertir las 20 transcripciones de entrevistas en resúmenes estructurados de alta calidad, organizados por las 8 dimensiones políticas del sistema Voto2026.

## 📋 Proceso Completo (4 Pasos)

### Paso 1: Limpiar Transcripciones
Convierte archivos WebVTT con timestamps en texto limpio.

```bash
npm run clean-transcripts
```

**Qué hace:**
- Lee archivos de `docs/transcripciones/` (formato WebVTT)
- Elimina timestamps, metadata, y etiquetas HTML
- Extrae solo el texto hablado
- Guarda en `docs/transcripciones-limpias/`
- Genera índice JSON con estadísticas

**Salida:**
```
docs/transcripciones-limpias/
├── index.json
├── PJSC-walter-ruben-hernandez-juarez.txt
├── PPSD-luz-mary-alpizar-loaiza.txt
└── ... (20 archivos)
```

---

### Paso 2: Analizar con IA
Usa Claude para analizar cada transcripción y extraer posiciones políticas.

```bash
npm run analyze-transcripts
```

**Requisito previo:** Configurar `ANTHROPIC_API_KEY` en `.env.local`

```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-api03-...
```

**Qué hace:**
- Lee transcripciones limpias
- Para cada candidato, envía la transcripción a Claude
- Extrae posiciones en las 8 dimensiones:
  - Seguridad y Justicia
  - Economía y Empleo
  - Educación
  - Salud
  - Sector Agropecuario
  - Medio Ambiente
  - Reformas Institucionales
  - Política Social
- Genera resumen general + propuestas específicas por dimensión
- Guarda análisis en JSON estructurado

**Opciones:**
```bash
# Analizar desde el candidato #5
npm run analyze-transcripts 5

# Analizar solo 3 candidatos empezando desde el #10
npm run analyze-transcripts 10 3
```

**Salida:**
```
docs/analisis-candidatos/
├── all-analyses.json
├── PJSC-walter-hernandez.json
├── PPSD-luz-alpizar.json
└── ... (20 archivos)
```

**Formato de análisis:**
```json
{
  "party": "PPSO",
  "candidate": "Laura Fernandez Delgado",
  "overallSummary": "Resumen general del candidato...",
  "dimensions": [
    {
      "dimension": "security",
      "summary": "Propone enfoque preventivo...",
      "keyProposals": [
        "Fortalecer policía comunitaria",
        "Invertir en prevención social"
      ],
      "stance": "progressive"
    }
  ],
  "generatedAt": "2026-01-11T..."
}
```

**Costo estimado:**
- ~20 candidatos × $0.50 = $10 USD (aproximado)
- Usa Claude 3.5 Sonnet para máxima calidad

---

### Paso 3: Actualizar Candidatos
Integra los análisis de IA en el archivo oficial de candidatos.

```bash
npm run update-candidates
```

**Qué hace:**
- Lee `lib/candidatos-data-oficial.json`
- Lee `docs/analisis-candidatos/all-analyses.json`
- Hace match por partido y nombre de candidato
- Genera `planSummary` mejorado con:
  - Resumen general del candidato
  - Propuestas principales por dimensión
- Crea backup automático antes de modificar
- Actualiza el JSON oficial

**Antes:**
```json
{
  "partyCode": "PPSO",
  "candidateName": "LAURA FERNANDEZ DELGADO",
  "planSummary": "Candidata del PPSO con enfoque en...",
  ...
}
```

**Después:**
```json
{
  "partyCode": "PPSO",
  "candidateName": "LAURA FERNANDEZ DELGADO",
  "planSummary": "Laura Fernández propone un modelo de desarrollo basado en equidad social y sostenibilidad ambiental...\n\nPropuestas principales:\n\n**Seguridad y Justicia**: Enfoque preventivo con fortalecimiento de policía comunitaria\n- Invertir en prevención social del crimen\n- Reformar sistema penitenciario\n\n**Economía y Empleo**: Apoyo a PYMES y empleo verde\n- Crear fondo de garantías para pequeñas empresas\n- Impulsar economía circular...",
  ...
}
```

---

### Paso 4: Re-seed Base de Datos
Actualiza la base de datos con la nueva información.

```bash
npm run db:seed
```

**Qué hace:**
- Borra datos existentes de candidatos
- Inserta candidatos con los nuevos `planSummary` mejorados
- Los usuarios verán información más detallada y precisa

---

## 🚀 Pipeline Completo Automatizado

Ejecuta todos los pasos en secuencia:

```bash
npm run ai-pipeline
```

Equivalente a:
```bash
npm run clean-transcripts && \
npm run analyze-transcripts && \
npm run update-candidates && \
npm run db:seed
```

**Tiempo estimado:** 15-20 minutos
- Limpieza: 30 segundos
- Análisis IA: 10-15 minutos (con pausas entre llamadas)
- Actualización: 5 segundos
- Re-seed: 5 segundos

---

## ⚙️ Configuración Requerida

### 1. API Key de Anthropic

Obtén tu API key en: https://console.anthropic.com/

```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxx
```

### 2. Variables de entorno existentes

```bash
# .env.local
DATABASE_URL=postgresql://...
ANTHROPIC_API_KEY=sk-ant-api03-...
```

---

## 📊 Estructura de Archivos

```
voto2026/
├── docs/
│   ├── transcripciones/              # WebVTT originales
│   ├── transcripciones-limpias/      # Texto limpio
│   └── analisis-candidatos/          # Análisis con IA
├── lib/
│   ├── candidatos-data-oficial.json         # Datos oficiales
│   ├── candidatos-data-oficial.backup-*.json # Backups automáticos
│   ├── clean-transcripts.ts
│   ├── analyze-transcripts-with-ai.ts
│   └── update-candidates-with-analysis.ts
└── scripts/
    ├── download-transcripts.sh
    └── download-transcripts.py
```

---

## 🔍 Comandos Útiles

```bash
# Descargar transcripciones
npm run download-transcripts

# Limpiar formato WebVTT
npm run clean-transcripts

# Analizar con IA (todos)
npm run analyze-transcripts

# Analizar solo primeros 5
npm run analyze-transcripts 0 5

# Actualizar JSON de candidatos
npm run update-candidates

# Re-seed base de datos
npm run db:seed

# Pipeline completo
npm run ai-pipeline

# Verificar datos en DB
npm run db:verify
```

---

## 💡 Tips y Mejores Prácticas

### Ejecutar en tandas

Para evitar saturar la API o manejar errores:

```bash
# Primera tanda (candidatos 0-9)
npm run analyze-transcripts 0 10

# Segunda tanda (candidatos 10-19)
npm run analyze-transcripts 10 10
```

### Revisar análisis antes de actualizar

Revisa los archivos en `docs/analisis-candidatos/` antes de ejecutar `update-candidates`.

### Backups automáticos

Cada vez que ejecutas `update-candidates`, se crea un backup:
```
lib/candidatos-data-oficial.backup-1704934800000.json
```

Para restaurar:
```bash
cp lib/candidatos-data-oficial.backup-*.json lib/candidatos-data-oficial.json
```

### Ajustar delay entre llamadas

Edita `lib/analyze-transcripts-with-ai.ts`:
```typescript
await analyzeAllTranscripts({
  delayMs: 5000 // 5 segundos en vez de 2
})
```

---

## ⚠️ Solución de Problemas

### Error: ANTHROPIC_API_KEY no está configurada
```bash
# Verifica que esté en .env.local
cat .env.local | grep ANTHROPIC_API_KEY

# Si no existe, agrégala:
echo "ANTHROPIC_API_KEY=sk-ant-api03-xxx" >> .env.local
```

### Error: No se encontraron análisis
```bash
# Ejecuta primero el análisis
npm run analyze-transcripts
```

### Error: Primero ejecuta clean-transcripts
```bash
# Limpia las transcripciones primero
npm run clean-transcripts
```

### API Rate Limit
```bash
# Aumenta el delay en analyze-transcripts-with-ai.ts
# o ejecuta en tandas más pequeñas
npm run analyze-transcripts 0 5
```

---

## 📈 Resultados Esperados

Después de ejecutar el pipeline completo:

1. ✅ 20 transcripciones limpias y procesables
2. ✅ 20 análisis detallados con posiciones por dimensión
3. ✅ JSON de candidatos actualizado con resúmenes mejorados
4. ✅ Base de datos con información precisa y detallada
5. ✅ Usuarios ven propuestas específicas de cada candidato

---

## 🎉 Beneficios

- **Precisión:** Información extraída directamente de las entrevistas oficiales
- **Detalle:** Propuestas específicas por cada dimensión política
- **Escalable:** Fácil de actualizar cuando haya nuevas entrevistas
- **Auditable:** Todos los análisis guardados en JSON para revisión
- **Automático:** Pipeline de un solo comando

---

## 🔗 Referencias

- Entrevistas oficiales: https://www.tse.go.cr/2026/planesgobierno.html
- API de Anthropic: https://docs.anthropic.com/
- Documentación Claude: https://docs.anthropic.com/claude/docs
