import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig, loadEnv } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 3000,
      host: true,
    },
    preview: {
      allowedHosts: ['shami.ventures'],
    },
    define: {
      'process.env': JSON.stringify(env),
    },
    plugins: [
      cloudflare({ viteEnvironment: { name: 'ssr' } }),
      tailwindcss(),
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
      tanstackStart({
        srcDirectory: 'src',
      }),
      viteReact(),
    ],
  }
})
