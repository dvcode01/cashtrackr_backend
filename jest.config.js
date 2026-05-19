const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  detectOpenHandles: true,
  openHandlesTimeout: 10 * 1000,
  transform: {
    ...tsJestTransformCfg,
  },
};