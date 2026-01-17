# Scripts de Descarga de Transcripciones

Este directorio contiene scripts para descargar automáticamente las transcripciones de las 20 entrevistas oficiales del TSE a los candidatos presidenciales de Costa Rica 2026.

## 📋 Opciones Disponibles

### Opción 1: Script Bash con yt-dlp (Recomendado)

**Requisitos:**
```bash
pip install yt-dlp
```

**Ejecución:**
```bash
./scripts/download-transcripts.sh
```

**Ventajas:**
- Descarga los subtítulos automáticos originales de YouTube
- Más robusto con videos que tienen subtítulos generados automáticamente
- Maneja múltiples formatos de subtítulos (.vtt, .srv1, .srv2, .srv3)

**Desventajas:**
- Requiere yt-dlp instalado
- Los archivos pueden venir en formato VTT con timestamps

---

### Opción 2: Script Python con youtube-transcript-api

**Requisitos:**
```bash
pip install youtube-transcript-api
```

**Ejecución:**
```bash
python3 scripts/download-transcripts.py
# o
./scripts/download-transcripts.py
```

**Ventajas:**
- Extrae solo el texto limpio (sin timestamps)
- API más simple y directa
- Archivos de salida más pequeños

**Desventajas:**
- Puede fallar si el video no tiene subtítulos disponibles via API
- Depende de la disponibilidad de la API de Google

---

## 📁 Salida

Ambos scripts guardan las transcripciones en:
```
docs/transcripciones/
├── PJSC-walter-ruben-hernandez-juarez.txt
├── PPSD-luz-mary-alpizar-loaiza.txt
├── PUCD-boris-molina-acevedo.txt
└── ...
```

## 🔄 Siguiente Paso

Una vez descargadas las transcripciones, procesarlas con:
```bash
npm run process-transcripts
```

Este comando analiza el contenido de las transcripciones y extrae información relevante sobre las posiciones de cada candidato en las 8 dimensiones políticas.

## ⚠️ Solución de Problemas

### yt-dlp no descarga nada
```bash
# Actualizar yt-dlp a la última versión
pip install --upgrade yt-dlp

# Probar con un video individual
yt-dlp --write-auto-subs --sub-lang es --skip-download \
  --output "test.%(ext)s" \
  "https://www.youtube.com/watch?v=NFy3G6jqJjg"
```

### youtube-transcript-api falla
```bash
# Verificar instalación
pip install --upgrade youtube-transcript-api

# Probar con un video individual
python3 -c "
from youtube_transcript_api import YouTubeTranscriptApi
transcript = YouTubeTranscriptApi.get_transcript('NFy3G6jqJjg', languages=['es'])
print(transcript[0])
"
```

### Ambos métodos fallan
Si ambos scripts automáticos fallan, puedes descargar las transcripciones manualmente:

1. Abre cada video en YouTube
2. Click en "..." (más opciones) debajo del video
3. Selecciona "Mostrar transcripción"
4. Copia el texto del panel lateral
5. Pega en un archivo `.txt` en `docs/transcripciones/`

## 🎯 Videos a Descargar

El script descarga automáticamente los 20 videos listados en `docs/TRANSCRIPCIONES-GUIA.md`:

- **PJSC** - Walter Ruben Hernandez Juarez
- **PPSD** - Luz Mary Alpizar Loaiza
- **PUCD** - Boris Molina Acevedo
- **UP** - Natalia Diaz Quintana
- **PNG** - Fernando Dionisio Zamora Castellanos
- **PEL** - Marco David Rodriguez Badilla
- **PDLCT** - David Hernandez Brenes
- **PCDS** - Ana Virginia Calzada Miranda
- **PCAC** - Claudia Vanessa Dobles Camargo
- **PNR** - Gerardo Fabricio Alvarado Muñoz
- **ACRM** - Ronny Castillo Gonzalez
- **PLP** - Eliecer Feinzaig Mintz
- **PPSO** - Laura Fernandez Delgado
- **PA** - Jose Miguel Aguilar Berrocal
- **PEN** - Claudio Alberto Alpizar Otoya
- **PLN** - Alvaro Roberto Ramos Chaves
- **CR1** - Douglas Caamaño Quiros
- **PIN** - Luis Esteban Amador Jimenez
- **FA** - Andres Ariel Robles Barrantes
- **PUSC** - Juan Carlos Hidalgo Bogantes

## ⏱️ Tiempo Estimado

- **Script Bash (yt-dlp):** ~10-15 minutos (incluye pausas de 2 segundos entre videos)
- **Script Python:** ~5-10 minutos
- **Manual:** ~60-100 minutos (3-5 minutos por video)
