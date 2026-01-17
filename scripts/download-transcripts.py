#!/usr/bin/env python3
"""
Script para descargar transcripciones de entrevistas del TSE
Usando youtube-transcript-api

Requisito: pip install youtube-transcript-api
"""

import os
import sys
from pathlib import Path

try:
    from youtube_transcript_api import YouTubeTranscriptApi
    from youtube_transcript_api._errors import (
        TranscriptsDisabled,
        NoTranscriptFound,
        VideoUnavailable
    )
except ImportError:
    print("❌ Error: youtube-transcript-api no está instalado")
    print("Instálalo con: pip install youtube-transcript-api")
    sys.exit(1)

# Colores ANSI
GREEN = '\033[0;32m'
BLUE = '\033[0;34m'
RED = '\033[0;31m'
YELLOW = '\033[1;33m'
NC = '\033[0m'

# Lista de videos: (Partido, Candidato, Video ID)
VIDEOS = [
    ("PJSC", "WALTER RUBEN HERNANDEZ JUAREZ", "NFy3G6jqJjg"),
    ("PPSD", "LUZ MARY ALPIZAR LOAIZA", "oh-LZ8mQ_UM"),
    ("PUCD", "BORIS MOLINA ACEVEDO", "YwYAhBZKQEA"),
    ("UP", "NATALIA DIAZ QUINTANA", "1Mf3kzWgKaw"),
    ("PNG", "FERNANDO DIONISIO ZAMORA CASTELLANOS", "LWlrGVAiZR4"),
    ("PEL", "MARCO DAVID RODRIGUEZ BADILLA", "16xBb_hILa0"),
    ("PDLCT", "DAVID HERNANDEZ BRENES", "Ivza06J0gjU"),
    ("PCDS", "ANA VIRGINIA CALZADA MIRANDA", "HKVIEttQCTk"),
    ("PCAC", "CLAUDIA VANESSA DOBLES CAMARGO", "hqiS-X0CiEM"),
    ("PNR", "GERARDO FABRICIO ALVARADO MUÑOZ", "4GWGCR-21mM"),
    ("ACRM", "RONNY CASTILLO GONZALEZ", "rc7G3-n-6G8"),
    ("PLP", "ELIECER FEINZAIG MINTZ", "tdN_G9Jh0mc"),
    ("PPSO", "LAURA FERNANDEZ DELGADO", "LdDuLaJ-iH4"),
    ("PA", "JOSE MIGUEL AGUILAR BERROCAL", "uDmPQotyZRM"),
    ("PEN", "CLAUDIO ALBERTO ALPIZAR OTOYA", "_ctmDd36skw"),
    ("PLN", "ALVARO ROBERTO RAMOS CHAVES", "yxStLBeuNEI"),
    ("CR1", "DOUGLAS CAAMAÑO QUIROS", "pcpe9SEXgRc"),
    ("PIN", "LUIS ESTEBAN AMADOR JIMENEZ", "XFx-_JBlyKo"),
    ("FA", "ANDRES ARIEL ROBLES BARRANTES", "8DQt5h-f9NI"),
    ("PUSC", "JUAN CARLOS HIDALGO BOGANTES", "z_UOFQKZKxI"),
]

def clean_filename(text):
    """Limpia el texto para crear un nombre de archivo válido"""
    return text.lower().replace(' ', '-').replace('ñ', 'n').replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u')

def download_transcript(video_id, party, candidate, output_dir):
    """Descarga la transcripción de un video"""
    try:
        # Obtener transcripción en español
        transcript_list = YouTubeTranscriptApi.get_transcript(
            video_id,
            languages=['es', 'es-419', 'es-ES']
        )

        # Unir todo el texto
        full_text = '\n'.join([entry['text'] for entry in transcript_list])

        # Crear nombre de archivo
        candidate_clean = clean_filename(candidate)
        filename = f"{party}-{candidate_clean}.txt"
        filepath = output_dir / filename

        # Guardar archivo
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(full_text)

        return True, filepath

    except TranscriptsDisabled:
        return False, "Transcripciones deshabilitadas para este video"
    except NoTranscriptFound:
        return False, "No se encontró transcripción en español"
    except VideoUnavailable:
        return False, "Video no disponible"
    except Exception as e:
        return False, f"Error: {str(e)}"

def main():
    print(f"{BLUE}========================================{NC}")
    print(f"{BLUE}  Descargando Transcripciones del TSE{NC}")
    print(f"{BLUE}========================================{NC}\n")

    # Crear directorio de salida
    output_dir = Path("docs/transcripciones")
    output_dir.mkdir(parents=True, exist_ok=True)

    total = len(VIDEOS)
    successful = 0
    failed = 0

    for i, (party, candidate, video_id) in enumerate(VIDEOS, 1):
        print(f"{BLUE}[{i}/{total}]{NC} Descargando: {GREEN}{party}{NC} - {candidate}")
        print(f"   Video ID: {video_id}")

        success, result = download_transcript(video_id, party, candidate, output_dir)

        if success:
            print(f"   {GREEN}✓ Descarga exitosa{NC}")
            print(f"   {GREEN}✓ Archivo guardado: {result}{NC}")
            successful += 1
        else:
            print(f"   {RED}✗ Error: {result}{NC}")
            failed += 1

        print()

    # Resumen final
    print(f"{BLUE}========================================{NC}")
    print(f"{BLUE}           RESUMEN FINAL{NC}")
    print(f"{BLUE}========================================{NC}")
    print(f"{GREEN}✓ Exitosas:{NC} {successful}/{total}")
    print(f"{RED}✗ Fallidas:{NC}  {failed}/{total}")
    print()
    print(f"Archivos guardados en: {YELLOW}{output_dir}{NC}")
    print()

    if successful > 0:
        print(f"{GREEN}Siguiente paso:{NC} Procesar las transcripciones con:")
        print(f"{YELLOW}npm run process-transcripts{NC}")

if __name__ == "__main__":
    main()
