import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import eslintConfigPrettier from 'eslint-config-prettier'

export default createConfigForNuxt({
  features: {
    typescript: {
      strict: true,
    },
  },
})
  .append(eslintConfigPrettier)
  .append({
    ignores: ['public/**', 'images/**'],
  })
