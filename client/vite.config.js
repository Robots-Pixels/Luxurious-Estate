import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ["redux-persist", "redux-persist/integration/react"],
},
  plugins: [react()],
  server: {
    proxy: {
      '/api' : {
        target: 'http://localhost:5000',
        secure: false
      }
    }
  }
})