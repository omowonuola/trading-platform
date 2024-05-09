// module.exports = {
//   preset: "ts-jest",
//   testEnvironment: "node",
//   modulePathIgnorePatterns: ["<rootDir>/dist/"],
// };

module.exports = {
  testMatch: ["**/__tests__/**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
