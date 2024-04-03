module.exports = {
  root: true,
  env: {
    browser: true
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow object-curly-spacing
    'object-curly-spacing': 0,
    // allow standard/no-callback-literal
    'standard/no-callback-literal': 0,
    // allow debugger during development
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // vue related config
    'vue/no-mutating-props': 0,
    'vue/multi-word-component-names': 0,
    'vue/no-side-effects-in-computed-properties': 0
  },
  overrides: [
    {
      files: ['**/tests/unit/**/*.spec.js'],
      env: {
        jest: true
      }
    }
  ]
}
