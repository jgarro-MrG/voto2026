import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Colores de la bandera de Costa Rica
        'cr-blue': {
          50: '#e6f0ff',
          100: '#b3d1ff',
          200: '#80b3ff',
          300: '#4d94ff',
          400: '#1a75ff',
          500: '#002B7F', // Azul oficial de la bandera
          600: '#002266',
          700: '#001a4d',
          800: '#001133',
          900: '#00081a',
        },
        'cr-red': {
          50: '#fce8ec',
          100: '#f7c5cd',
          200: '#f29bab',
          300: '#ed7189',
          400: '#e84767',
          500: '#CE1126', // Rojo oficial de la bandera
          600: '#a50e1f',
          700: '#7c0a17',
          800: '#520710',
          900: '#290308',
        },
        'cr-white': '#FFFFFF',
        // Alias para compatibilidad
        primary: {
          50: '#e6f0ff',
          100: '#b3d1ff',
          200: '#80b3ff',
          300: '#4d94ff',
          400: '#1a75ff',
          500: '#002B7F',
          600: '#002266',
          700: '#001a4d',
          800: '#001133',
          900: '#00081a',
        },
      },
    },
  },
  plugins: [],
};
export default config;
