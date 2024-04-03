module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  moduleFileExtensions: ['js', 'vue'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^vue$': '<rootDir>/node_modules/vue/dist/vue.common.js',
    '\\.(css|scss|sass|less)$': 'identity-obj-proxy'
  },
  testMatch: [
    '<rootDir>/test/unit/specs/**/*.js'
  ],
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  setupFiles: ['<rootDir>/test/unit/setup'],
  testURL: 'http://localhost',
  coverageDirectory: '<rootDir>/test/unit/coverage',
  coverageReporters: [
    'html',
    'text-summary',
    'cobertura'
  ],
  collectCoverageFrom: [
    'src/common/**/*.js',
    'src/components/**/*.js',
    'src/pages/**/*.js',
    'src/utils/**/*.js',
    '!src/utils/dnd.js',
    '!src/utils/document.js',
    '!src/utils/download.js',
    '!src/utils/tpl.js',
    '!src/utils/filters.js',
    '!src/utils/directives.js',
    '!src/utils/process.js',
    // vue component
    '!src/utils/toast.js',
    // constant
    '!src/constant/**',
    '!src/**/constant.js',
    '!**/node_modules/**'
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!axios)'
  ]
}
