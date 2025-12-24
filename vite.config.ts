import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carga las variables de entorno según el modo (development / production)
  const env = loadEnv(mode, '.', '');

  return {
    // Configuración del servidor de desarrollo
    server: {
      port: 3000,
      host: '0.0.0.0', // Permite acceso externo (útil para VPS o Docker)
    },

    // Plugins utilizados por Vite
    plugins: [react()],

    // Variables de entorno expuestas al frontend
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },

    // Alias de rutas para imports más limpios
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
