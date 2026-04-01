import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Points to the Next.js app root so next/jest can load next.config.ts and .env files
  dir: './',
});

const config: Config = {
  testEnvironment: 'jest-environment-jsdom',

  // Run after the test framework is installed but before each test file
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  coverageProvider: 'v8',

  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    '!components/**/*.module.scss',
    '!components/**/*.stories.{ts,tsx}',
    '!**/index.ts',
  ],

  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },

  moduleNameMapper: {
    // CSS Modules — identity-obj-proxy returns the class name as-is,
    // which keeps assertions readable without real styles.
    '^.+\\.module\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
};

export default createJestConfig(config);
