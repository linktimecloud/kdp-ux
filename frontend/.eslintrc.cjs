/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:vue-pug/vue3-recommended',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  ignorePatterns: ['*.config.js'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  }
}
