import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  // Use '.' instead of process.cwd() to avoid potential type issues in some environments.
  const env = loadEnv(mode, '.', '');
  
  // Explicitly check env.API_KEY (from .env) and fallback to process.env.API_KEY (system env)
  const apiKey = env.API_KEY || process.env.API_KEY;

  return {
    plugins: [react()],
    define: {
      // Polyfill process.env.API_KEY so it works in the browser. 
      // JSON.stringify handles quotes correctly.
      'process.env.API_KEY': JSON.stringify(apiKey)
    }
  };
});