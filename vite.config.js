import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({

  plugins: [solid()],
  server: {
    base: "/mortgage_loan_cal/",
    // usePolling: true,
    watch: {
      usePolling: true,
    },
  },
})
