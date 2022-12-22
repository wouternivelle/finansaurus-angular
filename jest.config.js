module.exports = {
  preset: "jest-preset-angular",
  roots: ['src'],
  setupFilesAfterEnv: ["<rootDir>/src/jest-setup.ts"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -30,
    }
  }
}
