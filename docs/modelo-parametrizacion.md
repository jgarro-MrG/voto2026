# Modelo de Parametrización - Voto2026

## Resumen Ejecutivo

Este documento presenta el modelo de parametrización para comparar los 20 planes de gobierno de las elecciones presidenciales de Costa Rica 2026.

##

 Partidos y Candidatos Identificados

1. **PUSC (Partido Unidad Social Cristiana)** - Juan Carlos Hidalgo - "Emparejar la cancha"
2. **Alianza Costa Rica Primero (CR1)** - Douglas Caamaño Quirós
3. **Partido Esperanza Nacional** - Claudio Alpízar Otoya
4. **Partido Integración Nacional** - (Candidato por identificar)
5. **Partido Liberal Progresista (PLP)** - "Seguros, Libres y Prósperos"
6. **Partido Unión Costarricense Democrática (PUCD)** - Boris Molina Acevedo - "Costa Rica Merece Más"
7. **Partido Centro Democrático y Social (CDS)** - Tres pilares: Seguridad, Salud, Educación
8. *(13 partidos adicionales por analizar)*

## Dimensiones de Parametrización

Basado en el análisis de los planes de gobierno, se han identificado **8 dimensiones clave** que permiten comparar y evaluar las propuestas:

### 1. **Seguridad y Justicia**
Mide la postura sobre:
- Combate al crimen organizado y narcotráfico
- Incremento de fuerza policial y equipamiento
- Reformas al sistema penitenciario
- Control de fronteras y migración
- Prevención del delito
- Combate a la corrupción

**Escala:**
- Enfoque punitivo fuerte (mano dura)
- Equilibrado (prevención + represión)
- Enfoque preventivo y social

### 2. **Economía y Empleo**
Evalúa:
- Rol del Estado en la economía
- Apoyo a PYMES y emprendimiento
- Política fiscal y tributaria
- Comercio exterior e inversión extranjera
- Relación con banca estatal vs privada
- Generación de empleo

**Escala:**
- Liberal (mercado libre, Estado mínimo)
- Economía mixta
- Intervencionista (Estado fuerte en economía)

### 3. **Educación**
Analiza:
- Inversión en educación (% del PIB)
- Reforma del sistema educativo
- Educación técnica y vocacional
- Tecnología en educación
- Bilingüismo
- Calidad educativa y evaluación

**Escala:**
- Reforma radical del sistema
- Mejoras incrementales
- Mantener sistema actual con ajustes mínimos

### 4. **Salud (CCSS)**
Evalúa:
- Sostenibilidad financiera de la CCSS
- Reducción de listas de espera
- Infraestructura hospitalaria
- Modelo de atención (público vs mixto)
- Prevención y salud pública
- Digitalización de servicios

**Escala:**
- Apertura a servicios privados/mixtos
- Fortalecimiento del sistema público
- Reforma estructural profunda

### 5. **Sector Agropecuario**
Mide:
- Apoyo a pequeños y medianos productores
- Seguridad alimentaria
- Tecnificación agrícola
- Protección vs apertura comercial
- Crédito y financiamiento rural
- Innovación en agricultura

**Escala:**
- Proteccionista (apoyo fuerte a producción nacional)
- Equilibrado
- Apertura comercial (competencia internacional)

### 6. **Medio Ambiente y Sostenibilidad**
Analiza:
- Compromiso con descarbonización
- Energías renovables
- Gestión de recursos hídricos
- Áreas protegidas
- Cambio climático
- Desarrollo sostenible

**Escala:**
- Prioridad ambiental máxima
- Balance desarrollo-ambiente
- Desarrollo económico prioritario

### 7. **Reformas Institucionales**
Evalúa propuestas sobre:
- Reforma del Estado y burocracia
- Contraloría General de la República
- Poder Judicial
- Descentralización y municipalidades
- Transparencia y rendición de cuentas
- Digitalización del Estado

**Escala:**
- Reformas profundas y estructurales
- Reformas moderadas
- Mejoras administrativas puntuales

### 8. **Política Social e Inclusión**
Mide:
- Programas de combate a la pobreza
- Vivienda social
- Pensiones y seguridad social
- Atención a poblaciones vulnerables
- Igualdad de género
- Derechos humanos
- Red de cuido

**Escala:**
- Universalista (programas para todos)
- Focalizado (apoyo a más vulnerables)
- Responsabilidad individual

## Dimensiones Complementarias

### 9. **Infraestructura y Transporte**
- Carreteras y vías
- Puertos y aeropuertos
- Transporte público
- Ferrocarriles
- Conectividad digital

### 10. **Tecnología y Digitalización**
- Transformación digital del Estado
- Educación tecnológica
- Atracción de empresas tech
- Conectividad e internet
- Inteligencia artificial

## Sistema de Puntuación

Cada dimensión se califica en una escala de 1 a 5, donde:

- **1**: Postura muy conservadora/tradicional/de mercado libre
- **2**: Postura moderadamente conservadora
- **3**: Postura centrista/equilibrada
- **4**: Postura moderadamente progresista/intervencionista
- **5**: Postura muy progresista/intervencionista/de Estado fuerte

## Método de Matching

El algoritmo de matching funcionará así:

1. **Usuario responde cuestionario** (15-20 preguntas)
2. **Se generan puntuaciones por dimensión** para el usuario
3. **Se compara con perfiles de candidatos** usando distancia euclidiana
4. **Se calculan porcentajes de afinidad** por dimensión
5. **Se presentan top 3 candidatos** con mayor afinidad

### Fórmula de Afinidad

```
Afinidad = 100 - (distancia_euclidiana / distancia_máxima * 100)
```

Donde:
- distancia_euclidiana = √Σ(puntuación_usuario - puntuación_candidato)²
- distancia_máxima = √(n_dimensiones * 4²) = máxima diferencia posible

## Próximos Pasos

1. Completar análisis detallado de los 20 planes
2. Generar perfiles parametrizados para cada candidato
3. Diseñar cuestionario específico
4. Implementar algoritmo de matching
5. Crear visualizaciones de resultados
