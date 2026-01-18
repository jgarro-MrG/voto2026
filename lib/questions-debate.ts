/**
 * Cuestionario v3 - Formato Debate
 *
 * Basado en las entrevistas del TSE a cada candidato.
 * Cada candidato aparece en EXACTAMENTE UNA postura por pregunta.
 * El usuario elige la postura con la que más se identifica.
 */

export interface DebateOption {
  id: string
  postura: string
  descripcion: string
  candidatos: string[] // Exactamente los candidatos que sostienen esta postura
}

export interface DebateQuestion {
  id: number
  tema: string
  dimension: string
  pregunta: string
  contexto: string // Contexto del moderador
  options: DebateOption[]
}

/**
 * Pesos por dimensión
 * Las preguntas de perfil de liderazgo tienen mayor peso (3x)
 */
export const DIMENSION_WEIGHTS: Record<string, number> = {
  security: 1,
  economy: 1,
  education: 1,
  health: 1,
  agriculture: 1,
  environment: 1,
  reforms: 1,
  social: 1,
  leadership: 3,
  experience: 3,
  priority: 3,
}

export const DEBATE_QUESTIONS: DebateQuestion[] = [
  // ============================================
  // SECCIÓN 1: TEMAS DE GOBIERNO (8 preguntas)
  // ============================================

  {
    id: 1,
    tema: 'SEGURIDAD CIUDADANA',
    dimension: 'security',
    pregunta: '¿Cuál es su estrategia para combatir el crimen organizado y la inseguridad?',
    contexto: 'Costa Rica enfrenta niveles históricos de violencia y presencia del narcotráfico.',
    options: [
      {
        id: 'sec-a',
        postura: 'Mano dura y control estricto',
        descripcion: 'Endurecer penas, fortalecer policía, control migratorio estricto, eliminar beneficios carcelarios para delitos graves.',
        candidatos: ['ACRM', 'CR1', 'PA', 'PEN', 'PNG', 'PNR', 'PPSO', 'UP']
      },
      {
        id: 'sec-b',
        postura: 'Fortalecimiento institucional equilibrado',
        descripcion: 'Mejorar coordinación policial, modernizar sistema judicial, trabajo carcelario con rehabilitación.',
        candidatos: ['PCAC', 'PEL', 'PJSC', 'PLN', 'PLP', 'PPSD', 'PUCD', 'PUSC']
      },
      {
        id: 'sec-c',
        postura: 'Prevención y atención de causas',
        descripcion: 'Invertir en prevención, oportunidades para jóvenes en riesgo, reducir desigualdad como causa del crimen.',
        candidatos: ['FA', 'PCDS', 'PDLCT']
      },
      {
        id: 'sec-d',
        postura: 'Enfoque integral comunitario',
        descripcion: 'Combinar seguridad con desarrollo local, trabajo con comunidades, inteligencia y tecnología.',
        candidatos: ['PIN']
      }
    ]
  },

  {
    id: 2,
    tema: 'ECONOMÍA Y EMPLEO',
    dimension: 'economy',
    pregunta: '¿Cómo reactivar la economía y generar empleo de calidad?',
    contexto: 'El desempleo supera el 10% y muchos costarricenses trabajan en la informalidad.',
    options: [
      {
        id: 'eco-a',
        postura: 'Reducir Estado y liberar mercado',
        descripcion: 'Menos impuestos, menos regulación, reducir tamaño del Estado, atraer inversión extranjera.',
        candidatos: ['ACRM', 'CR1', 'PA', 'PEN', 'PNG', 'PNR', 'PPSO', 'PUSC']
      },
      {
        id: 'eco-b',
        postura: 'Alianza público-privada estratégica',
        descripcion: 'Estado facilitador, zonas francas, simplificar trámites, desarrollo regional equilibrado.',
        candidatos: ['PCAC', 'PCDS', 'PIN', 'PJSC', 'PLP', 'PPSD', 'UP']
      },
      {
        id: 'eco-c',
        postura: 'Fortalecer producción nacional',
        descripcion: 'Proteger industria local, revisar TLCs, economía solidaria, banca de desarrollo.',
        candidatos: ['FA', 'PDLCT', 'PEL', 'PLN', 'PUCD']
      }
    ]
  },

  {
    id: 3,
    tema: 'EDUCACIÓN',
    dimension: 'education',
    pregunta: '¿Qué tipo de reforma educativa necesita Costa Rica?',
    contexto: 'El sistema educativo enfrenta rezago, deserción y desconexión con el mercado laboral.',
    options: [
      {
        id: 'edu-a',
        postura: 'Valores tradicionales y disciplina',
        descripcion: 'Fortalecer valores cívicos, identidad nacional, respeto a la autoridad, educación en el hogar.',
        candidatos: ['CR1', 'PJSC', 'PNG', 'PNR']
      },
      {
        id: 'edu-b',
        postura: 'Educación técnica y bilingüismo',
        descripcion: 'Colegios técnicos, educación dual, inglés efectivo, vincular con necesidades del mercado.',
        candidatos: ['PA', 'PEN', 'PLP', 'PPSO', 'PUCD', 'PUSC', 'UP']
      },
      {
        id: 'edu-c',
        postura: 'Innovación y transformación digital',
        descripcion: 'Programación desde primaria, habilidades del siglo XXI, tecnología educativa, pensamiento crítico.',
        candidatos: ['ACRM', 'FA', 'PCAC', 'PCDS', 'PDLCT', 'PEL', 'PIN', 'PLN', 'PPSD']
      }
    ]
  },

  {
    id: 4,
    tema: 'SALUD',
    dimension: 'health',
    pregunta: '¿Cómo mejorar el sistema de salud costarricense?',
    contexto: 'Las listas de espera de la CCSS superan el millón de personas y el sistema está bajo presión.',
    options: [
      {
        id: 'sal-a',
        postura: 'Abrir competencia privada',
        descripcion: 'Permitir aseguradoras privadas, modelo mixto, eliminar monopolio de la CCSS.',
        candidatos: ['ACRM', 'PEN']
      },
      {
        id: 'sal-b',
        postura: 'Modernizar y hacer eficiente la CCSS',
        descripcion: 'Mejorar gestión, reducir listas de espera, completar infraestructura, reformar pensiones.',
        candidatos: ['CR1', 'PA', 'PCDS', 'PEL', 'PIN', 'PLP', 'PNG', 'PNR', 'PPSD', 'PPSO', 'PUCD', 'PUSC', 'UP']
      },
      {
        id: 'sal-c',
        postura: 'Fortalecer sistema público universal',
        descripcion: 'Más inversión en CCSS, ampliar EBAIS, red de cuido integrada, salud como derecho.',
        candidatos: ['FA', 'PCAC', 'PDLCT', 'PJSC', 'PLN']
      }
    ]
  },

  {
    id: 5,
    tema: 'AGRICULTURA',
    dimension: 'agriculture',
    pregunta: '¿Cómo apoyar al sector agropecuario nacional?',
    contexto: 'Los agricultores enfrentan competencia desleal, falta de crédito y cambio climático.',
    options: [
      {
        id: 'agr-a',
        postura: 'Proteccionismo y soberanía alimentaria',
        descripcion: 'Proteger producción nacional, revisar TLCs, aranceles a importaciones, precios mínimos.',
        candidatos: ['PNG', 'PNR']
      },
      {
        id: 'agr-b',
        postura: 'Asistencia técnica y crédito accesible',
        descripcion: 'MAG activo en fincas, seguros de cosecha, crédito blando, valor agregado, tecnificación.',
        candidatos: ['ACRM', 'CR1', 'PA', 'PCAC', 'PEN', 'PIN', 'PJSC', 'PLP', 'PPSD', 'PPSO', 'PUSC', 'UP']
      },
      {
        id: 'agr-c',
        postura: 'Agricultura sostenible y mercados justos',
        descripcion: 'Eliminar intermediarios, agricultura orgánica, comercio justo, mercados locales.',
        candidatos: ['FA', 'PCDS', 'PDLCT', 'PEL', 'PLN', 'PUCD']
      }
    ]
  },

  {
    id: 6,
    tema: 'MEDIO AMBIENTE',
    dimension: 'environment',
    pregunta: '¿Cuál debe ser el balance entre desarrollo económico y protección ambiental?',
    contexto: 'Costa Rica tiene una imagen verde pero enfrenta presiones por minería, desarrollo costero y agroindustria.',
    options: [
      {
        id: 'amb-a',
        postura: 'Desarrollo primero, con regulación básica',
        descripcion: 'Permitir minería responsable, explorar hidrocarburos, no frenar el progreso económico.',
        candidatos: ['CR1', 'PEN']
      },
      {
        id: 'amb-b',
        postura: 'Balance pragmático',
        descripcion: 'Desarrollo sostenible, energías renovables, turismo ecológico, regulación equilibrada.',
        candidatos: ['ACRM', 'PA', 'PCAC', 'PEL', 'PJSC', 'PLP', 'PNG', 'PNR']
      },
      {
        id: 'amb-c',
        postura: 'Conservación activa y justicia climática',
        descripcion: 'Prohibir minería, proteger bosques, pago por servicios ambientales, descarbonización.',
        candidatos: ['FA']
      },
      {
        id: 'amb-d',
        postura: 'No tengo una posición clara sobre este tema',
        descripcion: 'Prefiero no definirme o necesito más información para tomar una postura.',
        candidatos: ['PCDS', 'PDLCT', 'PIN', 'PLN', 'PPSD', 'PPSO', 'PUCD', 'PUSC', 'UP']
      }
    ]
  },

  {
    id: 7,
    tema: 'REFORMAS DEL ESTADO',
    dimension: 'reforms',
    pregunta: '¿Qué reformas institucionales son prioritarias?',
    contexto: 'El Estado costarricense es criticado por ineficiente, burocrático y costoso.',
    options: [
      {
        id: 'ref-a',
        postura: 'Reducir Estado drásticamente',
        descripcion: 'Fusionar ministerios, eliminar instituciones, digitalizar todo, reducir planilla estatal.',
        candidatos: ['ACRM', 'PEN', 'PNG', 'PNR']
      },
      {
        id: 'ref-b',
        postura: 'Modernizar sin reducir servicios',
        descripcion: 'Digitalización, simplificar trámites, descentralización, mejorar gestión sin recortar.',
        candidatos: ['PA', 'PCAC', 'PCDS', 'PIN', 'PLP', 'PPSO', 'PUSC', 'UP']
      },
      {
        id: 'ref-c',
        postura: 'Reforma progresista del Estado',
        descripcion: 'Estado eficiente pero robusto, combatir corrupción, transparencia, democracia participativa.',
        candidatos: ['CR1', 'FA', 'PDLCT', 'PEL', 'PJSC', 'PLN', 'PPSD', 'PUCD']
      }
    ]
  },

  {
    id: 8,
    tema: 'POLÍTICA SOCIAL',
    dimension: 'social',
    pregunta: '¿Cuál debe ser el enfoque de la política social?',
    contexto: 'La pobreza afecta al 23% de los hogares y la desigualdad sigue aumentando.',
    options: [
      {
        id: 'soc-a',
        postura: 'Empleo sobre asistencialismo',
        descripcion: 'Capacitación para el trabajo, reducir subsidios, independencia económica, familia tradicional.',
        candidatos: ['CR1', 'PEN', 'PNR']
      },
      {
        id: 'soc-b',
        postura: 'Red de protección focalizada',
        descripcion: 'Ayuda condicionada, transferencias focalizadas, cuido para quienes trabajan, autonomía.',
        candidatos: ['ACRM', 'PA', 'PNG', 'PPSO', 'UP']
      },
      {
        id: 'soc-c',
        postura: 'Inversión social universal',
        descripcion: 'Red de cuido universal, programas sociales amplios, reducir desigualdad, derechos sociales.',
        candidatos: ['FA', 'PCAC', 'PCDS', 'PDLCT', 'PEL', 'PIN', 'PJSC', 'PLN', 'PLP', 'PPSD', 'PUCD', 'PUSC']
      }
    ]
  },

  // ============================================
  // SECCIÓN 2: PERFIL DE LIDERAZGO (3 preguntas)
  // Peso 3x - Basado en el estilo observado en entrevistas
  // ============================================

  {
    id: 9,
    tema: 'ESTILO DE LIDERAZGO',
    dimension: 'leadership',
    pregunta: '¿Qué tipo de líder considera más apto para gobernar?',
    contexto: 'El próximo presidente deberá negociar con una Asamblea fragmentada.',
    options: [
      {
        id: 'lid-a',
        postura: 'Negociador y dialogante',
        descripcion: 'Busca consensos, trabaja con todos los sectores, prioriza acuerdos sobre confrontación.',
        candidatos: ['PCAC', 'PJSC', 'PLN', 'PPSD', 'PUSC']
      },
      {
        id: 'lid-b',
        postura: 'Ejecutivo y decidido',
        descripcion: 'Toma decisiones firmes, ejecuta con rapidez, no teme confrontar cuando es necesario.',
        candidatos: ['ACRM', 'PEN', 'PLP', 'PNR', 'PPSO']
      },
      {
        id: 'lid-c',
        postura: 'Técnico y pragmático',
        descripcion: 'Decisiones basadas en datos, experiencia profesional, menos ideología y más resultados.',
        candidatos: ['PA', 'PCDS', 'PEL', 'PIN', 'PUCD', 'UP']
      },
      {
        id: 'lid-d',
        postura: 'Transformador y reformista',
        descripcion: 'Propone cambios estructurales profundos, confronta intereses establecidos.',
        candidatos: ['CR1', 'FA', 'PDLCT', 'PNG']
      }
    ]
  },

  {
    id: 10,
    tema: 'EXPERIENCIA VALORADA',
    dimension: 'experience',
    pregunta: '¿Qué tipo de experiencia valora más en un candidato presidencial?',
    contexto: 'Los candidatos vienen de diferentes trayectorias profesionales.',
    options: [
      {
        id: 'exp-a',
        postura: 'Gestión pública comprobada',
        descripcion: 'Experiencia como ministro, alcalde o alto funcionario. Conoce el Estado desde adentro.',
        candidatos: ['PCAC', 'PEL', 'PJSC', 'PLN', 'PPSO', 'PUSC', 'UP']
      },
      {
        id: 'exp-b',
        postura: 'Éxito en sector privado',
        descripcion: 'Empresario o ejecutivo exitoso. Sabe crear empleo y manejar presupuestos.',
        candidatos: ['PA', 'PEN', 'PLP', 'PPSD']
      },
      {
        id: 'exp-c',
        postura: 'Formación académica y técnica',
        descripcion: 'Profesor, investigador o experto. Conocimiento profundo de políticas públicas.',
        candidatos: ['FA', 'PCDS', 'PIN', 'PUCD']
      },
      {
        id: 'exp-d',
        postura: 'Activismo y conexión social',
        descripcion: 'Líder comunitario, religioso o de movimientos sociales. Conoce las necesidades del pueblo.',
        candidatos: ['ACRM', 'CR1', 'PDLCT', 'PNG', 'PNR']
      }
    ]
  },

  {
    id: 11,
    tema: 'PRIORIDAD NACIONAL',
    dimension: 'priority',
    pregunta: 'Si tuviera que elegir UNA sola prioridad para los próximos 4 años, ¿cuál sería?',
    contexto: 'Los recursos son limitados y hay que priorizar.',
    options: [
      {
        id: 'pri-a',
        postura: 'Seguridad ciudadana',
        descripcion: 'Combatir el crimen y el narcotráfico es lo más urgente. Sin seguridad no hay desarrollo.',
        candidatos: ['ACRM', 'CR1', 'PEN', 'PNG', 'PNR', 'PPSO']
      },
      {
        id: 'pri-b',
        postura: 'Reactivación económica',
        descripcion: 'Generar empleo y crecimiento es la base. La economía fuerte resuelve otros problemas.',
        candidatos: ['PA', 'PIN', 'PLP', 'PPSD', 'PUCD', 'PUSC']
      },
      {
        id: 'pri-c',
        postura: 'Educación y formación',
        descripcion: 'La educación transforma todo a largo plazo. Es la mejor inversión para el país.',
        candidatos: ['PCAC', 'PEL', 'PJSC', 'PLN']
      },
      {
        id: 'pri-d',
        postura: 'Reducir desigualdad',
        descripcion: 'La brecha social es el problema fundamental. Hay que invertir en los más vulnerables.',
        candidatos: ['FA', 'PCDS', 'PDLCT', 'UP']
      }
    ]
  }
]

