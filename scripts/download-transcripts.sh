#!/bin/bash

# Script para descargar transcripciones de entrevistas del TSE usando yt-dlp
# Requisito: yt-dlp instalado (pip install yt-dlp)

set -e

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Crear directorio si no existe
TRANSCRIPT_DIR="docs/transcripciones"
mkdir -p "$TRANSCRIPT_DIR"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Descargando Transcripciones del TSE${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Verificar que yt-dlp está instalado
if ! command -v yt-dlp &> /dev/null; then
    echo -e "${RED}❌ Error: yt-dlp no está instalado${NC}"
    echo -e "${YELLOW}Instálalo con: pip install yt-dlp${NC}"
    exit 1
fi

# Contador de progreso
TOTAL=20
CURRENT=0
SUCCESSFUL=0
FAILED=0

# Lista de videos: Partido | Candidato | Video ID | URL
declare -a VIDEOS=(
    "PJSC|WALTER RUBEN HERNANDEZ JUAREZ|NFy3G6jqJjg|https://www.youtube.com/watch?v=NFy3G6jqJjg"
    "PPSD|LUZ MARY ALPIZAR LOAIZA|oh-LZ8mQ_UM|https://www.youtube.com/watch?v=oh-LZ8mQ_UM"
    "PUCD|BORIS MOLINA ACEVEDO|YwYAhBZKQEA|https://www.youtube.com/watch?v=YwYAhBZKQEA"
    "UP|NATALIA DIAZ QUINTANA|1Mf3kzWgKaw|https://www.youtube.com/watch?v=1Mf3kzWgKaw"
    "PNG|FERNANDO DIONISIO ZAMORA CASTELLANOS|LWlrGVAiZR4|https://www.youtube.com/watch?v=LWlrGVAiZR4"
    "PEL|MARCO DAVID RODRIGUEZ BADILLA|16xBb_hILa0|https://www.youtube.com/watch?v=16xBb_hILa0"
    "PDLCT|DAVID HERNANDEZ BRENES|Ivza06J0gjU|https://www.youtube.com/watch?v=Ivza06J0gjU"
    "PCDS|ANA VIRGINIA CALZADA MIRANDA|HKVIEttQCTk|https://www.youtube.com/watch?v=HKVIEttQCTk"
    "PCAC|CLAUDIA VANESSA DOBLES CAMARGO|hqiS-X0CiEM|https://www.youtube.com/watch?v=hqiS-X0CiEM"
    "PNR|GERARDO FABRICIO ALVARADO MUÑOZ|4GWGCR-21mM|https://www.youtube.com/watch?v=4GWGCR-21mM"
    "ACRM|RONNY CASTILLO GONZALEZ|rc7G3-n-6G8|https://www.youtube.com/watch?v=rc7G3-n-6G8"
    "PLP|ELIECER FEINZAIG MINTZ|tdN_G9Jh0mc|https://www.youtube.com/watch?v=tdN_G9Jh0mc"
    "PPSO|LAURA FERNANDEZ DELGADO|LdDuLaJ-iH4|https://www.youtube.com/watch?v=LdDuLaJ-iH4"
    "PA|JOSE MIGUEL AGUILAR BERROCAL|uDmPQotyZRM|https://www.youtube.com/watch?v=uDmPQotyZRM"
    "PEN|CLAUDIO ALBERTO ALPIZAR OTOYA|_ctmDd36skw|https://www.youtube.com/watch?v=_ctmDd36skw"
    "PLN|ALVARO ROBERTO RAMOS CHAVES|yxStLBeuNEI|https://www.youtube.com/watch?v=yxStLBeuNEI"
    "CR1|DOUGLAS CAAMAÑO QUIROS|pcpe9SEXgRc|https://www.youtube.com/watch?v=pcpe9SEXgRc"
    "PIN|LUIS ESTEBAN AMADOR JIMENEZ|XFx-_JBlyKo|https://www.youtube.com/watch?v=XFx-_JBlyKo"
    "FA|ANDRES ARIEL ROBLES BARRANTES|8DQt5h-f9NI|https://www.youtube.com/watch?v=8DQt5h-f9NI"
    "PUSC|JUAN CARLOS HIDALGO BOGANTES|z_UOFQKZKxI|https://www.youtube.com/watch?v=z_UOFQKZKxI"
)

# Descargar transcripciones
for video_info in "${VIDEOS[@]}"; do
    CURRENT=$((CURRENT + 1))

    # Parsear información
    IFS='|' read -r PARTY CANDIDATE VIDEO_ID URL <<< "$video_info"

    # Crear nombre de archivo limpio
    CANDIDATE_CLEAN=$(echo "$CANDIDATE" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g' | sed 's/[^a-z0-9-]//g')
    OUTPUT_FILE="$TRANSCRIPT_DIR/${PARTY}-${CANDIDATE_CLEAN}"

    echo -e "${BLUE}[$CURRENT/$TOTAL]${NC} Descargando: ${GREEN}$PARTY${NC} - $CANDIDATE"
    echo -e "   Video ID: $VIDEO_ID"

    # Ejecutar yt-dlp
    if yt-dlp \
        --write-auto-subs \
        --sub-lang es \
        --skip-download \
        --output "$OUTPUT_FILE.%(ext)s" \
        --quiet \
        --no-warnings \
        "$URL" 2>/dev/null; then

        echo -e "   ${GREEN}✓ Descarga exitosa${NC}"
        SUCCESSFUL=$((SUCCESSFUL + 1))

        # Buscar el archivo de subtítulos generado y renombrarlo
        if [ -f "$OUTPUT_FILE.es.vtt" ]; then
            mv "$OUTPUT_FILE.es.vtt" "$OUTPUT_FILE.txt"
            echo -e "   ${GREEN}✓ Archivo guardado: $OUTPUT_FILE.txt${NC}"
        elif [ -f "$OUTPUT_FILE.es.srv3" ]; then
            mv "$OUTPUT_FILE.es.srv3" "$OUTPUT_FILE.txt"
            echo -e "   ${GREEN}✓ Archivo guardado: $OUTPUT_FILE.txt${NC}"
        elif [ -f "$OUTPUT_FILE.es.srv2" ]; then
            mv "$OUTPUT_FILE.es.srv2" "$OUTPUT_FILE.txt"
            echo -e "   ${GREEN}✓ Archivo guardado: $OUTPUT_FILE.txt${NC}"
        elif [ -f "$OUTPUT_FILE.es.srv1" ]; then
            mv "$OUTPUT_FILE.es.srv1" "$OUTPUT_FILE.txt"
            echo -e "   ${GREEN}✓ Archivo guardado: $OUTPUT_FILE.txt${NC}"
        else
            echo -e "   ${YELLOW}⚠ Archivo de subtítulos no encontrado en formato esperado${NC}"
        fi
    else
        echo -e "   ${RED}✗ Error en la descarga${NC}"
        FAILED=$((FAILED + 1))
    fi

    echo ""

    # Pequeña pausa para no saturar YouTube
    sleep 2
done

# Resumen final
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}           RESUMEN FINAL${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ Exitosas:${NC} $SUCCESSFUL/$TOTAL"
echo -e "${RED}✗ Fallidas:${NC}  $FAILED/$TOTAL"
echo ""
echo -e "Archivos guardados en: ${YELLOW}$TRANSCRIPT_DIR/${NC}"
echo ""

if [ $SUCCESSFUL -gt 0 ]; then
    echo -e "${GREEN}Siguiente paso:${NC} Procesar las transcripciones con:"
    echo -e "${YELLOW}npm run process-transcripts${NC}"
fi

exit 0
