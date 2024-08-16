import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  base: "/mortgage_loan_calc/",
  plugins: [solid()],
  server: {
    watch: {
      usePolling: true,
    },
  },
})
