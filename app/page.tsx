import Link from 'next/link'
import { ArrowRight, Vote, BarChart3, Users } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cr-blue-50 via-white to-cr-red-50">
      {/* Header con colores de la bandera */}
      <header className="bg-gradient-to-r from-cr-blue-500 via-cr-white to-cr-red-500 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-cr-blue-700">Voto2026</h1>
            <Link
              href="/admin"
              className="text-sm text-cr-blue-600 hover:text-cr-blue-800 font-medium"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-4">
            <Vote className="w-16 h-16 text-cr-red-500 mx-auto" />
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-cr-blue-700 mb-6">
            Encuentra tu candidato ideal
          </h2>

          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Responde un cuestionario de 18 preguntas y descubre qué planes de gobierno
            se alinean mejor con tus intereses para las elecciones presidenciales de Costa Rica 2026.
          </p>

          <Link
            href="/cuestionario"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-lg font-bold transition-colors shadow-lg hover:shadow-xl"
            style={{
              backgroundColor: '#CE1126',
              color: '#FFFFFF',
              border: '2px solid #002B7F'
            }}
          >
            Comenzar Cuestionario
            <ArrowRight className="w-5 h-5" />
          </Link>

          <p className="text-sm text-gray-600 mt-4">
            ⏱️ Tiempo estimado: 5-7 minutos
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-md border-2 border-cr-blue-100">
            <div className="w-12 h-12 bg-cr-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Vote className="w-6 h-6 text-cr-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-cr-blue-700">Cuestionario Inteligente</h3>
            <p className="text-gray-700">
              18 preguntas cuidadosamente diseñadas que cubren 8 dimensiones clave de las propuestas de gobierno.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-2 border-cr-red-100">
            <div className="w-12 h-12 bg-cr-red-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-cr-red-600" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-cr-red-700">Resultados Detallados</h3>
            <p className="text-gray-700">
              Conoce tu afinidad con los 20 candidatos y visualiza tus coincidencias por dimensión.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-2 border-cr-blue-100">
            <div className="w-12 h-12 bg-cr-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-cr-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-cr-blue-700">Completamente Anónimo</h3>
            <p className="text-gray-700">
              Tus respuestas son privadas. Opcionalmente puedes crear una cuenta para guardar tus resultados.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-cr-blue-700 mb-4">
            ¿Listo para tomar una decisión informada?
          </h3>
          <Link
            href="/cuestionario"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-colors shadow-md"
            style={{
              backgroundColor: '#002B7F',
              color: '#FFFFFF',
              border: '2px solid #CE1126'
            }}
          >
            Empezar ahora
            <ArrowRight className="w-5 h-5" />
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
            No está afiliada a ningún partido político ni al TSE.
          </p>
          <p className="text-xs text-gray-600 mt-3 font-semibold">
            Elecciones: 1 de febrero de 2026
          </p>
        </div>
      </footer>
    </div>
  )
}
