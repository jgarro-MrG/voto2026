/**
 * Cuestionario v2 - Basado en propuestas reales de candidatos
 *
 * Cambios principales:
 * - Opciones son propuestas generalizadas extraídas de los 20 candidatos
 * - Cada opción tiene lista de candidatos que la apoyan
 * - Permite selección múltiple
 * - Nueva sección de perfil de liderazgo
 */

export interface ProposalOption {
  id: string
  text: string
  description: string
  candidatos: string[] // Códigos de partido que apoyan esta propuesta
}

export interface QuestionV2 {
  id: number
  text: string
  dimension: string
  multiSelect: boolean
  options: ProposalOption[]
}

export const QUESTIONS_V2: QuestionV2[] = [
  // ============================================
  // SECCIÓN 1: PROPUESTAS POR DIMENSIÓN
  // ============================================

  // SEGURIDAD
  {
    id: 1,
    text: '¿Cómo debería Costa Rica enfrentar el crimen organizado y la inseguridad?',
    dimension: 'security',
    multiSelect: true,
    options: [
      {
        id: 'sec-1a',
        text: 'Mano dura: endurecer penas y prisión preventiva obligatoria',
        description: 'Aumentar penas para sicariato, narcotráfico y crimen organizado. Eliminar medidas alternativas para delitos graves.',
        candidatos: ['ACRM', 'CR1', 'PEN', 'PNG', 'PNR', 'PPSD', 'PPSO']
      },
      {
        id: 'sec-1b',
        text: 'Reforma carcelaria: trabajo obligatorio y rehabilitación',
        description: 'Que privados de libertad trabajen, separar violentos de no violentos, enfoque en reinserción social.',
        candidatos: ['PA', 'PCDS', 'PDLCT', 'PIN', 'PJSC', 'PLP', 'PUSC', 'UP']
      },
      {
        id: 'sec-1c',
        text: 'Prevención: rescatar jóvenes del crimen con oportunidades',
        description: 'Ofrecer estudio y trabajo a jóvenes en riesgo, trabajo social comunitario, atacar causas de la criminalidad.',
        candidatos: ['PCDS', 'PA', 'PEL', 'PEN', 'UP']
      },
      {
        id: 'sec-1d',
        text: 'Fortalecer policía y coordinación institucional',
        description: 'Mejores condiciones para policías, más recursos a OIJ y Fiscalía, coordinación entre fuerzas de seguridad.',
        candidatos: ['ACRM', 'CR1', 'PEN', 'PLP', 'PLN', 'PCAC']
      }
    ]
  },

  // ECONOMÍA
  {
    id: 2,
    text: '¿Cuál debería ser la estrategia para reactivar la economía?',
    dimension: 'economy',
    multiSelect: true,
    options: [
      {
        id: 'eco-2a',
        text: 'Reducir cargas: menos impuestos y menos burocracia',
        description: 'Reducir cargas sociales, simplificar trámites, reducir ministerios y gasto público.',
        candidatos: ['ACRM', 'CR1', 'PA', 'PEN', 'PUSC']
      },
      {
        id: 'eco-2b',
        text: 'Descentralizar: desarrollo económico fuera del GAM',
        description: 'Crear zonas especiales en costas y zonas rurales, infraestructura fuera del Valle Central.',
        candidatos: ['ACRM', 'PIN', 'PLP', 'PLN', 'PPSD', 'PUCD', 'PUSC']
      },
      {
        id: 'eco-2c',
        text: 'Atraer inversión extranjera y zonas francas',
        description: 'Expandir zonas francas, ventanilla única digital, simplificar permisos para inversión.',
        candidatos: ['ACRM', 'PA', 'PEN', 'PIN', 'PLP', 'PPSD', 'PPSO', 'PUCD']
      },
      {
        id: 'eco-2d',
        text: 'Fortalecer producción nacional y revisar TLCs',
        description: 'Priorizar industria local, revisar tratados de libre comercio, proteger empleo nacional.',
        candidatos: ['FA', 'PDLCT', 'CR1', 'PJSC', 'PNG']
      }
    ]
  },

  // EDUCACIÓN
  {
    id: 3,
    text: '¿Qué tipo de reforma educativa necesita Costa Rica?',
    dimension: 'education',
    multiSelect: true,
    options: [
      {
        id: 'edu-3a',
        text: 'Educación técnica y dual vinculada al empleo',
        description: 'Fortalecer colegios técnicos, educación dual con empresas, vincular formación con demanda laboral.',
        candidatos: ['ACRM', 'PCAC', 'PCDS', 'PEN', 'PJSC', 'PLP', 'PNR', 'PUSC', 'UP']
      },
      {
        id: 'edu-3b',
        text: 'Modernización tecnológica y bilingüismo',
        description: 'Programación desde primaria, inteligencia artificial, inglés efectivo desde temprana edad.',
        candidatos: ['ACRM', 'PA', 'PEN', 'PJSC', 'PLN', 'PNR', 'PPSO']
      },
      {
        id: 'edu-3c',
        text: 'Fortalecer valores, civismo e identidad nacional',
        description: 'Educación cívica, valores tradicionales, enseñar historia verdadera del país.',
        candidatos: ['PA', 'PEN', 'PJSC', 'PNG', 'PNR', 'PPSD']
      },
      {
        id: 'edu-3d',
        text: 'Inversión pública: mantener 8% PIB y fortalecer educación pública',
        description: 'Cumplir mandato constitucional, fortalecer educación pública en todos los niveles.',
        candidatos: ['FA', 'PCAC', 'PEL', 'PDLCT', 'PLN', 'PLP']
      }
    ]
  },

  // SALUD
  {
    id: 4,
    text: '¿Cómo mejorar el sistema de salud costarricense?',
    dimension: 'health',
    multiSelect: true,
    options: [
      {
        id: 'sal-4a',
        text: 'Abrir competencia: permitir aseguradoras privadas',
        description: 'Eliminar monopolio de CCSS, modelo mixto con opciones públicas y privadas.',
        candidatos: ['ACRM', 'PEN']
      },
      {
        id: 'sal-4b',
        text: 'Fortalecer sistema público: más inversión y EBAIS',
        description: 'Aumentar inversión en CCSS, completar EBAIS pendientes, reducir listas de espera con recursos públicos.',
        candidatos: ['FA', 'PCAC', 'PEL', 'PIN', 'PLN', 'PPSD', 'PUCD']
      },
      {
        id: 'sal-4c',
        text: 'Reforma de pensiones para sostenibilidad',
        description: 'Hacer sostenible el IVM, reformar sistema contributivo, garantizar pensiones dignas.',
        candidatos: ['PEL', 'PLP', 'PPSO', 'PUCD', 'PUSC', 'PNG']
      },
      {
        id: 'sal-4d',
        text: 'Red de cuido integrada con salud',
        description: 'Centros de cuido con atención médica para niños, adultos mayores y personas con discapacidad.',
        candidatos: ['PIN', 'PNG', 'PLN', 'UP', 'PPSO', 'PJSC']
      }
    ]
  },

  // AGRICULTURA
  {
    id: 5,
    text: '¿Cómo apoyar al sector agropecuario?',
    dimension: 'agriculture',
    multiSelect: true,
    options: [
      {
        id: 'agr-5a',
        text: 'Asistencia técnica, crédito accesible y seguros de cosecha',
        description: 'MAG activo en fincas, crédito blando para agricultores, seguros ante cambio climático.',
        candidatos: ['ACRM', 'PA', 'PCAC', 'PEN', 'PIN', 'PLP', 'PNG', 'PPSD', 'PPSO', 'PUSC', 'UP']
      },
      {
        id: 'agr-5b',
        text: 'Proteger producción nacional: revisar TLCs y limitar importaciones',
        description: 'Proteger productos básicos (arroz, frijoles), revisar tratados que perjudican agricultores.',
        candidatos: ['CR1', 'FA', 'PEL', 'PJSC', 'PNG']
      },
      {
        id: 'agr-5c',
        text: 'Eliminar intermediarios: precios justos al productor',
        description: 'Conectar productores directamente con compradores, regular márgenes de ganancia.',
        candidatos: ['ACRM', 'FA', 'PCDS', 'PEN', 'PJSC', 'PNR']
      },
      {
        id: 'agr-5d',
        text: 'Agroindustria: valor agregado y exportación',
        description: 'Parques agroindustriales, productos terminados, tecnificación para exportar.',
        candidatos: ['ACRM', 'PIN', 'PNG', 'PNR']
      }
    ]
  },

  // MEDIO AMBIENTE
  {
    id: 6,
    text: '¿Cuál debería ser el enfoque ambiental de Costa Rica?',
    dimension: 'environment',
    multiSelect: true,
    options: [
      {
        id: 'amb-6a',
        text: 'Balance pragmático: desarrollo sin frenar el progreso',
        description: 'Proteger ambiente sin limitar crecimiento económico, revisar regulaciones excesivas.',
        candidatos: ['ACRM', 'CR1', 'PA', 'PEN', 'PNR']
      },
      {
        id: 'amb-6b',
        text: 'Explorar recursos naturales responsablemente',
        description: 'Permitir minería responsable, explorar gas/petróleo con estándares ambientales.',
        candidatos: ['PA', 'PEN', 'PNR']
      },
      {
        id: 'amb-6c',
        text: 'Energías renovables y carbono neutralidad',
        description: 'Geotermia, eólica, hidroeléctrica, energía de basura, liderazgo climático.',
        candidatos: ['PEN', 'PNG', 'PCAC', 'PJSC']
      },
      {
        id: 'amb-6d',
        text: 'Conservación activa con beneficio a comunidades',
        description: 'Fondos verdes, pago por servicios ambientales, áreas protegidas que generen ingresos locales.',
        candidatos: ['FA', 'PIN', 'PLP', 'PPSO']
      }
    ]
  },

  // REFORMAS DEL ESTADO
  {
    id: 7,
    text: '¿Qué reformas institucionales son prioritarias?',
    dimension: 'reforms',
    multiSelect: true,
    options: [
      {
        id: 'ref-7a',
        text: 'Reducir Estado: fusionar ministerios y digitalizar',
        description: 'Eliminar instituciones duplicadas, reducir ministerios, trámites 100% digitales.',
        candidatos: ['ACRM', 'CR1', 'PEN', 'PPSO']
      },
      {
        id: 'ref-7b',
        text: 'Descentralización: más poder a municipios y regiones',
        description: 'Transferir competencias y recursos a gobiernos locales, autonomía regional.',
        candidatos: ['PEN', 'PLN', 'PNR']
      },
      {
        id: 'ref-7c',
        text: 'Modernizar instituciones: facilitar en vez de obstaculizar',
        description: 'Actualizar instituciones al siglo XXI, eliminar burocracia, cambiar cultura de servicio.',
        candidatos: ['FA', 'PA', 'PCAC', 'PPSO', 'UP']
      },
      {
        id: 'ref-7d',
        text: 'Reforma de pensiones: hacer sistema sostenible',
        description: 'Reformar IVM, mejorar rentabilidad de fondos, garantizar pensiones dignas a largo plazo.',
        candidatos: ['PA', 'PEL', 'PLP', 'PNG', 'PPSO', 'PUCD', 'PUSC']
      }
    ]
  },

  // POLÍTICA SOCIAL
  {
    id: 8,
    text: '¿Cuál debería ser el enfoque de política social?',
    dimension: 'social',
    multiSelect: true,
    options: [
      {
        id: 'soc-8a',
        text: 'Empleo sobre asistencialismo: capacitación y trabajo',
        description: 'Promover independencia económica mediante capacitación y empleo, no subsidios permanentes.',
        candidatos: ['ACRM', 'CR1', 'PA', 'PEN', 'PPSO', 'PUCD', 'UP']
      },
      {
        id: 'soc-8b',
        text: 'Red de cuido universal: niños, adultos mayores, discapacidad',
        description: 'Ampliar cobertura de cuido con horarios flexibles para todas las poblaciones vulnerables.',
        candidatos: ['PA', 'PCAC', 'PIN', 'PLN', 'PLP', 'PNG', 'PPSO', 'PUSC', 'UP']
      },
      {
        id: 'soc-8c',
        text: 'Inversión social sostenida en poblaciones vulnerables',
        description: 'Aumentar presupuesto social, proteger niñez, mujeres, adultos mayores, personas con discapacidad.',
        candidatos: ['FA', 'PDLCT', 'PEL', 'PUCD', 'PCDS']
      },
      {
        id: 'soc-8d',
        text: 'Fortalecer familia y valores tradicionales',
        description: 'Defender valores familiares, promover desde la educación, Ministerio de la Familia.',
        candidatos: ['CR1', 'PEL', 'PEN', 'PNR']
      }
    ]
  },

  // ============================================
  // SECCIÓN 2: PERFIL DE LIDERAZGO
  // ============================================

  {
    id: 9,
    text: '¿Qué tipo de líder considera más apto para gobernar Costa Rica?',
    dimension: 'leadership',
    multiSelect: false,
    options: [
      {
        id: 'lid-9a',
        text: 'Negociador/Dialogante',
        description: 'Busca consensos, trabaja con todos los poderes del Estado, prioriza acuerdos y diálogo.',
        candidatos: ['PLN', 'PUSC', 'PJSC', 'PCAC', 'PPSD']
      },
      {
        id: 'lid-9b',
        text: 'Ejecutivo/Decidido',
        description: 'Toma decisiones rápidas, ejecuta con firmeza, menos consulta y más acción directa.',
        candidatos: ['PPSO', 'PNR', 'PEN', 'PLP']
      },
      {
        id: 'lid-9c',
        text: 'Técnico/Pragmático',
        description: 'Decisiones basadas en datos y evidencia, experiencia profesional, menos ideología.',
        candidatos: ['PIN', 'PUCD', 'PA', 'PEL', 'UP']
      },
      {
        id: 'lid-9d',
        text: 'Transformador/Reformista',
        description: 'Cambios estructurales profundos, no teme confrontar intereses establecidos.',
        candidatos: ['FA', 'PDLCT', 'CR1', 'ACRM']
      }
    ]
  },

  {
    id: 10,
    text: '¿Qué tipo de experiencia valora más en un candidato presidencial?',
    dimension: 'experience',
    multiSelect: false,
    options: [
      {
        id: 'exp-10a',
        text: 'Gestión pública: ministros, viceministros, funcionarios',
        description: 'Experiencia en gobierno, conoce cómo funciona el Estado desde adentro.',
        candidatos: ['PPSO', 'PLN', 'PUSC', 'PJSC', 'PCAC', 'PEL', 'UP']
      },
      {
        id: 'exp-10b',
        text: 'Sector privado: empresarios, ejecutivos',
        description: 'Experiencia gerencial, conoce cómo crear empleo y generar riqueza.',
        candidatos: ['PLP', 'PA', 'PPSD', 'PEN']
      },
      {
        id: 'exp-10c',
        text: 'Académica/Técnica: profesores, investigadores, expertos',
        description: 'Conocimiento profundo en políticas públicas, formación académica sólida.',
        candidatos: ['PIN', 'PUCD', 'FA', 'PCDS']
      },
      {
        id: 'exp-10d',
        text: 'Activismo/Sociedad civil: líderes comunitarios, ONGs',
        description: 'Conexión con la gente, experiencia en movimientos sociales y comunidades.',
        candidatos: ['PDLCT', 'PNG', 'CR1', 'ACRM', 'PNR']
      }
    ]
  },

  {
    id: 11,
    text: 'Si tuviera que elegir UNA sola prioridad para los próximos 4 años, ¿cuál sería?',
    dimension: 'priority',
    multiSelect: false,
    options: [
      {
        id: 'pri-11a',
        text: 'Seguridad ciudadana: combatir crimen y narcotráfico',
        description: 'La inseguridad es el problema más urgente que afecta a todas las familias.',
        candidatos: ['PNR', 'PPSO', 'PEN', 'ACRM', 'CR1', 'PNG']
      },
      {
        id: 'pri-11b',
        text: 'Reactivación económica: empleo y crecimiento',
        description: 'Sin economía fuerte no hay recursos para nada más, el empleo es la base.',
        candidatos: ['PLP', 'PA', 'PIN', 'PUSC', 'PPSD', 'PUCD']
      },
      {
        id: 'pri-11c',
        text: 'Educación: reforma educativa integral',
        description: 'La educación transforma todo a largo plazo, es la inversión más importante.',
        candidatos: ['PLN', 'PCAC', 'PJSC', 'PEL']
      },
      {
        id: 'pri-11d',
        text: 'Reducir desigualdad: inversión social y oportunidades',
        description: 'La brecha entre ricos y pobres es el problema fundamental del país.',
        candidatos: ['FA', 'PDLCT', 'PCDS', 'UP']
      }
    ]
  }
]

