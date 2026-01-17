# Voto2026 🗳️

Aplicación web para ayudar a votantes indecisos a identificar qué plan de gobierno se alinea mejor con sus intereses para las **elecciones presidenciales de Costa Rica 2026** (1 de febrero).

## 🎯 Propósito

Esta herramienta educativa permite a los ciudadanos costarricenses:
- Responder un cuestionario de 18 preguntas sobre temas clave
- Descubrir su afinidad con los 20 candidatos presidenciales
- Comparar propuestas por dimensión (seguridad, economía, educación, salud, etc.)
- Tomar una decisión informada basada en datos objetivos

## 🏗️ Arquitectura

- **Frontend:** Next.js 15 con App Router, TypeScript, Tailwind CSS
- **Backend:** API Routes serverless (Next.js)
- **Base de datos:** Neon PostgreSQL (serverless)
- **Despliegue:** Vercel
- **Autenticación:** JWT (opcional para guardar resultados)

## 📊 Modelo de Parametrización

El sistema analiza planes de gobierno en **8 dimensiones**:

1. **Seguridad y Justicia** - Enfoque en combate al crimen, prevención, reformas judiciales
2. **Economía y Empleo** - Rol del Estado, apoyo a PYMES, política fiscal
3. **Educación** - Inversión, reformas, calidad educativa
4. **Salud (CCSS)** - Modelo de atención, listas de espera, inversión
5. **Sector Agropecuario** - Apoyo a productores, seguridad alimentaria
6. **Medio Ambiente y Sostenibilidad** - Descarbonización, áreas protegidas
7. **Reformas Institucionales** - Transparencia, modernización del Estado
8. **Política Social e Inclusión** - Combate a pobreza, pensiones, vivienda

Cada dimensión se califica en escala 1-5:
- **1-2:** Postura conservadora/liberal/mercado libre
- **3:** Postura centrista/equilibrada
- **4-5:** Postura progresista/intervencionista/Estado fuerte

## 🧮 Algoritmo de Matching

El sistema usa **distancia euclidiana** para calcular afinidad:

```
Afinidad (%) = 100 × (1 - distancia / distancia_máxima)
```

Donde:
- `distancia = √Σ(score_usuario - score_candidato)²`
- `distancia_máxima = √(8 dimensiones × 4²) ≈ 11.31`

El usuario recibe:
- **Top 3 candidatos** con mayor afinidad
- **Porcentaje de match** general
- **Comparación por dimensión** (gráficos visuales)

## 📝 Cuestionario

**18 preguntas estratégicas:**
- 3 sobre Seguridad y Justicia
- 3 sobre Economía y Empleo
- 2 sobre Educación
- 2 sobre Salud
- 2 sobre Sector Agropecuario
- 2 sobre Medio Ambiente
- 2 sobre Reformas Institucionales
- 2 sobre Política Social

**+ 4 preguntas demográficas:**
- Rango de edad
- Provincia de residencia
- Género
- Intención previa de voto

**+ 1 pregunta post-resultados:**
- ¿Los resultados le ayudaron a decidir?

## 🗄️ Esquema de Base de Datos

```sql
candidates         -- 20 candidatos con puntuaciones por dimensión
users             -- Usuarios registrados (opcional)
sessions          -- Sesiones de cuestionario (anónimas o con usuario)
responses         -- Respuestas individuales por pregunta
results           -- Top 3 candidatos calculados por sesión
admin_users       -- Acceso al dashboard administrativo
audit_log         -- Registro de acciones admin
```

Ver esquema completo en [`docs/database-schema.sql`](./docs/database-schema.sql)

## 📁 Estructura del Proyecto

