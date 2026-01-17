import type { Question } from './types'

export const QUESTIONS: Question[] = [
  // SEGURIDAD Y JUSTICIA (3 preguntas)
  {
    id: 1,
    text: '¿Cuál cree que debe ser la prioridad principal para combatir la inseguridad en Costa Rica?',
    dimension: 'security',
    options: [
      {
        value: 1,
        label: 'A',
        text: 'Aumentar significativamente la fuerza policial y endurecer las penas',
        description: 'Enfoque de mano dura: más agentes, penas más severas, y mayor control policial como respuesta directa al crimen.'
      },
      {
        value: 2,
        label: 'B',
        text: 'Fortalecer la policía y mejorar el sistema judicial',
        description: 'Fortalecer instituciones de seguridad existentes, mejorar capacitación policial y hacer más eficiente el sistema de justicia.'
      },
      {
        value: 3,
        label: 'C',
        text: 'Balance entre más policía y programas de prevención social',
        description: 'Enfoque mixto que combina fortalecimiento policial con inversión en programas sociales de prevención del delito.'
      },
      {
        value: 4,
        label: 'D',
        text: 'Priorizar prevención con oportunidades de empleo y educación',
        description: 'Énfasis en prevenir el crimen atacando sus causas mediante educación, empleo y oportunidades para jóvenes.'
      },
      {
        value: 5,
        label: 'E',
        text: 'Enfocarse en causas sociales: desigualdad, educación y oportunidades',
        description: 'Priorizar soluciones de largo plazo atacando desigualdad, pobreza y falta de oportunidades como causas del crimen.'
      }
    ]
  },
  {
    id: 2,
    text: '¿Qué medida considera más efectiva contra el crimen organizado?',
    dimension: 'security',
    options: [
      {
        value: 1,
        label: 'A',
        text: 'Militarización de fronteras y mano dura total',
        description: 'Respuesta de fuerza máxima: desplegar militares en fronteras y aplicar medidas extremas contra organizaciones criminales.'
      },
      {
        value: 2,
        label: 'B',
        text: 'Mayor control fronterizo y cooperación internacional',
        description: 'Reforzar vigilancia fronteriza y trabajar con otros países para combatir redes criminales transnacionales.'
      },
      {
        value: 3,
        label: 'C',
        text: 'Tecnología policial + inteligencia + cooperación regional',
        description: 'Enfoque balanceado usando tecnología avanzada, investigación de inteligencia y coordinación con países vecinos.'
      },
      {
        value: 4,
        label: 'D',
        text: 'Atacar las finanzas del crimen y prevención en comunidades',
        description: 'Combatir el crimen desmantelando sus estructuras financieras y trabajando en prevención a nivel comunitario.'
      },
      {
        value: 5,
        label: 'E',
        text: 'Rehabilitación de personas privadas de libertad y reinserción social',
        description: 'Priorizar la rehabilitación de personas en cárceles y su reintegración a la sociedad para romper ciclos delictivos.'
      }
    ]
  },
  {
    id: 3,
    text: '¿Cómo debe abordarse el tema de corrupción en las instituciones?',
    dimension: 'security',
    options: [
      {
        value: 1,
        label: 'A',
        text: 'Penas severas y ejemplares para funcionarios corruptos',
        description: 'Enfoque punitivo: castigar duramente a funcionarios corruptos con sentencias severas que sirvan de ejemplo.'
      },
      {
        value: 2,
        label: 'B',
        text: 'Fortalecer la fiscalización y los controles existentes',
        description: 'Mejorar la efectividad de las instituciones de control actuales sin cambios estructurales profundos.'
      },
      {
        value: 3,
        label: 'C',
        text: 'Transparencia digital + auditorías + participación ciudadana',
        description: 'Combinar tecnología para transparencia, auditorías regulares y permitir a ciudadanos fiscalizar instituciones.'
      },
      {
        value: 4,
        label: 'D',
        text: 'Reforma de instituciones de control y prevención cultural',
        description: 'Reestructurar órganos de control y trabajar en cambiar la cultura institucional para prevenir corrupción.'
      },
      {
        value: 5,
        label: 'E',
        text: 'Transformación profunda del sistema con participación social',
        description: 'Cambiar radicalmente las estructuras de poder, dando a la ciudadanía mayor control sobre instituciones públicas.'
      }
    ]
  },

  // ECONOMÍA Y EMPLEO (3 preguntas)
  {
    id: 4,
    text: '¿Cuál debe ser el rol del Estado en la economía?',
    dimension: 'economy',
    options: [
      {
        value: 1,
        label: 'A',
        text: 'Mínimo: dejar que el mercado libre regule todo',
        description: 'Estado mínimo: confiar en la libre competencia y las fuerzas del mercado para regular la economía sin intervención.'
      },
      {
        value: 2,
        label: 'B',
        text: 'Facilitar negocios y reducir burocracia, mínima intervención',
        description: 'Rol facilitador: simplificar trámites y reducir regulaciones, permitiendo que el sector privado lidere la economía.'
      },
      {
        value: 3,
        label: 'C',
        text: 'Equilibrio: facilitar empresas pero regular sectores clave',
        description: 'Enfoque mixto: promover libertad empresarial mientras se regula sectores sensibles como salud, educación y servicios básicos.'
      },
      {
        value: 4,
        label: 'D',
        text: 'Regular activamente y apoyar sectores estratégicos',
        description: 'Participación activa: el Estado regula mercados y apoya sectores considerados estratégicos para el desarrollo nacional.'
      },
      {
        value: 5,
        label: 'E',
        text: 'Fuerte intervención: proteger empleo y producción nacional',
        description: 'Estado interventor: controlar sectores clave de la economía, proteger empleos locales y producción nacional.'
      }
    ]
  },
  {
    id: 5,
    text: '¿Cómo se debe apoyar a las pequeñas y medianas empresas (PYMES)?',
    dimension: 'economy',
    options: [
      {
        value: 1,
        label: 'A',
        text: 'Reducir impuestos y eliminar regulaciones para todos',
        description: 'Enfoque de mercado libre: crear ambiente de negocios competitivo reduciendo cargas fiscales y normativas para todos.'
      },
      {
        value: 2,
        label: 'B',
        text: 'Simplificar trámites y facilitar acceso al crédito privado',
        description: 'Apoyo indirecto: eliminar burocracia y conectar PYMEs con financiamiento privado sin intervención estatal directa.'
      },
      {
        value: 3,
        label: 'C',
        text: 'Créditos blandos de banca estatal + capacitación',
        description: 'Apoyo moderado: ofrecer financiamiento a tasas preferenciales y programas de capacitación empresarial desde el Estado.'
      },
      {
        value: 4,
        label: 'D',
        text: 'Programas integrales de apoyo estatal + compras públicas',
        description: 'Apoyo robusto: programas estatales completos y garantizar que PYMEs participen en compras del gobierno.'
      },
      {
        value: 5,
        label: 'E',
        text: 'Protección fuerte del Estado y subsidios directos',
        description: 'Intervención máxima: proteger PYMEs de competencia externa y proveer subsidios directos para su operación.'
      }
    ]
  },
  {
    id: 6,
    text: '¿Qué política fiscal prefiere?',
    dimension: 'economy',
    options: [
      {
        value: 1,
        label: 'A',
        text: 'Reducir impuestos drásticamente, menos gasto público',
        description: 'Política fiscal conservadora: recortar impuestos significativamente y reducir el tamaño del Estado y su gasto.'
      },
      {
        value: 2,
        label: 'B',
        text: 'Reducir impuestos moderadamente y eficientar el gasto',
        description: 'Reducción moderada de impuestos enfocándose en hacer más eficiente el uso de recursos públicos existentes.'
      },
      {
        value: 3,
        label: 'C',
        text: 'Mantener balance fiscal actual con mejoras de eficiencia',
        description: 'Mantener equilibrio entre ingresos y gastos actuales, mejorando la gestión sin cambios fiscales mayores.'
      },
      {
        value: 4,
        label: 'D',
        text: 'Aumentar impuestos a los más ricos para programas sociales',
        description: 'Política redistributiva: aumentar impuestos a sectores de mayores ingresos para financiar servicios sociales.'
      },
      {
        value: 5,
        label: 'E',
        text: 'Impuestos progresivos fuertes y amplio gasto social',
        description: 'Política fiscal progresista: impuestos altos a ricos y grandes empresas para financiar estado de bienestar robusto.'
      }
    ]
  },

  // EDUCACIÓN (2 preguntas)
  {
    id: 7,
    text: '¿Qué reforma educativa necesita Costa Rica?',
    dimension: 'education',
    options: [
      {
        value: 1,
        label: 'A',
        text: 'Educación privada y vouchers, competencia entre escuelas',
        description: 'Modelo de mercado: promover escuelas privadas y vouchers para que padres elijan, generando competencia entre centros.'
      },
      {
        value: 2,
        label: 'B',
        text: 'Mejorar gestión actual y evaluar docentes rigurosamente',
        description: 'Reforma administrativa: enfocarse en mejorar gestión existente y establecer evaluaciones docentes más estrictas.'
      },
      {
        value: 3,
        label: 'C',
        text: 'Modernizar currículo + tecnología + evaluación continua',
        description: 'Modernización balanceada: actualizar contenidos educativos, incorporar tecnología y evaluar progreso constantemente.'
      },
      {
        value: 4,
        label: 'D',
        text: 'Inversión fuerte en infraestructura y capacitación docente',
        description: 'Inversión en calidad: aumentar recursos para mejorar instalaciones y preparación profesional de educadores.'
      },
      {
        value: 5,
        label: 'E',
        text: 'Transformación completa: educación integral, gratuita y universal',
        description: 'Reforma estructural: rediseñar sistema educativo garantizando acceso universal, gratuito y de alta calidad para todos.'
      }
    ]
  },
  {
    id: 8,
    text: '¿Cuánto debe invertir el Estado en educación?',
    dimension: 'education',
    options: [
      {
        value: 1,
        label: 'A',
        text: 'Reducir y que familias asuman mayor responsabilidad',
        description: 'Inversión mínima: reducir presupuesto educativo público y transferir mayor responsabilidad a familias y sector privado.'
      },
      {
        value: 2,
        label: 'B',
        text: 'Mantener presupuesto actual optimizando recursos',
        description: 'Optimización: mantener inversión actual pero mejorar eficiencia y uso de recursos existentes.'
      },
      {
        value: 3,
        label: 'C',
        text: 'Cumplir el 8% del PIB mandato constitucional',
        description: 'Cumplimiento legal: respetar el mandato constitucional de invertir 8% del PIB en educación pública.'
      },
      {
        value: 4,
        label: 'D',
        text: 'Aumentar a 10% del PIB con enfoque en calidad',
        description: 'Inversión robusta: superar mandato constitucional invirtiendo 10% del PIB para mejorar calidad educativa.'
      },
      {
        value: 5,
        label: 'E',
        text: 'Máxima inversión posible, educación es prioridad nacional',
        description: 'Prioridad absoluta: destinar el máximo de recursos posibles porque educación es fundamental para el desarrollo.'
      }
    ]
  },

  // SALUD (2 preguntas)
  {
    id: 9,
    text: '¿Cómo resolver las listas de espera en la CCSS?',
    dimension: 'health',
    options: [
      {
        value: 1,
        label: 'A',
        text: 'Abrir completamente a servicios privados con seguro privado',
        description: 'Privatización: permitir que sector privado atienda pacientes en espera mediante seguros privados y libre competencia.'
      },
      {
        value: 2,
        label: 'B',
        text: 'Alianzas público-privadas para descongestionar hospitales',
        description: 'Complemento privado: usar clínicas privadas para reducir listas de espera manteniendo CCSS como base del sistema.'
      },
      {
        value: 3,
        label: 'C',
        text: 'Modernizar CCSS + tecnología + más personal médico',
        description: 'Modernización mixta: mejorar CCSS con tecnología, contratar más personal y permitir complementos privados regulados.'
      },
      {
        value: 4,
        label: 'D',
        text: 'Inversión fuerte en infraestructura y contrataciones públicas',
        description: 'Fortalecimiento público: aumentar presupuesto CCSS para construir más hospitales y contratar médicos públicos.'
      },
      {
        value: 5,
        label: 'E',
        text: 'Fortalecer modelo público exclusivamente con recursos',
        description: 'Sistema público exclusivo: resolver listas de espera únicamente fortaleciendo CCSS sin recurrir a sector privado.'
      }
    ]
  },
  {
    id: 10,
    text: '¿Cuál debe ser el modelo de salud en Costa Rica?',
    dimension: 'health',
    options: [
      {
        value: 1,
        label: 'A',
        text: 'Sistema privado, cada quien paga su seguro',
        description: 'Modelo privado: sistema de salud basado en seguros privados donde cada persona paga por su cobertura médica.'
      },
      {
        value: 2,
        label: 'B',
        text: 'Sistema mixto con opciones públicas y privadas',
        description: 'Modelo dual: ofrecer opciones tanto públicas como privadas, permitiendo a ciudadanos elegir su preferencia.'
      },
      {
        value: 3,
        label: 'C',
        text: 'CCSS fortalecida con complemento privado regulado',
        description: 'Modelo mixto regulado: mantener CCSS como eje principal pero permitir servicios privados regulados como complemento.'
      },
      {
        value: 4,
        label: 'D',
        text: 'Sistema público universal mejorado y digitalizado',
        description: 'Fortalecimiento público: mejorar CCSS con tecnología e infraestructura garantizando acceso universal de calidad.'
      },
      {
        value: 5,
        label: 'E',
        text: 'Salud 100% pública, gratuita y universal garantizada',
        description: 'Modelo público universal: sistema de salud completamente estatal, gratuito y garantizado como derecho para todos.'
      }
    ]
  },

  // SECTOR AGROPECUARIO (2 preguntas)
  {
    id: 11,
    text: '¿Cómo apoyar al sector agropecuario costarricense?',
    dimension: 'agriculture',
    options: [
      {
        value: 1,
        label: 'A',
        text: 'Libre competencia internacional, que sobreviva el más eficiente',
        description: 'Libre mercado: abrir competencia sin protecciones, permitir que productores más eficientes sobrevivan naturalmente.'
      },
      {
        value: 2,
        label: 'B',
        text: 'Facilitar exportaciones y tecnificación con apoyo mínimo',
        description: 'Apoyo a competitividad: facilitar acceso a mercados externos y tecnología sin protecciones arancelarias significativas.'
      },
      {
        value: 3,
        label: 'C',
        text: 'Balance: proteger productos sensibles y tecnificar',
        description: 'Enfoque selectivo: proteger productos estratégicos mientras se promueve modernización y tecnificación del sector.'
      },
      {
        value: 4,
        label: 'D',
        text: 'Protección arancelaria y créditos blandos a productores',
        description: 'Apoyo activo: usar aranceles para proteger productores locales y ofrecer financiamiento preferencial.'
      },
      {
        value: 5,
        label: 'E',
        text: 'Protección fuerte, subsidios y seguridad alimentaria nacional',
        description: 'Protección máxima: priorizar seguridad alimentaria con fuertes barreras comerciales y subsidios directos a productores.'
      }
    ]
  },
  {
    id: 12,
    text: '¿Qué prioridad tiene la seguridad alimentaria?',
    dimension: 'agriculture',
    options: [
      {
        value: 1,
        label: 'A',
        text: 'No es prioritario, importar es más eficiente',
        description: 'Prioridad baja: confiar en importaciones porque es más económico comprar alimentos en mercados internacionales.'
      },
      {
        value: 2,
        label: 'B',
        text: 'Importar lo necesario, producir lo competitivo',
        description: 'Enfoque pragmático: producir solo lo que Costa Rica hace eficientemente, importar el resto según costos.'
      },
      {
        value: 3,
        label: 'C',
        text: 'Balance entre producción nacional e importaciones',
        description: 'Equilibrio estratégico: mantener producción nacional significativa mientras se complementa con importaciones necesarias.'
      },
      {
        value: 4,
        label: 'D',
        text: 'Priorizar producción nacional, importar solo lo necesario',
        description: 'Preferencia local: favorecer producción nacional para la mayoría de alimentos, importar únicamente lo imprescindible.'
      },
      {
        value: 5,
        label: 'E',
        text: 'Autosuficiencia alimentaria debe ser meta nacional',
        description: 'Soberanía alimentaria: buscar producir internamente todos los alimentos posibles para no depender de importaciones.'
      }
    ]
  },

  // MEDIO AMBIENTE (2 preguntas)
  {
    id: 13,
    text: '¿Qué prioridad tiene la protección ambiental?',
    dimension: 'environment',
    options: [
      {
        value: 1,
        label: 'A',
        text: 'El desarrollo económico es más importante que el ambiente',
        description: 'Economía primero: priorizar crecimiento económico y empleo, las regulaciones ambientales pueden esperar.'
      },
      {
        value: 2,
        label: 'B',
        text: 'Proteger ambiente sin frenar desarrollo económico',
        description: 'Desarrollo con cuidado: proteger ambiente pero asegurando que no se limite el crecimiento económico del país.'
      },
      {
        value: 3,
        label: 'C',
        text: 'Balance entre desarrollo económico y protección ambiental',
        description: 'Equilibrio: buscar crecimiento económico sostenible que proteja recursos naturales sin frenar el desarrollo.'
      },
      {
        value: 4,
        label: 'D',
        text: 'Priorizar ambiente, desarrollo debe ser sostenible',
        description: 'Ambiente prioritario: todo desarrollo debe ser sostenible, proteger naturaleza es fundamental para el futuro.'
      },
      {
        value: 5,
        label: 'E',
        text: 'Máxima protección ambiental, limitar desarrollo si es necesario',
        description: 'Conservación absoluta: proteger ambiente es prioridad máxima, incluso si requiere limitar o detener proyectos económicos.'
      }
    ]
  },
  {
    id: 14,
    text: '¿Cómo avanzar en la descarbonización de Costa Rica?',
    dimension: 'environment',
    options: [
      {
        value: 1,
        label: 'A',
        text: 'No es prioritario, enfocarse en economía',
        description: 'Sin prisa: descarbonización no es urgente, priorizar crecimiento económico y competitividad empresarial primero.'
      },
      {
        value: 2,
        label: 'B',
        text: 'Avanzar gradualmente sin afectar competitividad',
        description: 'Transición gradual: avanzar hacia carbono neutralidad a ritmo que no afecte competitividad ni costos empresariales.'
      },
      {
        value: 3,
        label: 'C',
        text: 'Cumplir metas actuales con incentivos a empresas',
        description: 'Cumplimiento balanceado: seguir compromisos internacionales usando incentivos para que empresas adopten tecnologías limpias.'
      },
      {
        value: 4,
        label: 'D',
        text: 'Acelerar transición con inversión pública fuerte',
        description: 'Aceleración activa: invertir recursos públicos significativos para acelerar la transición hacia economía sin carbono.'
      },
      {
        value: 5,
        label: 'E',
        text: 'Liderazgo mundial: carbono neutral lo antes posible',
        description: 'Máxima ambición: convertir a Costa Rica en líder climático mundial logrando carbono neutralidad lo más rápido posible.'
      }
    ]
  },

  // REFORMAS INSTITUCIONALES (2 preguntas)
  {
    id: 15,
    text: '¿Qué reformas necesita el Estado costarricense?',
    dimension: 'reforms',
    options: [
      {
        value: 1,
        label: 'A',
        text: 'Reducir Estado al mínimo, privatizar instituciones públicas',
        description: 'Estado mínimo: reducir drásticamente tamaño del Estado, privatizar empresas públicas y limitar funciones gubernamentales.'
      },
      {
        value: 2,
        label: 'B',
        text: 'Reducir burocracia y mejorar eficiencia administrativa',
        description: 'Eficiencia administrativa: mantener estructura actual pero eliminar burocracia innecesaria y mejorar gestión.'
      },
      {
        value: 3,
        label: 'C',
        text: 'Modernizar y digitalizar sin cambios estructurales profundos',
        description: 'Modernización tecnológica: incorporar herramientas digitales y mejorar procesos sin cambiar estructuras institucionales.'
      },
      {
        value: 4,
        label: 'D',
        text: 'Reformas estructurales para fortalecer instituciones',
        description: 'Reestructuración: hacer cambios profundos en organización del Estado para fortalecer instituciones y mejorar servicios.'
      },
      {
        value: 5,
        label: 'E',
        text: 'Transformación profunda con participación ciudadana',
        description: 'Transformación democrática: rediseñar Estado con participación ciudadana activa en decisiones y control institucional.'
      }
    ]
  },
  {
    id: 16,
    text: '¿Cómo mejorar la transparencia y combatir la corrupción?',
    dimension: 'reforms',
    options: [
      {
        value: 1,
        label: 'A',
        text: 'Reducir Estado para reducir corrupción',
        description: 'Menos Estado: reducir tamaño del gobierno para disminuir oportunidades de corrupción y gasto público innecesario.'
      },
      {
        value: 2,
        label: 'B',
        text: 'Fortalecer controles existentes y sanciones',
        description: 'Fortalecer fiscalización: mejorar efectividad de órganos de control actuales y aumentar castigos por corrupción.'
      },
      {
        value: 3,
        label: 'C',
        text: 'Digitalización + transparencia + rendición de cuentas',
        description: 'Tecnología y apertura: usar plataformas digitales para hacer información pública accesible y facilitar rendición de cuentas.'
      },
      {
        value: 4,
        label: 'D',
        text: 'Reformar instituciones de control + participación ciudadana',
        description: 'Reforma con participación: reestructurar órganos de control e integrar mecanismos para que ciudadanos fiscalicen gobierno.'
      },
      {
        value: 5,
        label: 'E',
        text: 'Contraloría ciudadana y mecanismos de democracia directa',
        description: 'Poder ciudadano: dar a la ciudadanía control directo sobre instituciones mediante referendos, auditorías ciudadanas y revocatorias.'
      }
    ]
  },

  // POLÍTICA SOCIAL (2 preguntas)
  {
    id: 17,
    text: '¿Cómo combatir la pobreza y desigualdad?',
    dimension: 'social',
    options: [
      {
        value: 1,
        label: 'A',
        text: 'Responsabilidad individual, mínimos programas sociales',
        description: 'Responsabilidad personal: cada persona debe salir adelante por su esfuerzo, programas sociales limitados a casos extremos.'
      },
      {
        value: 2,
        label: 'B',
        text: 'Oportunidades de empleo, subsidios focalizados mínimos',
        description: 'Oportunidades laborales: enfocarse en crear empleos y dar ayudas solo a quienes realmente lo necesitan temporalmente.'
      },
      {
        value: 3,
        label: 'C',
        text: 'Balance: programas focalizados + generación de empleo',
        description: 'Enfoque mixto: combinar programas sociales dirigidos a población vulnerable con políticas de generación de empleo.'
      },
      {
        value: 4,
        label: 'D',
        text: 'Programas sociales amplios + servicios públicos de calidad',
        description: 'Apoyo robusto: ofrecer programas sociales amplios y servicios públicos de calidad como educación y salud para todos.'
      },
      {
        value: 5,
        label: 'E',
        text: 'Estado de bienestar fuerte: programas universales para todos',
        description: 'Estado protector: garantizar programas sociales universales, servicios públicos gratuitos y protección social amplia para todos.'
      }
    ]
  },
  {
    id: 18,
    text: '¿Qué prioridad tienen las pensiones y la seguridad social?',
    dimension: 'social',
    options: [
      {
        value: 1,
        label: 'A',
        text: 'Pensiones privadas individuales, eliminar IVM',
        description: 'Privatización: eliminar sistema público de pensiones (IVM) y que cada persona ahorre individualmente en fondos privados.'
      },
      {
        value: 2,
        label: 'B',
        text: 'Reformar IVM hacia cuentas individuales',
        description: 'Sistema mixto: reformar IVM hacia modelo de capitalización individual manteniendo gestión semi-pública.'
      },
      {
        value: 3,
        label: 'C',
        text: 'Reformar IVM manteniendo solidaridad del sistema',
        description: 'Reforma solidaria: ajustar IVM para hacerlo sostenible pero manteniendo principio de solidaridad intergeneracional.'
      },
      {
        value: 4,
        label: 'D',
        text: 'Fortalecer IVM con más aportes de sectores altos',
        description: 'Fortalecimiento redistributivo: aumentar aportes de sectores de altos ingresos para mejorar pensiones de todos.'
      },
      {
        value: 5,
        label: 'E',
        text: 'Sistema público solidario con pensiones dignas garantizadas',
        description: 'Garantía universal: sistema público robusto que garantice pensiones dignas para todos mediante solidaridad social.'
      }
    ]
  }
]

// Export también como 'questions' en minúsculas para compatibilidad
export const questions = QUESTIONS
