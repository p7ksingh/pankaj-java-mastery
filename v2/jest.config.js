/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/data/(.*)$': '<rootDir>/data/$1',
    '\\.module\\.css$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}

module.exports = config
