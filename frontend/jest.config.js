module.exports = {
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}"],
  coverageThreshold: {
    global: {
      lines: 80
    }
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.[jt]sx?$': 'jest-esm-transformer',
  },
  transformIgnorePatterns: [
    "/node_modules/(?!axios)/"
  ],
};
