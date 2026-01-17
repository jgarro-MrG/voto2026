import Link from 'next/link'
import { ArrowRight, MessageSquare, Users, TrendingUp, Shield, BarChart3 } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cr-blue-50 via-white to-cr-red-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-cr-blue-500 via-cr-white to-cr-red-500 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-cr-blue-700">Voto2026</h1>
            <Link
              href="/dashboard"
              className="text-sm text-cr-blue-600 hover:text-cr-blue-800 font-medium"
            >
              Estadísticas
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cr-blue-100 text-cr-blue-700 mb-6">
            <MessageSquare className="w-5 h-5" />
            <span className="font-semibold">Debate Presidencial Virtual</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-cr-blue-700 mb-6">
            ¿Con cuál candidato coincides más?
          </h2>

          <p className="text-xl text-gray-700 mb-4 max-w-2xl mx-auto">
            Participa en un debate virtual con los 20 candidatos presidenciales.
            Escucha sus posturas y elige con cuál te identificas en cada tema.
          </p>

          <p className="text-lg text-cr-red-600 font-medium mb-8">
            Basado en las entrevistas oficiales del TSE a cada candidato.
          </p>

          <Link
            href="/cuestionario-debate"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-lg font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105"
            style={{
              backgroundColor: '#CE1126',
              color: '#FFFFFF',
              border: '3px solid #002B7F'
            }}
          >
            <MessageSquare className="w-5 h-5" />
            Iniciar Debate
            <ArrowRight className="w-5 h-5" />
          </Link>

          <p className="text-sm text-gray-600 mt-4">
            11 preguntas sobre temas clave para Costa Rica
          </p>
        </div>

        {/* How it works */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-cr-blue-700 mb-10">
            ¿Cómo funciona?
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md border-2 border-cr-blue-100 text-center">
              <div className="w-12 h-12 bg-cr-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h4 className="font-bold text-cr-blue-700 mb-2">Lee el tema</h4>
              <p className="text-gray-600 text-sm">
                Cada pregunta presenta un tema importante para el país con contexto relevante.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border-2 border-cr-red-100 text-center">
              <div className="w-12 h-12 bg-cr-red-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h4 className="font-bold text-cr-red-700 mb-2">Elige tu postura</h4>
              <p className="text-gray-600 text-sm">
                Selecciona la posición que mejor represente tu opinión entre las posturas reales de los candidatos.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border-2 border-cr-blue-100 text-center">
              <div className="w-12 h-12 bg-cr-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h4 className="font-bold text-cr-blue-700 mb-2">Descubre tu afinidad</h4>
              <p className="text-gray-600 text-sm">
                Al finalizar, conoce qué candidatos comparten más posturas contigo.
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 max-w-5xl mx-auto">
          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
            <Users className="w-8 h-8 text-cr-blue-600 mb-3" />
            <h4 className="font-bold text-gray-900 mb-1">20 Candidatos</h4>
            <p className="text-gray-600 text-sm">
              Todos los candidatos inscritos ante el TSE
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
            <MessageSquare className="w-8 h-8 text-cr-red-600 mb-3" />
            <h4 className="font-bold text-gray-900 mb-1">Formato Debate</h4>
            <p className="text-gray-600 text-sm">
              Posturas reales extraídas de entrevistas del TSE
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
            <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
            <h4 className="font-bold text-gray-900 mb-1">Carrera en Vivo</h4>
            <p className="text-gray-600 text-sm">
              Opción de ver resultados mientras respondes
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
            <Shield className="w-8 h-8 text-purple-600 mb-3" />
            <h4 className="font-bold text-gray-900 mb-1">100% Anónimo</h4>
            <p className="text-gray-600 text-sm">
              Tus respuestas son completamente privadas
            </p>
          </div>
        </div>

        {/* Topics covered */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-cr-blue-700 mb-8">
            Temas del debate
          </h3>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              'Seguridad Ciudadana',
              'Economía y Empleo',
              'Educación',
              'Salud',
              'Agricultura',
              'Medio Ambiente',
              'Reformas del Estado',
              'Política Social',
              'Estilo de Liderazgo',
              'Experiencia',
              'Prioridades'
            ].map((topic) => (
              <span
                key={topic}
                className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 border-2 border-cr-blue-100 shadow-sm"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center bg-gradient-to-r from-cr-blue-100 via-white to-cr-red-100 rounded-2xl p-10 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-cr-blue-700 mb-4">
            ¿Listo para participar en el debate?
          </h3>
          <p className="text-gray-600 mb-6">
            Toma una decisión informada para las elecciones del 1 de febrero de 2026.
          </p>
          <Link
            href="/cuestionario-debate"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-md hover:shadow-lg hover:scale-105"
            style={{
              backgroundColor: '#002B7F',
              color: '#FFFFFF',
              border: '2px solid #CE1126'
            }}
          >
            Comenzar ahora
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Stats link */}
        <div className="mt-12 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-cr-blue-600 hover:text-cr-blue-800 font-medium"
          >
            <BarChart3 className="w-4 h-4" />
            Ver estadísticas de participación
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t-2 border-cr-blue-200 py-8 bg-gradient-to-r from-cr-blue-50 via-white to-cr-red-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-800 font-medium">
            Voto2026 - Herramienta educativa e independiente para las elecciones presidenciales de Costa Rica
          </p>
          <p className="text-sm text-gray-700 mt-2">
            Posturas extraídas de las entrevistas oficiales del TSE. No afiliada a ningún partido político.
          </p>
          <p className="text-xs text-gray-600 mt-3 font-semibold">
            Elecciones: 1 de febrero de 2026
          </p>
        </div>
      </footer>
    </div>
  )
}