// Dimensiones con nombres en español
export const DIMENSION_NAMES: Record<string, string> = {
  security: 'Seguridad y Justicia',
  economy: 'Economía y Empleo',
  education: 'Educación',
  health: 'Salud',
  agriculture: 'Sector Agropecuario',
  environment: 'Medio Ambiente',
  reforms: 'Reformas del Estado',
  social: 'Política Social',
  leadership: 'Estilo de Liderazgo',
  experience: 'Experiencia Valorada',
  priority: 'Prioridad Nacional'
}

// Tooltips para cada dimensión
export const DIMENSION_TOOLTIPS: Record<string, string> = {
  security: 'Propuestas sobre crimen organizado, sistema carcelario, policía y prevención del delito.',
  economy: 'Estrategias para reactivar la economía, empleo, impuestos y rol del Estado.',
  education: 'Reformas al sistema educativo, inversión, educación técnica y valores.',
  health: 'Sistema de salud, CCSS, pensiones y red de cuido.',
  agriculture: 'Apoyo a agricultores, seguridad alimentaria, TLCs y agroindustria.',
  environment: 'Balance desarrollo-ambiente, energías renovables y conservación.',
  reforms: 'Modernización del Estado, descentralización y reformas institucionales.',
  social: 'Políticas sociales, red de cuido, poblaciones vulnerables y familia.',
  leadership: 'El estilo de liderazgo que considera más efectivo para gobernar.',
  experience: 'El tipo de experiencia profesional que valora en un candidato.',
  priority: 'La prioridad que considera más urgente para el próximo gobierno.'
}

export default QUESTIONS_V2
