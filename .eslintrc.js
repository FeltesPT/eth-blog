module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
  ],

  rules: {
    'vue/no-multiple-template-root': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  },

  root: false,

  env: {
    node: true
  },

  'extends': [
    'plugin:vue/vue3-recommended',
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/prettier'
  ],

  parser: "babel-eslint",

  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020
  }
}
