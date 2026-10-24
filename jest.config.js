/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  // La primera vez mongodb-memory-server descarga MongoDB, por eso el timeout amplio.
  testTimeout: 120000,
};
