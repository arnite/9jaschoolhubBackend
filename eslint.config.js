// eslint.config.js
const eslintPluginPrettier = require('eslint-plugin-prettier');

module.exports = [
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': [
        'error',
        { trailingComma: 'es5', endOfLine: 'auto' },
      ],
      'comma-dangle': ['off'],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^next$' }],
      'linebreak-style': 'off',
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020, // or a version you prefer
      },
    },
  },
];
