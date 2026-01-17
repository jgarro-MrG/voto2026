# Guía para Extraer Transcripciones de Entrevistas del TSE

## 🎯 Objetivo
Extraer el texto de las 20 entrevistas oficiales del TSE en YouTube para mejorar el análisis de los candidatos.

## 📋 Método Recomendado

### Opción 1: Manual desde YouTube (Más Rápido)

1. **Abrir el video** en YouTube
2. **Click en el botón "..."** (más opciones) debajo del video
3. **Seleccionar "Mostrar transcripción"**
4. **Copiar todo el texto** que aparece en el panel lateral
5. **Pegar en un archivo de texto** con el nombre del partido

### Opción 2: Usar `yt-dlp` (Automatizado)

```bash
# Instalar yt-dlp
pip install yt-dlp

# Para cada video:
yt-dlp --write-auto-subs --sub-lang es --skip-download --output "transcripts/%(id)s.%(ext)s" [VIDEO_URL]
```

### Opción 3: Usar `youtube-transcript-api` (Python)

```bash
# Instalar
pip install youtube-transcript-api

# Crear script Python
python -c "
from youtube_transcript_api import YouTubeTranscriptApi
transcript = YouTubeTranscriptApi.get_transcript('[VIDEO_ID]', languages=['es'])
full_text = ' '.join([entry['text'] for entry in transcript])
print(full_text)
"
```

## 📝 Lista de Videos por Candidato

| Partido | Candidato | Video ID | URL |
|---------|-----------|----------|-----|
| PJSC | WALTER RUBEN HERNANDEZ JUAREZ | NFy3G6jqJjg | https://www.youtube.com/watch?v=NFy3G6jqJjg |
| PPSD | LUZ MARY ALPIZAR LOAIZA | oh-LZ8mQ_UM | https://www.youtube.com/watch?v=oh-LZ8mQ_UM |
| PUCD | BORIS MOLINA ACEVEDO | YwYAhBZKQEA | https://www.youtube.com/watch?v=YwYAhBZKQEA |
| UP | NATALIA DIAZ QUINTANA | 1Mf3kzWgKaw | https://www.youtube.com/watch?v=1Mf3kzWgKaw |
| PNG | FERNANDO DIONISIO ZAMORA CASTELLANOS | LWlrGVAiZR4 | https://www.youtube.com/watch?v=LWlrGVAiZR4 |
| PEL | MARCO DAVID RODRIGUEZ BADILLA | 16xBb_hILa0 | https://www.youtube.com/watch?v=16xBb_hILa0 |
| PDLCT | DAVID HERNANDEZ BRENES | Ivza06J0gjU | https://www.youtube.com/watch?v=Ivza06J0gjU |
| PCDS | ANA VIRGINIA CALZADA MIRANDA | HKVIEttQCTk | https://www.youtube.com/watch?v=HKVIEttQCTk |
| PCAC | CLAUDIA VANESSA DOBLES CAMARGO | hqiS-X0CiEM | https://www.youtube.com/watch?v=hqiS-X0CiEM |
| PNR | GERARDO FABRICIO ALVARADO MUÑOZ | 4GWGCR-21mM | https://www.youtube.com/watch?v=4GWGCR-21mM |
| ACRM | RONNY CASTILLO GONZALEZ | rc7G3-n-6G8 | https://www.youtube.com/watch?v=rc7G3-n-6G8 |
| PLP | ELIECER FEINZAIG MINTZ | tdN_G9Jh0mc | https://www.youtube.com/watch?v=tdN_G9Jh0mc |
| PPSO | LAURA FERNANDEZ DELGADO | LdDuLaJ-iH4 | https://www.youtube.com/watch?v=LdDuLaJ-iH4 |
| PA | JOSE MIGUEL AGUILAR BERROCAL | uDmPQotyZRM | https://www.youtube.com/watch?v=uDmPQotyZRM |
| PEN | CLAUDIO ALBERTO ALPIZAR OTOYA | _ctmDd36skw | https://www.youtube.com/watch?v=_ctmDd36skw |
| PLN | ALVARO ROBERTO RAMOS CHAVES | yxStLBeuNEI | https://www.youtube.com/watch?v=yxStLBeuNEI |
| CR1 | DOUGLAS CAAMAÑO QUIROS | pcpe9SEXgRc | https://www.youtube.com/watch?v=pcpe9SEXgRc |
| PIN | LUIS ESTEBAN AMADOR JIMENEZ | XFx-_JBlyKo | https://www.youtube.com/watch?v=XFx-_JBlyKo |
| FA | ANDRES ARIEL ROBLES BARRANTES | 8DQt5h-f9NI | https://www.youtube.com/watch?v=8DQt5h-f9NI |
| PUSC | JUAN CARLOS HIDALGO BOGANTES | z_UOFQKZKxI | https://www.youtube.com/watch?v=z_UOFQKZKxI |

## 📁 Estructura de Archivos Recomendada

```
docs/transcripciones/
├── PJSC-Walter-Hernandez.txt
├── PPSD-Luz-Mary-Alpizar.txt
├── PUCD-Boris-Molina.txt
└── ...
```

## 🤖 Script de Procesamiento

Una vez obtenidas las transcripciones, ejecutar:
```bash
npm run process-transcripts
```

Este script:
1. Lee todas las transcripciones
2. Analiza el contenido
3. Extrae puntos clave sobre cada dimensión política
4. Actualiza las descripciones de los candidatos

## ⏱️ Tiempo Estimado

- **Manual**: ~3-5 minutos por video = 60-100 minutos total
- **Con `yt-dlp`**: ~10-15 minutos total
- **Con script Python**: ~5-10 minutos total

## 💡 Consejo

Si vas a hacerlo manualmente, prioriza los candidatos con mayor intención de voto:
1. Laura Fernández (PPSO)
2. Álvaro Ramos (PLN)
3. Ariel Robles (FA)
4. Claudia Dobles (PCAC)
5. Fabricio Alvarado (PNR)
