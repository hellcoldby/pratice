import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  define:{
    'process.env': {},
  },
  plugins: [react()]
})
// https://juejin.cn/post/7003722250960502820#heading-6