import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, '.', '');
  
  // Resolve API Key from available sources
  const apiKey = 
    process.env.API_KEY || 
    env.API_KEY || 
    env.VITE_API_KEY || 
    process.env.GOOGLE_API_KEY ||
    env.GOOGLE_API_KEY;

  return {
    plugins: [react()],
    define: {
      // If the key is found, inject it. 
      // If not found, we inject "undefined" so the code doesn't crash on "process is not defined",
      // but instead sees process.env.API_KEY as undefined.
      'process.env.API_KEY': JSON.stringify(apiKey),
    }
  };
});