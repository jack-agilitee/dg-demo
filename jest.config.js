/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': '@swc/jest',
  },
  moduleNameMapper: {
    // CSS Modules
    '\\.module\\.(css|scss)$': 'identity-obj-proxy',

    // Next.js built-ins
    '^next/image$': '<rootDir>/jest.mocks.tsx',
    '^next/link$': '<rootDir>/jest.mocks.tsx',
    '^next/font/google$': '<rootDir>/jest.mocks.tsx',

    // Path aliases
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

module.exports = config;
