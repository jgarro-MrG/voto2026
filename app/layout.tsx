import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Voto2026 - Encuentra tu candidato ideal',
  description: 'Descubre qué plan de gobierno se alinea mejor con tus intereses para las elecciones presidenciales de Costa Rica 2026',
  keywords: ['elecciones', 'costa rica', '2026', 'presidenciales', 'candidatos', 'voto'],
  openGraph: {
    title: 'Voto2026 - Encuentra tu candidato ideal',
    description: 'Descubre qué plan de gobierno se alinea mejor con tus intereses',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
