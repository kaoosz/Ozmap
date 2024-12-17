module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  globals: { "jest": true, },
  extends: ['standard-with-typescript', 'prettier'],
  plugins: ['prettier', "jest"],
  overrides: [
    {
      files: ['jest.config.ts', "**/*.test.js"],
      env: { "jest/globals": true },
      plugins: ["jest"],
      extends: ["plugin:jest/recommended"],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  rules: {
    'prettier/prettier': 'error',
    "jest/valid-expect": "error"
  },
};