// Verificar que cada candidato aparece exactamente una vez por pregunta
export function validateDebateQuestions(): { valid: boolean; errors: string[] } {
  const ALL_PARTIES = [
    'ACRM', 'CR1', 'FA', 'PA', 'PCAC', 'PCDS', 'PDLCT', 'PEL', 'PEN', 'PIN',
    'PJSC', 'PLN', 'PLP', 'PNG', 'PNR', 'PPSD', 'PPSO', 'PUCD', 'PUSC', 'UP'
  ]

  const errors: string[] = []

  for (const question of DEBATE_QUESTIONS) {
    const partiesInQuestion = new Set<string>()
    const duplicates: string[] = []

    for (const option of question.options) {
      for (const party of option.candidatos) {
        if (partiesInQuestion.has(party)) {
          duplicates.push(party)
        }
        partiesInQuestion.add(party)
      }
    }

    if (duplicates.length > 0) {
      errors.push(`Q${question.id} (${question.dimension}): Duplicados: ${duplicates.join(', ')}`)
    }

    const missing = ALL_PARTIES.filter(p => !partiesInQuestion.has(p))
    if (missing.length > 0) {
      errors.push(`Q${question.id} (${question.dimension}): Faltan: ${missing.join(', ')}`)
    }
  }

  return { valid: errors.length === 0, errors }
}

// Nombres de dimensiones en español
export const DIMENSION_NAMES: Record<string, string> = {
  security: 'Seguridad Ciudadana',
  economy: 'Economía y Empleo',
  education: 'Educación',
  health: 'Salud',
  agriculture: 'Agricultura',
  environment: 'Medio Ambiente',
  reforms: 'Reformas del Estado',
  social: 'Política Social',
  leadership: 'Estilo de Liderazgo',
  experience: 'Experiencia',
  priority: 'Prioridad Nacional'
}

export default DEBATE_QUESTIONS
