import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages は https://<ユーザー名>.github.io/<リポジトリ名>/ で配信されるため、
  // 相対パスにしてリポジトリ名に依存せず動くようにする
  base: './',
})
