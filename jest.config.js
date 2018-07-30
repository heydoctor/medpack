module.exports = {
  collectCoverageFrom: ['src/**/*.ts'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)(spec).ts'],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
};
