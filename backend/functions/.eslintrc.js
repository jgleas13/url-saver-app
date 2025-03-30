module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "quotes": ["error", "double"],
    "max-len": ["error", { "code": 120 }],
    "indent": ["error", 2],
    "object-curly-spacing": ["error", "always"],
    "no-unused-vars": ["warn"],
    "comma-dangle": "off",
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
};
