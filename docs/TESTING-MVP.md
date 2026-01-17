# Guía para Probar el MVP de Voto2026

## ✅ Prerequisitos

Antes de comenzar, asegúrate de tener:

1. **Node.js 18+** instalado
2. **Cuenta en Neon** (https://neon.tech) con un proyecto creado
3. **PostgreSQL connection string** de tu proyecto Neon

## 🚀 Instalación y Configuración

### 1. Instalar dependencias

```bash
cd voto2026
npm install
```

### 2. Configurar variables de entorno

Crea el archivo `.env.local` en la raíz del proyecto:

```bash
cp .env.example .env.local
```

Edita `.env.local` y configura:

```env
# Tu connection string de Neon PostgreSQL
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/voto2026?sslmode=require"

# JWT Secret (cualquier string aleatorio)
JWT_SECRET="tu-clave-secreta-super-segura-12345"

# URL de la app
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Node environment
NODE_ENV="development"
```

### 3. Crear esquema de base de datos

Opción A - Usando SQL Editor de Neon (recomendado):
1. Ve a tu proyecto en https://console.neon.tech
2. Abre el "SQL Editor"
3. Copia el contenido completo de `docs/database-schema.sql`
4. Pégalo en el editor
5. Ejecuta el script (Run)

Opción B - Usando psql:
```bash
psql $DATABASE_URL -f docs/database-schema.sql
```

### 4. Poblar datos de candidatos

```bash
npm run db:seed
```

Deberías ver output como:

```
🌱 Starting database seed...

🗑️  Clearing existing candidates...
✅ Candidates table cleared

📝 Inserting 20 candidates...

  ✓ PUSC - Juan Carlos Hidalgo
  ✓ CR1 - Douglas Caamaño Quirós
  ✓ PEN - Claudio Alpízar Otoya
  ...
  ✓ FA - Candidato Frente Amplio

📊 Seed Summary:
   • Successful: 20
   • Failed: 0
   • Total: 20

✅ Database now contains 20 candidates
```

### 5. Verificar datos

```bash
npm run db:verify
```

Esto verificará que:
- La conexión a la BD funciona
- Los 20 candidatos están insertados
- Las puntuaciones están en rangos válidos (1-5)
- No hay datos faltantes

## 🧪 Probar la Aplicación

### 1. Iniciar servidor de desarrollo

```bash
npm run dev
```

La app estará disponible en: http://localhost:3000

### 2. Flujo de prueba completo

#### A. Página Principal
1. Abre http://localhost:3000
2. Verifica que se muestra el landing page
3. Haz clic en "Comenzar Cuestionario"

#### B. Datos Demográficos
1. Completa los 4 campos:
   - Rango de edad
   - Provincia
   - Género
   - Intención de voto previa
2. Haz clic en "Comenzar Cuestionario"

#### C. Cuestionario
1. Deberías ver la primera pregunta de 18
2. Selecciona una respuesta
3. Verifica que el botón "Siguiente" se habilita
4. Navega entre preguntas con "Anterior" y "Siguiente"
5. Observa la barra de progreso en la parte superior
6. En la última pregunta (18/18):
   - Respóndela
   - El botón "Siguiente" cambia a "Ver Resultados"
   - Haz clic en "Ver Resultados"

#### D. Resultados
1. Verás una pantalla de "Cargando tus resultados..."
2. Luego se mostrará:
   - Tu perfil político (tendencia)
   - Tus puntuaciones por dimensión
   - Top 3 candidatos con % de afinidad
   - Comparación detallada por dimensión
3. Prueba los botones:
   - "Compartir Resultados" (copia enlace al portapapeles)
   - "¿Estos resultados te ayudaron?" (envía feedback)
4. Haz clic en "Volver al inicio" para regresar

## 🔍 Verificaciones en Base de Datos

### Ver sesiones creadas

```sql
SELECT
  id,
  age_range,
  province,
  is_completed,
  created_at
FROM sessions
ORDER BY created_at DESC
LIMIT 10;
```

### Ver respuestas de una sesión

```sql
SELECT
  question_id,
  dimension,
  score
FROM responses
WHERE session_id = 'UUID-DE-TU-SESION'
ORDER BY question_id;
```

### Ver resultados guardados

```sql
SELECT
  s.id as session_id,
  s.province,
  c.candidate_name,
  r.affinity_percentage,
  r.match_rank
FROM results r
JOIN sessions s ON r.session_id = s.id
JOIN candidates c ON r.candidate_id = c.id
ORDER BY s.created_at DESC, r.match_rank ASC;
```

## 🐛 Troubleshooting

### Error: "DATABASE_URL is not set"

Solución: Verifica que `.env.local` existe y contiene `DATABASE_URL`.

### Error: "relation candidates does not exist"

Solución: Ejecuta el schema SQL primero: `psql $DATABASE_URL -f docs/database-schema.sql`

### Error al hacer seed: "no candidates found"

Solución: Verifica que `lib/candidatos-data-completo.json` existe y contiene los 20 candidatos.

### Error 500 en API routes

Solución:
1. Verifica logs en la terminal donde corre `npm run dev`
2. Revisa que la conexión a Neon funcione: `npm run db:verify`
3. Asegúrate que todas las tablas existan

### Página de resultados muestra error

Solución:
1. Verifica que completaste todas las 18 preguntas
2. Revisa la consola del navegador (F12) para ver errores
3. Verifica que el sessionId en la URL es válido

## 📊 Casos de Prueba Sugeridos

### Caso 1: Usuario de izquierda
- Responde todas las preguntas con opciones E (puntuación 5)
- Resultado esperado: Frente Amplio, Partido Clase Trabajadora en top 3

### Caso 2: Usuario de derecha
- Responde todas las preguntas con opciones A (puntuación 1)
- Resultado esperado: Liberal Progresista, Avanza en top 3

### Caso 3: Usuario centrista
- Responde todas las preguntas con opción C (puntuación 3)
- Resultado esperado: Alianza CR1, PUSC, o candidatos centro en top 3

### Caso 4: Usuario mixto
- Responde con variación (algunas A, algunas E, algunas C)
- Resultado esperado: Dependerá del balance de respuestas

## ✅ Checklist Final

- [ ] La app carga en http://localhost:3000
- [ ] Landing page se muestra correctamente
- [ ] Formulario demográfico funciona
- [ ] Las 18 preguntas se muestran correctamente
- [ ] La navegación entre preguntas funciona
- [ ] La barra de progreso se actualiza
- [ ] Al completar, se redirige a resultados
- [ ] La página de resultados muestra Top 3
- [ ] Las comparaciones por dimensión son correctas
- [ ] El botón de compartir funciona
- [ ] El feedback se guarda
- [ ] Los datos se guardan correctamente en la BD

## 📝 Próximos Pasos

Una vez que el MVP funcione correctamente:

1. **Testing con usuarios reales**: Invita a 5-10 personas a probar
2. **Ajustar puntuaciones**: Basado en feedback, ajustar scores de candidatos
3. **Añadir fotos y logos**: Completar metadata visual de candidatos
4. **Dashboard admin**: Construir panel de estadísticas
5. **Optimizaciones**: Performance, SEO, accesibilidad
6. **Deployment**: Desplegar a Vercel con Neon en producción

## 🆘 Soporte

Si encuentras problemas:
1. Revisa los logs en la terminal
2. Revisa la consola del navegador (F12)
3. Verifica la conexión a Neon: `npm run db:verify`
4. Consulta `lib/db/README.md` para troubleshooting de BD

---

**Nota**: Este es un MVP. Algunas características como autenticación de usuarios, caché, y analytics no están implementadas aún.
