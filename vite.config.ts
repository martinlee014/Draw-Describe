import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // The third parameter '' ensures we load all variables, not just those with VITE_ prefix.
  const env = loadEnv(mode, '.', '');
  
  // Try to resolve the API Key from various common naming conventions
  // Priority: 
  // 1. System environment variable (process.env.API_KEY) - often set in CI/CD or container
  // 2. .env file variable (env.API_KEY)
  // 3. VITE_ prefixed variable in .env (env.VITE_API_KEY)
  // 4. Common alternatives like GOOGLE_API_KEY
  const apiKey = 
    process.env.API_KEY || 
    env.API_KEY || 
    env.VITE_API_KEY || 
    process.env.GOOGLE_API_KEY ||
    env.GOOGLE_API_KEY;

  return {
    plugins: [react()],
    define: {
      // Define process.env.API_KEY global for the browser code to use.
      // If apiKey is found, inject it. If not, inject undefined.
      'process.env.API_KEY': apiKey ? JSON.stringify(apiKey) : 'undefined',
      
      // We do NOT define 'process.env': {} here to avoid breaking other libraries that might check for process existence.
      // Instead, we rely on the specific key replacement above.
    }
  };
});