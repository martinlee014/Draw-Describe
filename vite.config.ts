import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, '.', '');
  
  // Check for API key in various standard locations
  // 1. env.API_KEY (from .env)
  // 2. env.VITE_API_KEY (from .env with Vite prefix)
  // 3. process.env.API_KEY (system environment variable)
  const apiKey = env.API_KEY || env.VITE_API_KEY || process.env.API_KEY;

  return {
    plugins: [react()],
    define: {
      // Polyfill process.env.API_KEY so it works in the browser. 
      // JSON.stringify handles quotes correctly.
      'process.env.API_KEY': JSON.stringify(apiKey),
      // Prevent "process is not defined" error if process.env is accessed strictly
      'process.env': {} 
    }
  };
});