```
voto2026/
├── app/
│   ├── page.tsx                    # Página principal
│   ├── layout.tsx                  # Layout global
│   ├── globals.css                 # Estilos globales
│   ├── cuestionario/               # Flujo del cuestionario
│   ├── resultados/                 # Página de resultados
│   ├── admin/                      # Dashboard administrativo
│   └── api/                        # API Routes serverless
│       ├── session/                # Crear/obtener sesión
│       ├── responses/              # Guardar respuestas
│       ├── results/                # Calcular/obtener resultados
│       ├── candidates/             # CRUD candidatos
│       └── stats/                  # Estadísticas agregadas
├── components/
│   ├── ui/                         # Componentes UI reutilizables
│   ├── quiz/                       # Componentes del cuestionario
│   ├── results/                    # Visualizaciones de resultados
│   └── admin/                      # Componentes del dashboard
├── lib/
│   ├── db/
│   │   ├── connection.ts           # Conexión a Neon DB
│   │   ├── seed.ts                 # Script de seed (20 candidatos)
│   │   ├── verify-seed.ts          # Verificación de datos
│   │   └── README.md               # Guía de setup de BD
│   ├── types.ts                    # TypeScript types
│   ├── questions.ts                # Preguntas del cuestionario
│   ├── matching-algorithm.ts       # Lógica de matching
│   ├── candidatos-data-completo.json # Datos de 20 candidatos
│   └── utils.ts                    # Utilidades comunes
├── docs/
│   ├── modelo-parametrizacion.md   # Documentación del modelo
│   ├── cuestionario.md             # Especificación del cuestionario
│   └── database-schema.sql         # Esquema de BD completo
└── planes/
    └── txt/                        # 20 planes de gobierno (texto)
```

## 🚀 Instalación y Configuración

### 1. Clonar repositorio e instalar dependencias

```bash
cd voto2026
npm install
```

### 2. Configurar variables de entorno

Crear archivo `.env.local`:

```bash
# Base de datos Neon PostgreSQL
DATABASE_URL="postgresql://user:password@host/voto2026?sslmode=require"

# JWT para autenticación opcional
JWT_SECRET="tu-clave-secreta-aqui"

# URL de la app
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Crear base de datos

```bash
# Opción 1: Ejecutar en SQL Editor de Neon (recomendado)
# - Copiar contenido de docs/database-schema.sql
# - Pegarlo en el SQL Editor de tu proyecto Neon
# - Ejecutar

# Opción 2: Usar psql
psql $DATABASE_URL -f docs/database-schema.sql
```

### 4. Poblar datos de candidatos

```bash
# Seed de los 20 candidatos presidenciales
npm run db:seed

# Verificar que los datos se cargaron correctamente
npm run db:verify
```

> 📚 Para más detalles sobre la configuración de base de datos, ver [`lib/db/README.md`](./lib/db/README.md)

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## 📱 Características

### Para Usuarios
- ✅ Cuestionario mobile-first (5-7 minutos)
- ✅ Resultados instantáneos con Top 3 candidatos
- ✅ Visualización de afinidad por dimensión
- ✅ Comparación detallada de propuestas
- ⏳ Registro opcional para guardar resultados
- ⏳ Compartir resultados en redes sociales

### Para Administradores
- ⏳ Dashboard con estadísticas en tiempo real
- ⏳ Filtros por: provincia, edad, género
- ⏳ Reportes de candidatos más afines por demografía
- ⏳ Exportar datos a CSV/Excel
- ⏳ Auditoría de acciones administrativas

## 🔒 Privacidad y Datos

- **Anónimo por defecto:** Los usuarios pueden completar el cuestionario sin registro
- **Datos mínimos:** Solo se recopilan datos demográficos opcionales para estadísticas
- **Sin tracking:** No se usan cookies de terceros ni analytics invasivos
- **Transparente:** El código y la metodología son abiertos

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm test

# Ejecutar tests E2E
npm run test:e2e
```

## 📦 Despliegue en Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Configurar variables de entorno en Vercel Dashboard.

## 🤝 Contribuir

Este es un proyecto educativo sin fines de lucro. Contribuciones son bienvenidas:

1. Fork el repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

MIT License - Ver [LICENSE](./LICENSE)

## 📞 Contacto

Para preguntas o sugerencias sobre el proyecto.

---

**Nota:** Esta herramienta es educativa e independiente. No está afiliada a ningún partido político ni al Tribunal Supremo de Elecciones de Costa Rica.

**Elecciones Presidenciales Costa Rica 2026 - 1 de Febrero**
